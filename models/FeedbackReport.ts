import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackReport extends Document {
  sessionId: mongoose.Types.ObjectId;
  facialScore: number;
  voiceScore: number;
  bodyScore: number;
  suggestions?: string;
}

const FeedbackReportSchema: Schema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'PerformanceSession', required: true },
    facialScore: { type: Number, default: 0 },
    voiceScore: { type: Number, default: 0 },
    bodyScore: { type: Number, default: 0 },
    suggestions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.FeedbackReport || mongoose.model<IFeedbackReport>('FeedbackReport', FeedbackReportSchema);
