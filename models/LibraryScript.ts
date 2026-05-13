import mongoose, { Schema, Document } from 'mongoose'

interface ISceneElement {
  type: 'speaker' | 'dialog' | 'text'
  content: string
}

interface IScene {
  sceneNumber: number
  sceneHeading: string
  elements: ISceneElement[]
}

export interface ILibraryScript extends Document {
  title: string
  genre: string
  difficulty: string
  totalScenes: number
  scenes: IScene[]
  sourceFile: string
}

const SceneElementSchema = new Schema(
  { type: { type: String, required: true }, content: { type: String, required: true } },
  { _id: false }
)

const SceneSchema = new Schema(
  {
    sceneNumber: { type: Number, required: true },
    sceneHeading: { type: String, default: 'Scene' },
    elements: [SceneElementSchema],
  },
  { _id: false }
)

const LibraryScriptSchema = new Schema(
  {
    title:       { type: String, required: true, unique: true },
    genre:       { type: String, default: 'Film' },
    difficulty:  { type: String, default: 'Intermediate' },
    totalScenes: { type: Number, default: 0 },
    scenes:      [SceneSchema],
    sourceFile:  { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.LibraryScript ||
  mongoose.model<ILibraryScript>('LibraryScript', LibraryScriptSchema)
