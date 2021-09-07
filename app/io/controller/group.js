"use strict";

const Controller = require("egg").Controller;
const rooms = [];
class GroupController extends Controller {
  //添加
  async addGroup() {
    const {ctx, app} = this;
    const {userGroups} = ctx.args[0];
    //将群_id作为命名空间并加入该命名空间
    for (let i = 0; i < userGroups.length; i++) {
      if (!rooms.includes(userGroups[i]._id)) {
        rooms.push(userGroups[i]._id);
      }
    }
    //将当前用户加入到对应的roomname 中
    for (let j = 0; j < userGroups.length; j++) {
      let idx = rooms.indexOf(userGroups[j]._id);
      if (idx != -1) {
        ctx.socket.join(rooms[j]);
      }
    }
  }
  async sendMessage() {
    const {ctx, app} = this;
    const namespace = app.io.of("/");
    const {user, message, group} = ctx.args[0];
    let idx = rooms.indexOf(group._id);
    console.log("我收到的消息是:", message);
    console.log("当前的命名空间有", rooms);
    ctx.socket.leave(rooms[idx]);
    namespace.to(rooms[idx]).emit("receive", {
      user,
      message,
      group,
    });
    ctx.socket.join(rooms[idx]);
  }
}

module.exports = GroupController;
