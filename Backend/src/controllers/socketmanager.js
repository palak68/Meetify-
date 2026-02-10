import { Server } from "socket.io";

let connections = {}
let messages = {}
let timeOnline = {}
 export const connectTosocket = (server)=>{
    const io = new Server(server,{
   cors:{
    origin: "*",
    methods: ["GET","POST"],
    allowedHeaders: ["*"],//never done in productions
    credentials: true
   }
});

    io.on("connection",(socket)=>{
        socket.on("join-call",(path)=>{

            if(connection[path]===undefined){
                connections[path] = []
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();
            for(let a =0; a< connections[path].length; a++){
                io.to(connections[path][a]).emit("chat-message ", message[path][a] ['data'],
                     message[path][a]['sender'], message[path][a]['socket-id-sender']);
           
            }

        })

        socket.on("signal", (toId,message)=>{
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message",(data,sender)=>{
         const[matchingRoom,Found] = Object.entries(connections)
         .reduce(([room,isFound],[roomKey, roomValue])=>{
         if(!isFound && roomValue.includes(socket.id)){
             return [roomKey,true];
         }
           return [room,isFound];}, [null,false]);

           if(found===true){
            if(messages[matchingRoom]===undefined){
                messages[matchingRoom] = []
            }
            messages[matchingRoom].push({'sender':sender,'data':data,'socket-id-sender':socket.id });
          connections[matchingRoom].forEach(elem=>{
                io.to(elem).emit("chat-message ", data, sender, socket.id);
          })
        
        
           }
        })
        socket.on ("disconnect",()=>{
var diffTime = Math.abs(timeOnline[socket.id] - new Date());
var key
for(const[k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
    for(let a = 0; a<v.length; ++a){
    if(v[a]===socket.id){
        key = k;
        for(let a =0; a<connections[key].length; a++){
            io.to(connections[key][a]).emit("user-disconnected",socket.id, diffTime);

        }
        var index = connections[key].indexOf(socket.id);
        connections[key].splice(index,1);
        if(connections[key].length===0){
            delete connections[key];
            delete messages[key];
        }
    }}}})
    return io
} )}