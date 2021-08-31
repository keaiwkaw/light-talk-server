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
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        require: true,
      },
    ],
  });
  return mongoose.model("Group", GroupSchema, "group");
};
