import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import dbConnect from './src/lib/db';
import Post from './src/models/Post';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/posts', async (_req, res) => {
  await dbConnect();
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/posts', async (req, res) => {
  await dbConnect();
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
