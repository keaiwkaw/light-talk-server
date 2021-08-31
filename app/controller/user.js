"use strict";

const Controller = require("egg").Controller;
const jwt = require("jsonwebtoken");
let uid = 1;
const avatar = "https://cn.bing.com/images/search?view=detailV2&ccid=8kCMMxfj&id=2A712390011B9D6815082A1E1562E2FCCAD2DD75&thid=OIP.8kCMMxfjbOPyLSP7lSVqXgAAAA&mediaurl=https%3a%2f%2fimg2.woyaogexing.com%2f2019%2f03%2f18%2f1d04efe8028049dd81e2d066175203cb!400x400.jpeg&exph=400&expw=400&q=%e5%8a%a8%e6%bc%ab%e5%a4%b4%e5%83%8f&simid=608019476346187414&FORM=IRPRST&ck=E4E70D258E68FF3308C87BC703479944&selectedIndex=3&qpvt=%e5%8a%a8%e6%bc%ab%e5%a4%b4%e5%83%8f,https://tse2-mm.cn.bing.net/th/id/OIP-C.mNt0-i4Di8e83xZt6q4IXAAAAA?w=206&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse4-mm.cn.bing.net/th/id/OIP-C.MkaKMMwZLJEf3teZ4QlsTQAAAA?w=207&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse2-mm.cn.bing.net/th/id/OIP-C.o4eYb7LAgDygdbjaoxsCngAAAA?w=206&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse2-mm.cn.bing.net/th/id/OIP-C.dQHbmmGH1XLYoPwJ6vMR-QAAAA?w=206&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse4-mm.cn.bing.net/th/id/OIP-C.HGSGaR374u82nuoNNM7lYQAAAA?w=207&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse4-mm.cn.bing.net/th/id/OIP-C.zZ7cpHymWOwo0ITMUbwvrAAAAA?w=206&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7,https://tse2-mm.cn.bing.net/th/id/OIP-C.gHtfadw_cO4GvgqjpjryngAAAA?w=206&h=206&c=7&r=0&o=5&dpr=1.25&pid=1.7".split(
  ","
);
const nickname = "ミ灬空白傷↘,失魂人* Pugss,头脑社会金钱拿人er,委屈求全像条狗i,坟 场 蹦 迪c,哇咔咔。,想哭、却找不到理由,掩盖曾经的伤痛°,他是我不能拥抱的太阳i,我的光芒亮瞎你的狗眼i".split(
  ","
);
class UserController extends Controller {
  async login() {
    const {ctx} = this;
    const User = ctx.model.User; //获取User模型
    let {email, password} = ctx.request.body;
    let user = await User.findOne({email}).select("+password"); //从数据库尝试拿user
    //user不存在-注册用户
    if (!user) {
      let avatarIdx = Math.floor(Math.random() * avatar.length);
      let nicknameIdx = Math.floor(Math.random() * nickname.length);

      user = await User.create({
        email,
        password,
        nickname: nickname[nicknameIdx],
        uid: uid++,
        avatar: avatar[avatarIdx],
      });
    } else {
      // user存在 将数据库中的密码和传入的密码对比
      const isValid = require("bcrypt").compareSync(password, user.password);
      if (!isValid) {
        ctx.body = {
          message: "密码错误",
          code: -1,
        };
        return;
      }
    }
    const token = jwt.sign({id: user._id}, "kaw");
    ctx.body = {
      message: "登录成功",
      code: 200,
      uid: user.uid,
      token,
      id: user._id,
      user,
    };
  }
}

module.exports = UserController;
