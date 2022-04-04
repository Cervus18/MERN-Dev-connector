console.log('socket running!')

const io = require("socket.io")(7000,{
    cors:{
        origin:"http://localhost:3000"
    }
})

let users = []
const addUser = (userId, socketId) => {
    !users.some(user=>user._id === userId) && users.push({userId,socketId})
}

const removeUser=(socketId)=>{
    users = users.filter(user=> user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };


io.on("connection", (socket) => {

    // when connect
    console.log("a user connected.")

    //take user id and socket id from users

    socket.on("addUser", (userId)=>{
        addUser(userId, socket.id)
        io.emit("getUsers",users)
        
        

    })
    
    // Send and get message
    socket.on("sendMessage",({senderId, receiverId,text})=>{
        const user = getUser(receiverId)
        

        user && io.to(user.socketId).emit("getMessage",{
            senderId, 
            text
        })
    })

    // when disconnect
    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)

    })
})