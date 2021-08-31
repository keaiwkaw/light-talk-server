const jwt = require("jsonwebtoken");
module.exports = (options, app) => {
  return async (ctx, next) => {
    const User = ctx.model.User;
    const token = String(ctx.requset.headers.authorization || "")
      .split(" ")
      .pop();
    if (!token) {
      ctx.body = {
        message: "请先登录",
        code: -1,
      };
    }
    const {id} = jwt.verify(token, "kaw");
    if (!id) {
      ctx.body = {
        message: "用户不存在",
        code: -1,
      };
    }
    let user = await User.findById(id);
    if (!user) {
      ctx.body = {
        message: "请先登录",
        code: -1,
      };
    }
    next();
  };
};
