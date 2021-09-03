"use strict";
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const GroupSchema = new Schema({
    uid: {
      type: String,
      require: true,
    },
    nickname: {
      type: String,
    },
    avatar: {
      type: String,
    },
    groupOfPublic: {
      type: String,
      default: "禁黄赌毒，文明发言",
    },
    groupMembers: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          require: true,
        },
        type: {
          type: Number,
          default: 0,
        },
      },
    ],
    requestList: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          require: true,
        },
        state: {
          type: Number,
          default: 0,
        },
        messsage: {
          type: String,
        },
      },
    ],
  });
  return mongoose.model("Group", GroupSchema, "group");
};
