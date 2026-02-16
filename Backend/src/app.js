
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

import { connectTosocket } from './controllers/socketmanager.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const server = createServer(app);
const io = connectTosocket(server);

/* ✅ Move these ABOVE routes */
app.use(cors());
app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ extended: true, limit: '40kb' }));

/* ✅ Then routes */
app.use("/api/v1/users", userRoutes);

app.set('port', process.env.PORT || 8000);

app.get("/home", (req, res) => {
  res.send("Hello from Meetify Backend");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(" MongoDB Connected Successfully");

    server.listen(app.get('port'), () => {
      console.log(`Server running on port ${app.get('port')}`);
    });

  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
