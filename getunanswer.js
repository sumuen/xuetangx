const got = require('got');
const fs = require('fs');

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

// 创建答案库对象
const answerBank = {};

// 请求头
const headers = {
  'X-CSRFToken': 'Axa3vrCVysp5SMXsQediYSfhafWZoilF', 
  'Cookie': '_abfpc=5bab7f7567b2a55a55fc74b55ab983162c386ea5_2.0;sessionid=gvwm8n8vzbitlxzmcwdahp4hktbobbbw;'
};
  
  // 创建未回答问题对象
  const unansweredProblems = [];
  
  for(const url of urls) {
    // 发送请求
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
  }
  