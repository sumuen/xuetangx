## 速通公共安全危机管理-学堂在线
1. 构建答案json库，通过已完成习题的cookie进行查询习题答案，（已完成的问题，problem中user中会有answer数据，即正确答案）并提取到“包含每套习题的exercise_id，每个问题的problem_id”的文件中
2. 通过exercise_list提取每套习题的exercise_id，每个问题的problem_id
3. 通过1获得的exercise_id和problem_id向答案json文件中寻找对应的answer，并拼装出提交答案的请求体
4. 发送请求
5. 通过分析响应体来分析是否提交答案成功

## 1.构建答案json库

通过exercise_list提取每套习题的exercise_id，每个问题的problem_id已完成题目的answer

所有章节习题的api链接

> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693520/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693521/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693522/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693523/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693524/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693525/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693526/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693527/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693528/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693529/6801790/

通过之前分析本地json文件的方式，实现答案的提取，生成到新的json文件中

具体操作

```
1.构建api请求
2.发送api请求
3.分析响应，找到每套习题的exercise_id，每个问题的problem_id已完成题目的answer
4.提取数据到新的answer.json文件中
```



## 2.通过exercise_list提取每套习题的exercise_id，未作答问题的problem_id

请求下面十个章节的习题链接获取到所有的习题，并通过脚本提取出每章中user数据is_show_answer=False的题目，记录他们的exercise_id，每个问题的problem_id

> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693520/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693521/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693522/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693523/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693524/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693525/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693526/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693527/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693528/6801790/
> https://www.xuetangx.com/api/v1/lms/exercise/get_exercise_list/2693529/6801790/

## 3.拼装出提交答案的请求

```javascript
{"leaf_id":30214108,"classroom_id":14768365,"exercise_id":第二步获得,"problem_id":第二步获得,"sign":"THU12041000310","answers":{},"answer":["查询答案json文件获得"]}
```

## 4.提交答案请求

请求头必须：X-CSRFToken（这个戳随token生成），Cookie（用户登录生成）

```
POST https://www.xuetangx.com/api/v1/lms/exercise/problem_apply/
Host: www.xuetangx.com
Content-Type: application/json
X-CSRFToken: Axa3vrCVysp5SMXsQediYSfhafWZoilF
Cookie: xxxxxxxxxxx
Content-Length: 140

{"leaf_id":30214108,"classroom_id":14768365,"exercise_id":2693529,"problem_id":25492581,"sign":"THU12041000310","answers":{},"answer":["B"]}
```



## 5.分析请求的响应进行判断是否答题成功

## 