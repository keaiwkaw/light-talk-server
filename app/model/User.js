"use strict";
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    uid: {
      type: String,
      require: true,
    },
    nickname: {
      type: String,
      default: "轻聊牛逼",
      require: true,
    },
    notename: {
      type: String,
    },
    avatar: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      select: false,
      set(val) {
        return require("bcrypt").hashSync(val, 11);
      },
    },
    signature: {
      type: String,
      default: "这个人很懒，什么也没说",
    },
    friends: [
      {
        state: {type: Number, require: true},
        message: {type: String},
        people: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          require: true,
        },
      },
    ],
    friendlist: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        require: true,
      },
    ],

    //存群的请求
  });
  return mongoose.model("User", UserSchema, "user");
};
