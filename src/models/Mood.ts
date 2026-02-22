import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMood extends Document {
  user: 'Sude' | 'Ertan';
  emoji: string;
  label: string;
  expiresAt: Date;
}

const MoodSchema: Schema = new Schema({
  user: { type: String, required: true, enum: ['Sude', 'Ertan'], unique: true },
  emoji: { type: String, required: true },
  label: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const Mood: Model<IMood> = mongoose.models.Mood || mongoose.model<IMood>('Mood', MoodSchema);

export default Mood;
