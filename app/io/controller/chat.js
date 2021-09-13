"use strict";
const online = {};
const Controller = require("egg").Controller;

class ChatController extends Controller {
  async addPeople() {
    const {ctx, app} = this;
    const namespace = app.io.of("/");
    const {userID, socketID} = ctx.args[0];
    online[userID] = socketID;
    namespace.emit("setOnline", online);
    console.log("当前连接的用户的数量：", Object.keys(online).length);
  }
  async deletePeople() {
    const {ctx, app} = this;
    const namespace = app.io.of("/");
    const {userID, socketID} = ctx.args[0];
    delete online[userID];
    namespace.emit("setOnline", online);
  }
  async sendMessage() {
    const {ctx, app} = this;
    const namespace = app.io.of("/");
    const {user, message, socketID} = ctx.args[0];
    // console.log("socketID", socketID);
    // console.log(namespace.sockets);
    if (socketID !== "") {
      namespace.sockets[socketID].emit("receive", {
        user,
        message,
      });
    }
  }
}

module.exports = ChatController;
