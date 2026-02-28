import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformanceSession extends Document {
  studentId: mongoose.Types.ObjectId;
  sceneId: mongoose.Types.ObjectId;
  videoPath?: string;
  audioPath?: string;
  status: string;
  duration: number;
}

const PerformanceSessionSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    sceneId: { type: Schema.Types.ObjectId, ref: 'Scene', required: true },
    videoPath: { type: String },
    audioPath: { type: String },
    status: { type: String, required: true, default: 'pending' },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PerformanceSession || mongoose.model<IPerformanceSession>('PerformanceSession', PerformanceSessionSchema);
