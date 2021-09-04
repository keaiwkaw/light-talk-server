"use strict";

const Group = require("../model/Group");
const User = require("../model/User");

const dp = {};
const Controller = require("egg").Controller;
let uid = 1;
class GroupController extends Controller {
  async createGroup() {
    //群主 2 管理 1 群员 0
    const {ctx} = this;
    const Group = ctx.model.Group;
    const User = ctx.model.User;
    const {selfID, form} = ctx.request.body;
    const {nickname, avatar, groupOfPublic} = form;
    let group = await Group.create({
      uid: uid++,
      nickname,
      avatar,
      groupOfPublic,
      groupMembers: [{user: selfID, type: 2}],
    });
    ctx.body = {
      group,
      message: "创建群聊成功",
      code: 200,
    };
  }
  async getGroups() {
    const {ctx} = this;
    const User = ctx.model.User;
    const Group = ctx.model.Group;
    const {selfID} = ctx.query;
    const list = await Group.find({"groupMembers.user": selfID}).populate(
      "groupMembers.user"
    );
    ctx.body = {
      groups: list,
      code: 200,
      message: "获取群列表成功",
    };
  }
  async searchGroupToType() {
    const {ctx} = this;
    const User = ctx.model.User;
    const Group = ctx.model.Group;
    const {type, value, selfID} = ctx.query;

    const reg = new RegExp(value, "i"); //不区分大小写
    let res = [];
    switch (type) {
      case "group":
        res = await Group.find({
          $or: [{uid: {$regex: reg}}, {nickname: {$regex: reg}}],
          $nor: [{"groupMembers.user": selfID}],
        });
        break;
      default:
        res = [];
    }
    ctx.body = {
      list: res,
      code: 200,
      message: "查询成功",
    };
  }
  async sendRequestAddGroup() {
    const {ctx} = this;
    const User = ctx.model.User; //获取User模型
    const Group = ctx.model.Group; //获取User模型
    const {selfID, groupID, message} = ctx.request.body;
    let res = await Group.findOne({_id: groupID, "requestList.user": selfID});
    if (res) {
      ctx.body = {
        message: "请勿重复发送请求嗷",
        code: 200,
      };
    } else {
      await Group.findByIdAndUpdate(groupID, {
        $addToSet: {requestList: {user: selfID, state: 0, message}},
      });
      ctx.body = {
        message: "发送请求成功",
        code: 200,
      };
    }

    // otherID ：群id
    //userID ：请求加群人的ID
    //我发送一个加 A 群请求，
    //将我的加 A 群的请求发送到每一个A 群的管理或者群主的groups里面
  }
  //处理请求，我需要把请求群的ID，将群里请求列表更新了，并且把人加入到群的成员中
  async dealRequestAddGroup() {
    const {ctx} = this;
    const {groupID, code, userID} = ctx.request.body;
    const User = ctx.model.User;
    const Group = ctx.model.Group;

    if (code == 1) {
      await Group.updateOne(
        {_id: groupID, "requestList.user": userID},
        {
          $set: {"requestList.$.state": 1},
        }
      );
      await Group.findByIdAndUpdate(groupID, {
        $addToSet: {groupMembers: {user: userID, type: 0}},
      });
    } else {
      await Group.updateOne(
        {_id, groupID, "requestList.user": userID},
        {
          $set: {"requestList.$.state": 2},
        }
      );
    }

    ctx.body = {
      message: "处理成功",
      code: 200,
    };
  }
  //获取群列表
  async getRequestListGroup() {
    const {ctx} = this;
    const {selfID, type} = ctx.query;
    const Group = ctx.model.Group;
    const myManGroups = await Group.find({
      "groupMembers.user": selfID,
      "groupMembers.type": 2,
    }).populate("requestList.user");
    let p = 0;
    switch (type) {
      case "passing":
        p = 0;
        break;
      case "pass":
        p = 1;
        break;
      case "unpass":
        p = 2;
        break;
    }
    let list = [];
    for (let i = 0; i < myManGroups.length; i++) {
      let group = myManGroups[i];
      let requestList = group.requestList.filter((i) => i.state == p);
      group.requestList = requestList;
      list.push(group);
    }

    ctx.body = {
      code: 200,
      message: "获取群聊列表成功",
      list,
    };
  }
}

module.exports = GroupController;
