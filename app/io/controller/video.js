"use strict";
const rooms = {};
let ns;
const Controller = require("egg").Controller;

class VideoController extends Controller {
  //后端接收到roomID，将通知对方也加入到 rommID中
  async joinRoom() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const {user, receiver, boo} = ctx.args[0];
    let roomId = user.roomId;
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push({
      ...user,
    });
    rooms[roomId].push({
      ...receiver,
    });
    console.log("发送者要加入房间的ID是", roomId);
    ns.sockets[receiver.socketId].join(roomId); //接收者加入房间，
    ns.sockets[user.socketId].join(roomId); //发送者加入房间，
    ns.to(user.roomId).emit("receiveVideo", {user, receiver, boo});
  }
  async cancelSendVideo() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const user = ctx.args[0];
    ns.to(user.roomId).emit("cancelSendVideo", user);
  }
  async receiveVideo() {
    const {ctx, app} = this;
    const user = ctx.args[0];
    let ns = app.io.of("/");
    ns.to(user.roomId).emit("receiveVideo", user);
  }
  async rejectReceiveVideo() {
    const {ctx, app} = this;
    const user = ctx.args[0];
    let ns = app.io.of("/");
    ns.to(user.roomId).emit("rejectReceiveVideo", user);
  }
  async answerVideo() {
    const {ctx, app} = this;
    const user = ctx.args[0];
    let ns = app.io.of("/");
    console.log("接收了视频邀请，我要开始通知他们建立视频流了", user.roomId);
    ns.to(user.roomId).emit("answerVideo", user);
  }
  async answerFile() {
    const {ctx, app} = this;
    const user = ctx.args[0];
    let ns = app.io.of("/");
    // console.log("接收了视频邀请，我要开始通知他们建立视频流了", user.roomId);
    ns.to(user.roomId).emit("initP2P", user);
  }
  async hangupVideo() {
    const {ctx, app} = this;
    const user = ctx.args[0];
    let ns = app.io.of("/");
    ns.to(user.roomId).emit("hangupVideo", user);
  }
  // addIceCandidate
  async addIceCandidate() {
    const {ctx, app} = this;
    const data = ctx.args[0];
    const toUser = rooms[data.user.roomId].find(
      (item) => item.socketId !== data.user.socketId
    );
    let ns = app.io.of("/");
    ns.to(toUser.socketId).emit("addIceCandidate", data.candidate);
  }
  async receiveOffer() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const data = ctx.args[0];
    const toUser = rooms[data.user.roomId].find(
      (item) => item.socketId !== data.user.socketId
    );
    ns.to(toUser.socketId).emit("receiveOffer", data.offer);
  }
  async receiveAnswer() {
    const {ctx, app} = this;
    const data = ctx.args[0];
    const toUser = rooms[data.user.roomId].find(
      (item) => item.socketId !== data.user.socketId
    );
    let ns = app.io.of("/");
    ns.to(toUser.socketId).emit("receiveAnsewer", data.answer);
  }
}

module.exports = VideoController;
