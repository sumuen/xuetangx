const got = require('got');
const fs = require('fs');

// 引入答案库
const answerBank = require('./answerBank.json');  // 请修改为你实际的答案库文件路径

// 引入未作答问题的数据
const unansweredProblems = require('./unansweredProblems.json');  // 请修改为你实际的未作答问题文件路径

// 过滤出在答案库中存在的问题
const problemsToAnswer = unansweredProblems.filter(problem => {
  return answerBank[problem.problemId] !== undefined;
});

let index = 0;
let failureCount = 0;  // 记录失败的次数
const totalProblems = problemsToAnswer.length;  // 总问题数量

console.log(`发现${unansweredProblems.length}个需要作答的问题`);
console.log(`其中${problemsToAnswer.length}个问题在答案库中存在,开始作答...`);


// 请求头
const headers = {
  'Content-Type': 'application/json',
  'X-CSRFToken': 'Axa3vrCVysp5SMXsQediYSfhafWZoilF', 
  'Cookie': '_abfpc=5bab7f7567b2a55a55fc74b55ab983162c386ea5_2.0; csrftoken=Axa3vrCVysp5SMXsQediYSfhafWZoilF; sessionid=gvwm8n8vzbitlxzmcwdahp4hktbobbbw;'
};


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
    leaf_id: 30214108,  // 
    classroom_id: 14768365,  // 
    exercise_id: exerciseId,
    problem_id: problemId,
    sign: "THU12041000310",  // 
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
