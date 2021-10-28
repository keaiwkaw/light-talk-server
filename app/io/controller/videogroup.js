"use strict";
let localStreamIdList = [];
const Controller = require("egg").Controller;

class VideogroupController extends Controller {
  //将offer转发给除了自己之外的所有用户
  async receiveOfferGroup() {
    const {ctx, app} = this;
    const {group, user, offer} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    namespace.to(groupRoom[idx]).emit("receiveOfferGroup", {user, offer});
    ctx.socket.join(groupRoom[idx]);
    console.log("receive offer");
  }
  //将answer 转发给除了自己之外的所有用户
  async receiveAnswerGroup() {
    const {ctx, app} = this;
    const {group, user, answer} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    namespace.to(groupRoom[idx]).emit("receiveOfferGroup", {user, answer});
    ctx.socket.join(groupRoom[idx]);
    console.log("receive answer");
  }
  //将ice代理转发给除了自己之外的所有用户
  async addIceCandidateGroup() {
    const {ctx, app} = this;
    const {group, user, candidate} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    namespace
      .to(groupRoom[idx])
      .emit("addIceCandidateGroup", {user, candidate});
    ctx.socket.join(groupRoom[idx]);
    console.log("receive ice");
  }
  async answerVideoGroup() {
    const {ctx, app} = this;
    const {group, user} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    console.log("通知他们显示加入群聊");
    namespace.to(groupRoom[idx]).emit("answerVideoGroup");
  }
}

module.exports = VideogroupController;
