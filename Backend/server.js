import express, { json } from 'express';
import { connectDB } from './config/db.js';
import cors from 'cors'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import path from "path";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(json());
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.get('/favicon.ico', (req, res) => res.status(204).end());

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Something went wrong' });
// });

app.get('/', (req, res)=>{
    res.send('<h1>Hello Backend</h1>');
})

connectDB();
// app.listen(PORT, () => {
//     console.log(`App is running on port ${PORT}`)
// })

export default app;
