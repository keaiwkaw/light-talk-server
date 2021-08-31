

## 大概记录一下
```
router.js 
io.of('/).route('chat',io.controller.chat)
//前端触发chat事件，执行服务的io/controller/chat.js里面的函数
``` 

前端触发send事件-》触发服务端事件 ，服务的触发前端事件将消息传递给前端