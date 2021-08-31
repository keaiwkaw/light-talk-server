"use strict";
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
      groupMembers: [selfID],
    });
    await User.updateOne(
      {_id: selfID},
      {
        $addToSet: {
          grouplist: {
            group: group._id,
            type: 2,
          },
        },
      }
    );
    ctx.body = {
      group,
      message: "创建群聊成功",
      code: 200,
    };
  }
  async getGroups() {
    const {ctx} = this;
    const User = ctx.model.User;
    const {selfID} = ctx.query;
    const self = await User.findById(selfID).populate("grouplist.group");
    let groups = [];
    ctx.body = {
      groups: self.grouplist || [],
      code: 200,
      message: "获取群列表成功",
    };
  }
  async searchGroupToType() {
    const {ctx} = this;
    const User = ctx.model.User;
    const Group = ctx.model.Group;
    const {type, value, selfID} = ctx.query;
    let grouplist = await User.findById(selfID).select("grouplist");
    let grouplistId = [];
    for (let i = 0; i < grouplist.length; i++) {
      grouplistId.push(grouplist[i].group._id);
    }
    console.log(value);
    const reg = new RegExp(value, "i"); //不区分大小写
    let res = [];
    let ans = [];
    switch (type) {
      case "group":
        res = await Group.find({
          $or: [{uid: {$regex: reg}}, {nickname: {$regex: reg}}],
        });
        break;
      default:
        res = [];
    }
    for (let i = 0; i < res.length; i++) {
      let id = res[i]._id;
      if (grouplistId.indexOf(id) == -1) {
        ans.push(res[i]);
      } else {
        continue;
      }
    }
    ctx.body = {
      list: ans,
      code: 200,
      message: "查询成功",
    };
  }
  async sendRequestAddGroup() {
    const {ctx} = this;
    const User = ctx.model.User; //获取User模型
    const Group = ctx.model.Group; //获取User模型
    const {selfID, groupID, message} = ctx.request.body;
    const other = await User.findById(otherID);
    const group = await Group.findById(groupID);
    dp[selfID] = dp[selfID] || [];
    let state = User.updateMany(
      {
        grouplist: {$eleMatch: {$eq: groupID}},
        "grouplist.group._id": {$in: [1, 2]},
      },
      {$addToSet: {groups: {state: 0, message: message, group: groupID}}}
    );
    if (state.ok == 1) {
      if (dp[selfID].indexOf(groupID) !== -1) {
        ctx.body = {
          code: 200,
          message: "请勿重新发送请求哦",
        };
      }
      dp[selfID].push(groupID);
      ctx.body = {
        code: 200,
        message: "发送请求成功",
      };
    }
    // otherID ：群id
    //userID ：请求加群人的ID
    //我发送一个加 A 群请求，
    //将我的加 A 群的请求发送到每一个A 群的管理或者群主的groups里面
  }
}

module.exports = GroupController;
