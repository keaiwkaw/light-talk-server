"use strict";
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const {router, controller, io} = app;
  // const auth = app.middleware.auth();
  // const upload = app.middleware.upload();

  router.post("/upload", controller.utils.upload);
  router.post("/login", controller.user.login);
  router.post("/sendRequestAdd", controller.friend.sendRequestAdd);
  router.post("/getFriends", controller.friend.getFriends);
  router.post("/dealRequestAdd", controller.friend.dealRequestAdd);
  router.post("/dealRequestAdd", controller.friend.dealRequestAdd);
  router.post("/deleteFriends", controller.friend.deleteFriends);
  router.post("/getRequestList", controller.friend.getRequestList);
  router.post("/searchPeopleToType", controller.friend.searchPeopleToType);

  //加群接口
  router.post("/createGroup", controller.group.createGroup);
  router.get("/getGroups", controller.group.getGroups);
  router.get("/searchGroupToType", controller.group.searchGroupToType);
  router.post("/sendRequestAddGroup", controller.group.sendRequestAddGroup);
  router.post("/dealRequestAddGroup", controller.group.dealRequestAddGroup);
  router.get("/getRequestListGroup", controller.group.getRequestListGroup);

  //io 接口
  io.of("/").route("addPeople", io.controller.chat.addPeople);
  io.of("/").route("deletePeople", io.controller.chat.deletePeople);
  io.of("/").route("sendMessage", io.controller.chat.sendMessage);
  //群聊接口
  io.of("/").route("sendMessageByGroup", io.controller.group.sendMessage);
  io.of("/").route("addGroup", io.controller.group.addGroup);

  //视频接口
  io.of("/").route("joinRoom", io.controller.video.joinRoom);
  io.of("/").route("cancelSendVideo", io.controller.video.cancelSendVideo);
  io.of("/").route("receiveVideo", io.controller.video.receiveVideo);
  io.of("/").route(
    "rejectReceiveVideo",
    io.controller.video.rejectReceiveVideo
  );
  io.of("/").route("answerVideo", io.controller.video.answerVideo);
  io.of("/").route("hangupVideo", io.controller.video.hangupVideo);
  io.of("/").route("addIceCandidate", io.controller.video.addIceCandidate);
  io.of("/").route("receiveOffer", io.controller.video.receiveOffer);
  io.of("/").route("receiveAnswer", io.controller.video.receiveAnswer);

  //群聊音视频
  io.of("/").route(
    "answerVideoGroup",
    io.controller.videogroup.answerVideoGroup
  );

  io.of("/").route(
    "addIceCandidateGroup",
    io.controller.videogroup.addIceCandidateGroup
  );
  io.of("/").route(
    "receiveOfferGroup",
    io.controller.videogroup.receiveOfferGroup
  );
  io.of("/").route(
    "receiveAnswerGroup",
    io.controller.videogroup.receiveAnswerGroup
  );
  io.of("/").route("updatePeerList", io.controller.videogroup.updatePeerList);
};
