import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  author: 'Sude' | 'Ertan';
  content: string;
  tags?: string[];
  media: { type: 'image' | 'video' | 'audio'; url: string }[];
  style: {
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    backgroundImage?: string;
  };
  responses: {
    author: 'Sude' | 'Ertan';
    content: string;
    musicUrl?: string;
    createdAt: Date;
  }[];
  reactions: {
    heart: number;
    sad: number;
    happy: number;
  };
  createdAt: Date;
}

const ResponseSchema = new Schema({
  author: { type: String, required: true, enum: ['Sude', 'Ertan'] },
  content: { type: String, required: true },
  musicUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema({
  author: { type: String, required: true, enum: ['Sude', 'Ertan'] },
  content: { type: String, required: true },
  tags: [{ type: String }],
  media: [{
    type: { type: String, enum: ['image', 'video', 'audio'] },
    url: String,
  }],
  style: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    fontFamily: { type: String, default: 'Inter' },
    backgroundImage: { type: String },
  },
  responses: [ResponseSchema],
  reactions: {
    heart: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    happy: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
