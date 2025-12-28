/* eslint-disable @nx/enforce-module-boundaries */
import { errorMiddleware } from './../../../packages/error-handler/error-middleware';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 
      message: 'Auth Service API', 
      status: 'running',
      endpoints: {
        testUser: 'POST /api/test-user',
        getUsers: 'GET /api/users',
        getUserById: 'GET /api/users/:id'
      }
    });
});

app.use(errorMiddleware)

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
    console.log(`🚀 Auth Service is running on http://localhost:${port}`);
    console.log(`📊 Database: Connected to MongoDB`);
});

server.on('error', (err)=>{
    console.error(err);
});
