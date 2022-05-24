const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
  }
});
const users= {};
io.on('connection', socket=>{
    socket.on('new-user-joined', (name)=>{
       console.log("New User", name)
       users[socket.id]= name;
       console.log(socket.id) 
       socket.broadcast.emit('user-joined', name);
    
    })
    socket.on('send-msg', (message, room)=>{
      if(room===""){
        socket.broadcast.emit('recieve',{message:message, name:users[socket.id]});
      } else{
        socket.to(room).emit('recieve',{message:message, name:users[socket.id]});
      }
    })
    socket.on('room-joined', (room,callBack)=>{
      socket.join(room)
      callBack(` ${room} Joined`)
    })
    socket.on('disconnect', message=>{
      socket.broadcast.emit('user-disconnected', users[socket.id]);
      delete users[socket.id];
  })
});

