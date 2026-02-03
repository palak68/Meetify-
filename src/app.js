import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();
const server = createServer(app);
const io = new Server(server) ;
app.set('port', process.env.PORT || 8000);


app.get("/home",(req,res)=>{
  res.send("Hello from Meetify Backend");
});
const startServer = async () => {
    const coonectionDb = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://siyamukeshsharma_db_user:RKvYCXo3U40OwAY3@cluster0.nd8ruwo.mongodb.net/");
server.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
}
startServer();

































