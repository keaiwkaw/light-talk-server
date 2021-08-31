module.exports = (app) => {
  const online = new Map();
  return async (ctx, next) => {
    const {socket} = ctx;
    let query = socket.handshake.query;
    const {selfID} = query;
    console.log("server-connection");
    online.set(socket.id, selfID);
    console.log(selfID);
    ctx.socket.emit("SOCKET_online", online);
    await next();
    online.delete(socket.id);
    ctx.socket.emit("SOCKET_online", online);
    console.log("server-disconnection");
  };
};
