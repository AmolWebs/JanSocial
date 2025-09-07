import express, { json } from 'express';
import { connectDB } from './config/db.js';
import cors from 'cors'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 4000;
const app = express();

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

app.get('/', (req, res)=>{
    res.send('<h1>Hello Backend</h1>');
})

app.listen(PORT, () => {
    connectDB();
    console.log(`App is running on port ${PORT}`)
})

