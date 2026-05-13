import mongoose, { Schema, Document } from 'mongoose'

const ElementSchema = new Schema(
  { type: { type: String }, content: { type: String } },
  { _id: false }
)

const SceneSchema = new Schema(
  {
    sceneNumber:  { type: Number },
    sceneHeading: { type: String },
    elements:     [ElementSchema],
  },
  { _id: false }
)

export interface IScript extends Document {
  title:       string
  author?:     string
  genre?:      string
  difficulty?: string
  totalScenes?: number
  scenes?:     any[]
  userId?:     string
}

const ScriptSchema: Schema = new Schema(
  {
    title:       { type: String, required: true },
    author:      { type: String, default: 'Unknown' },
    genre:       { type: String, default: 'Custom' },
    difficulty:  { type: String, default: 'Custom' },
    totalScenes: { type: Number, default: 0 },
    scenes:      [SceneSchema],
    userId:      { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Script || mongoose.model<IScript>('Script', ScriptSchema)
