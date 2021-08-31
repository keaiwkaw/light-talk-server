"use strict";

const Controller = require("egg").Controller;
class FriendController extends Controller {
  //发送添加好友请求 参数：selfID otherID
  async sendRequestAdd() {
    const {ctx} = this;
    const User = ctx.model.User; //获取User模型
    const {selfID, otherID, message} = ctx.request.body;
    const other = await User.findById(otherID);
    if (
      !other.friends ||
      (other.friends &&
        !other.friends.some((friend) => friend.people == selfID))
    ) {
      let state = await User.updateOne(
        {_id: otherID},
        {$addToSet: {friends: {state: 0, message: message, people: selfID}}}
      );
      if (state.ok == 1) {
        ctx.body = {
          code: 200,
          message: "发送请求成功",
        };
      } else {
        ctx.body = {
          code: -1,
          message: "发送请求失败",
        };
      }
    } else {
      ctx.body = {
        message: "请求已存在，请等候对方处理",
        code: 200,
      };
    }
  }
  //处理请求  公共参数 selfID otherID 通过:code 1 拒绝:code 2
  async dealRequestAdd() {
    //self 代表 B
    const {ctx} = this;
    const User = ctx.model.User;
    const {selfID, otherID, code} = ctx.request.body;
    let state;
    // 同意
    if (code == 1) {
      state = await User.updateOne(
        {_id: selfID, "friends.people": otherID},
        {$set: {"friends.$.state": 1}}
      );
      await User.updateOne({_id: otherID}, {$addToSet: {friendlist: selfID}});
      await User.updateOne({_id: selfID}, {$addToSet: {friendlist: otherID}});
    } else if (code == 2) {
      //拒绝
      state = await User.updateOne(
        {_id: selfID, "friends.people": otherID},
        {$set: {"friends.$.state": 2}}
      );
    }

    if (state.ok == 1) {
      ctx.body = {
        message: "处理成功",
        code: 200,
      };
    } else {
      ctx.body = {
        message: "处理失败",
        code: 200,
      };
    }
  }
  //删除好友 传入的参数 seflID otherID
  async deleteFriends() {
    const {ctx} = this;
    const User = ctx.model.User;
    const {selfID, otherID} = ctx.request.body;
    let state;
    state = await User.updateOne({_id: selfID}, {$pull: {friendlist: otherID}});
    if (state.ok == 1) {
      ctx.body = {
        code: 200,
        message: "删除好友成功",
      };
    } else {
      ctx.body = {
        code: 200,
        message: "删除好友失败",
      };
    }
  }
  //获取好友 传入的参数 selfID
  async getFriends() {
    const {ctx} = this;
    const User = ctx.model.User;
    const {selfID} = ctx.request.body;
    const self = await User.findById(selfID).populate("friendlist");
    let friends = [];

    ctx.body = {
      friends: self.friendlist.length ? self.friendlist : friends,
      code: 200,
      message: "获取好友列表成功",
    };
  }
  //获取处理请求列表 传入：selfID state:passing,pass,unpass  type: friends groups
  async getRequestList() {
    const {ctx} = this;
    const User = ctx.model.User;
    const {type, state, selfID} = ctx.request.body;
    let res = [];
    const self = await User.findOne({_id: selfID}, type).populate(
      "friends.people"
    );

    switch (state) {
      case "passing":
        res = self["friends"].filter((i) => i.state == 0);
        break;
      case "pass":
        res = self["friends"].filter((i) => i.state == 1);
        break;
      case "unpass":
        res = self["friends"].filter((i) => i.state == 2);
        break;
      default:
        res = [];
    }
    ctx.body = {
      message: "获取请求信息成功",
      list: res,
      code: 200,
    };
  }
  async searchPeopleToType() {
    const {ctx} = this;
    const User = ctx.model.User;
    const Group = ctx.model.Group;
    const {type, value, selfID} = ctx.request.body;
    const self = await User.findOne({_id: selfID}, "friendlist");
    let friendlist = self.friendlist;
    const reg = new RegExp(value, "i"); //不区分大小写
    let res = [];
    let ans = [];
    switch (type) {
      case "user":
        res = await User.find(
          {
            $or: [{uid: {$regex: reg}}, {nickname: {$regex: reg}}],
          },
          {
            password: 0, // 返回结果不包含密码字段
          }
        );
        break;
      default:
        res = [];
    }
    for (let i = 0; i < res.length; i++) {
      let id = res[i]._id;
      if (friendlist.indexOf(id) == -1) {
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
}

module.exports = FriendController;
