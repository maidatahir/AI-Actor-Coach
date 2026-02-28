import mongoose, { Schema, Document } from 'mongoose';

export interface IScript extends Document {
  title: string;
  author?: string;
  source?: string;
}

const ScriptSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    source: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Script || mongoose.model<IScript>('Script', ScriptSchema);
