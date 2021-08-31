"use strict";
const online = {};
const Controller = require("egg").Controller;

class ChatController extends Controller {
  async acceptMessage() {
    const {ctx, app} = this;
  }
  async addPeople() {
    const {ctx, app} = this;
    const namespace = app.io.of("/");
    const {userID, socketID} = ctx.args[0];
    online[userID] = socketID;
    namespace.emit("setOnline", online);
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
    console.log("socketID", socketID);
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
