import { errorMiddleware } from './../../../packages/error-handler/error-middleware';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use(errorMiddleware)

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
});

server.on('error', (err)=>{
    console.error(err);
});
