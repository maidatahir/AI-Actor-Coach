import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressTracker extends Document {
  studentId: mongoose.Types.ObjectId;
  totalSessions: number;
  averageScore: number;
}

const ProgressTrackerSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    totalSessions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ProgressTracker || mongoose.model<IProgressTracker>('ProgressTracker', ProgressTrackerSchema);
