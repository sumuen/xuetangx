const got = require('got');
const fs = require('fs');
const readline = require('readline');

// 请求的URL列表
const urls = [
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693520/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693521/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693522/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693523/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693524/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693525/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693526/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693527/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693528/6801790/',
    'https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693529/6801790/',
  ];
// 引用答案库对象
const answerBank = require('./answerBank.json');  

// 创建未回答问题对象
const unansweredProblems = [];

// 从用户输入获取cookie
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入cookie: ', (cookie) => {
  // 提取X-CSRFToken和其他值
  const _abfpc = cookie.match(/_abfpc=([^;]*);/)[1];
  const csrftoken = cookie.match(/csrftoken=([^;]*);/)[1];
  const sessionid = cookie.match(/sessionid=([^;]*);/)[1];

  // 设置请求头
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken, 
    'Cookie': `_abfpc=${_abfpc}; csrftoken=${csrftoken}; sessionid=${sessionid};`
  };

  // 处理每个URL
  urls.forEach((url, index) => {
    got(url, { headers })
      .then(response => {
        const data = JSON.parse(response.body).data;

        // 遍历每个问题
        for(const problem of data.problems) {
          // 如果用户未回答问题，保存问题信息
          if(!problem.user.is_show_answer) {
            const content = problem.content;
            const problemId = content.ProblemID;
            const exerciseId = data.exercise_id;

            unansweredProblems.push({ problemId, exerciseId });
          }
        }

        // 将未回答问题信息写入JSON文件
        fs.writeFileSync('unansweredProblems.json', JSON.stringify(unansweredProblems), 'utf8');
      })
      .catch(err => {
        console.error(err);
      });
      
      if (index === urls.length - 1) {
        // 开始回答问题
        answerProblems(headers);
      }
  });

  // 关闭readline接口
  rl.close();
});

function answerProblems(headers) {
  // 引入未作答问题的数据
  const unansweredProblems = require('./unansweredProblems.json');

  // 过滤出在答案库中存在的问题
  const problemsToAnswer = unansweredProblems.filter(problem => {
    return answerBank[problem.problemId] !== undefined;
  });

  let index = 0;
  let failureCount = 0;  // 记录失败的次数
  const totalProblems = problemsToAnswer.length;  // 总问题数量

  console.log(`发现${unansweredProblems.length}个需要作答的问题`);
  console.log(`其中${problemsToAnswer.length}个问题在答案库中存在,开始作答...`);

  function submitAnswer() {
    if (index >= totalProblems) {
      console.log(`作答完成，失败${failureCount}个`);
      return;
    }

    const problem = problemsToAnswer[index];
    const problemId = problem.problemId;
    const exerciseId = problem.exerciseId;
    const answer = answerBank[problemId];  // 从答案库中提取答案

    const body = {
      leaf_id: 30214108,
      classroom_id: 14768365,
      exercise_id: exerciseId,
      problem_id: problemId,
      sign: "THU12041000310",
      answers: {},
      answer: answer
    };

    console.log(`正在作答第${index + 1}个问题`);

    // 发送请求
    got.post('https://www.xuetangx.com/api/v1/lms/exercise/problem_apply/', { headers, body: JSON.stringify(body) })
      .then(response => {
        const data = JSON.parse(response.body);

        // 检查响应以确定是否成功提交答案
        if(data.success) {
          console.log(`Problem ${problemId} answered successfully.`);
        } else if(data.error_code === 80001) {
          console.log(`Problem ${problemId} has been answered.`);
        } else {
          console.log(`Problem ${problemId} failed to answer. Reason: ${data.message}`);
          failureCount++;
        }

        index++;
        setTimeout(submitAnswer, 3000);  // 延迟3秒后再次调用函数
      })
      .catch(err => {
        console.error(err);
        failureCount++;  // 如果请求失败，也视为作答失败
        index++;
        setTimeout(submitAnswer, 3000);  // 延迟3秒后再次调用函数
      });
  }

  // 首次调用函数
  submitAnswer();
}
