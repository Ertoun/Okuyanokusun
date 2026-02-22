import dotenv from 'dotenv';
dotenv.config();

console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');

import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dbConnect from './src/lib/db';
import Post from './src/models/Post';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: any, file: any) => {
    let resourceType: 'image' | 'video' | 'raw' = 'image';
    if (file.mimetype.startsWith('video')) resourceType = 'video';
    else if (file.mimetype.startsWith('audio')) resourceType = 'video'; // Cloudinary uses 'video' for audio too
    return {
      folder: 'okuyan-okusun',
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mp3', 'wav', 'ogg', 'm4a'],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const url = (req.file as any).path; // Cloudinary secure URL
  const mimeType: string = req.file.mimetype;
  let type: 'image' | 'video' | 'audio' = 'image';
  if (mimeType.startsWith('video')) type = 'video';
  else if (mimeType.startsWith('audio')) type = 'audio';
  res.json({ success: true, url, type });
});

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

app.post('/api/posts/:id/responses', async (req, res) => {
  await dbConnect();
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    post.responses.push(req.body);
    await post.save();
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/posts/:postId/responses/:responseId', async (req, res) => {
  await dbConnect();
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    const response = (post.responses as any).id(req.params.responseId);
    if (!response) return res.status(404).json({ success: false, error: 'Response not found' });
    
    response.content = req.body.content;
    if (req.body.musicUrl !== undefined) response.musicUrl = req.body.musicUrl;
    
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.delete('/api/posts/:postId/responses/:responseId', async (req, res) => {
  await dbConnect();
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    (post.responses as any).pull({ _id: req.params.responseId });
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/posts/:id/reactions', async (req, res) => {
  await dbConnect();
  try {
    const { type } = req.body; // heart, sad, happy
    const update = { $inc: { [`reactions.${type}`]: 1 } };
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    
    if (!updatedPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  await dbConnect();
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  await dbConnect();
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

// Serve static files from the build directory
app.use(express.static('dist'));

// Handle React routing, return all requests to React app
app.get('*any', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
