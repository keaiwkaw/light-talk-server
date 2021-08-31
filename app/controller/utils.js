"use strict";
const fs = require("mz/fs");
let OSS = require("ali-oss");
let info = {
  region: "oss-cn-beijing",
  accessKeyId: "LTAI5tQB9NCFBRpzuGkawA9w",
  accessKeySecret: "zAFwrpTDltvmImDdiZ80hvxoatD1C3",
  bucket: "light-talk",
};
let client = new OSS(info);
const Controller = require("egg").Controller;

class UtilsController extends Controller {
  async upload() {
    const {ctx} = this;
    const file = ctx.request.files[0];
    let result;
    try {
      // https://help.aliyun.com/document_detail/111265.html
      // 处理文件，比如上传到云端
      result = await client.put(file.filename, file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }
    ctx.body = {
      url: result.url,
      // 获取所有的字段值
      requestBody: result,
    };
  }
}

module.exports = UtilsController;
