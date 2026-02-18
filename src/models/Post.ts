import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  author: 'UserA' | 'UserB';
  content: string;
  media: { type: 'image' | 'video' | 'audio'; url: string }[];
  style: {
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  author: { type: String, required: true, enum: ['UserA', 'UserB'] },
  content: { type: String, required: true },
  media: [
    {
      type: { type: String, enum: ['image', 'video', 'audio'] },
      url: { type: String },
    },
  ],
  style: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    fontFamily: { type: String, default: 'Inter' },
  },
  createdAt: { type: Date, default: Date.now },
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
