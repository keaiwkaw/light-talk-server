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

  //群聊接口
  router.post("/createGroup", controller.group.createGroup);
  router.get("/getGroups", controller.group.getGroups);
  router.get("/searchGroupToType", controller.group.searchGroupToType);
  router.post("/sendRequestAddGroup", controller.group.sendRequestAddGroup);
  router.post("/dealRequestAddGroup", controller.group.dealRequestAddGroup);
  router.get("/getRequestListGroup", controller.group.getRequestListGroup);

  //io 接口
  io.of("/").route("chat", io.controller.chat.acceptMessage);
  io.of("/").route("addPeople", io.controller.chat.addPeople);
  io.of("/").route("deletePeople", io.controller.chat.deletePeople);
  io.of("/").route("sendMessage", io.controller.chat.sendMessage);
};
