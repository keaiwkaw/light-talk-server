"use strict";
let peerList = [];
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
    namespace.to(groupRoom[idx]).emit("receiveOfferGroup", offer);
    ctx.socket.join(groupRoom[idx]);
  }
  //将answer 转发给除了自己之外的所有用户
  async receiveAnswerGroup() {
    const {ctx, app} = this;
    const {group, user, answer} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    namespace.to(groupRoom[idx]).emit("receiveOfferGroup", answer);
    ctx.socket.join(groupRoom[idx]);
  }
  //将ice代理转发给除了自己之外的所有用户
  async addIceCandidateGroup() {
    const {ctx, app} = this;
    const {group, user, candidate} = ctx.args[0];
    const {groupRoom} = app;
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    namespace.to(groupRoom[idx]).emit("addIceCandidateGroup", candidate);
    ctx.socket.join(groupRoom[idx]);
  }
  async answerVideoGroup() {
    const {ctx, app} = this;
    const {group, user} = ctx.args[0];
    const {groupRoom} = app;
    // console.log("在线用户所有群的id", groupRoom);
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);
    ctx.socket.leave(groupRoom[idx]);
    console.log("我要通知群的是：", groupRoom[idx]);
    namespace.to(groupRoom[idx]).emit("answerVideoGroup", ctx.args[0]);
    ctx.socket.join(groupRoom[idx]);
  }
  async updatePeerList() {
    const {ctx, app} = this;
    const {group, peer, user} = ctx.args[0];
    const {groupRoom} = app;
    // console.log("在线用户所有群的id", groupRoom);
    const namespace = app.io.of("/");
    let idx = groupRoom.indexOf(group._id);

    peerList.push({
      user,
      peer,
    });
    namespace.to(groupRoom[idx]).emit("answerVideoGroup", peerList);
  }
}

module.exports = VideogroupController;
