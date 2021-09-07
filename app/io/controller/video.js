"use strict";
const rooms = {};
let ns;
const Controller = require("egg").Controller;

class VideoController extends Controller {
  //后端接收到roomID，将通知对方也加入到 rommID中
  async joinRoom() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const {user, receiver} = ctx.args[0];
    let roomId = user.roomId;
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push({
      ...user,
    });
    ctx.socket.join(roomId);
    // console.log(receiver);
    ns.sockets[receiver.socketId].emit("receiverJoinRoom", {
      receiver,
    });
  }
  async receiverJoinRoom() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const {receiver} = ctx.args[0];
    let roomId = receiver.roomId;
    rooms[roomId].push({
      ...receiver,
    });
    // console.log(rooms[roomId]);
    // console.log("接收者接入roomId", roomId);
    ctx.socket.join(roomId);
  }
  async toSendVideo() {
    const {ctx, app} = this;
    let ns = app.io.of("/");
    const user = ctx.args[0];
    ns.to(user.roomId).emit("receiveVideo", user);
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
    ns.to(user.roomId).emit("answerVideo", user);
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
    // console.log("B端:", toUser);
    // console.log("A端:", data.user);
    ns.to(toUser.socketId).emit("receiveOffer", data.offer);
  }
  async receiveAnsewer() {
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
