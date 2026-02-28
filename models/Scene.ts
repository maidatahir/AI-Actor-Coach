import mongoose, { Schema, Document } from 'mongoose';

export interface IScene extends Document {
  scriptId: mongoose.Types.ObjectId;
  sceneNumber: number;
}

const SceneSchema: Schema = new Schema(
  {
    scriptId: { type: Schema.Types.ObjectId, ref: 'Script', required: true },
    sceneNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Scene || mongoose.model<IScene>('Scene', SceneSchema);
