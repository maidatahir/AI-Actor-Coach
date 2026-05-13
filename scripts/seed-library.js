/**
 * One-time seed script — run with: npm run seed
 * Reads all .txt files from the dataset folder, parses them,
 * and upserts them into the LibraryScript collection on MongoDB Atlas.
 */

const fs       = require('fs')
const path     = require('path')
const mongoose = require('mongoose')

// ── Load .env.local without dotenv ────────────────────────────────────────────
const envFile = path.join(__dirname, '..', '.env.local')
const env = {}
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const k = line.slice(0, eq).trim()
      const v = line.slice(eq + 1).trim().replace(/^["'](.*)["']$/, '$1')
      env[k] = v
    }
  })
}

const MONGODB_URI = env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local')
  process.exit(1)
}

// ── Dataset location ──────────────────────────────────────────────────────────
const DATASET_FOLDER = path.join(
  __dirname, '..', 'Scene Selection', 'Scene Selection', 'Project_Dataset'
)

// ── Genre map for known titles ─────────────────────────────────────────────
const GENRE_MAP = {
  '3 Godfathers':                     'Western',
  'Avatar':                           'Sci-Fi',
  'Batman Begins':                    'Action',
  'Moonlight':                        'Drama',
  'Moonrise Kingdom':                 'Drama',
  'Moonstruck':                       'Romance',
  'Motherless Brooklyn':              'Mystery',
  'Moulin Rouge':                     'Romance',
  'Mr Blandings Builds His Dream House': 'Comedy',
  'Mr Brooks':                        'Thriller',
  'Mr Destiny':                       'Comedy',
  'Never Let Me Go':                  'Drama',
  'Never Look Away':                  'Drama',
  'New Jack City':                    'Crime',
  'New York Minute':                  'Comedy',
  'Newton':                           'Drama',
  'Next Friday':                      'Comedy',
  'Team America World Police':        'Comedy',
  'Tender Mercies':                   'Drama',
  'Tenet':                            'Sci-Fi',
  'Terminator 2 Judgment Day':        'Action',
  'Terminator 3 Rise of the Machines': 'Action',
  'Terminator Salvation':             'Action',
  'Titanic':                          'Drama',
  'Wives and Lovers':                 'Romance',
  'Woman in Gold':                    'Drama',
  'Wonder Boys':                      'Drama',
  'Wonder Woman':                     'Action',
  'Wonderstruck':                     'Drama',
  'Wrongfully Accused':               'Comedy',
}

function getDifficulty(sceneCount) {
  if (sceneCount < 20) return 'Beginner'
  if (sceneCount < 60) return 'Intermediate'
  return 'Advanced'
}

// ── Parse a single .txt script file into scenes ───────────────────────────────
function parseTxtFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n')
  const scenes = []
  let current = null
  let counter = 0

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line.toLowerCase().startsWith('scene_heading:')) {
      if (current) scenes.push(current)
      counter++
      current = {
        sceneNumber:  counter,
        sceneHeading: line.slice('scene_heading:'.length).trim(),
        elements:     [],
      }
      continue
    }

    if (!current) {
      counter++
      current = { sceneNumber: counter, sceneHeading: 'Default Scene', elements: [] }
    }

    if (line.toLowerCase().startsWith('speaker_heading:')) {
      current.elements.push({ type: 'speaker', content: line.slice('speaker_heading:'.length).trim() })
    } else if (line.toLowerCase().startsWith('dialog:')) {
      current.elements.push({ type: 'dialog', content: line.slice('dialog:'.length).trim() })
    } else if (line.toLowerCase().startsWith('text:')) {
      current.elements.push({ type: 'text', content: line.slice('text:'.length).trim() })
    } else {
      current.elements.push({ type: 'text', content: line })
    }
  }

  if (current) scenes.push(current)
  return scenes
}

// ── Inline Mongoose schema (avoids TypeScript compilation) ────────────────────
const SceneElementSchema = new mongoose.Schema(
  { type: String, content: String },
  { _id: false }
)
const SceneSchema = new mongoose.Schema(
  { sceneNumber: Number, sceneHeading: String, elements: [SceneElementSchema] },
  { _id: false }
)
const LibraryScriptSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, unique: true },
    genre:       { type: String, default: 'Film' },
    difficulty:  { type: String, default: 'Intermediate' },
    totalScenes: { type: Number, default: 0 },
    scenes:      [SceneSchema],
    sourceFile:  String,
  },
  { timestamps: true }
)
const LibraryScript =
  mongoose.models.LibraryScript ||
  mongoose.model('LibraryScript', LibraryScriptSchema)

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB Atlas\n')

  if (!fs.existsSync(DATASET_FOLDER)) {
    console.error('Dataset folder not found:', DATASET_FOLDER)
    process.exit(1)
  }

  const files = fs.readdirSync(DATASET_FOLDER).filter(f => f.endsWith('.txt'))
  console.log(`Found ${files.length} script files in dataset\n`)

  let inserted = 0
  let skipped  = 0

  for (const filename of files) {
    // "Batman Begins_0372784_anno.txt" → "Batman Begins"
    const title = filename.replace(/_\d+_anno\.txt$/, '').replace(/_/g, ' ')
    const genre = GENRE_MAP[title] || 'Film'

    const exists = await LibraryScript.exists({ title })
    if (exists) {
      console.log(`  SKIP   ${title}`)
      skipped++
      continue
    }

    const scenes = parseTxtFile(path.join(DATASET_FOLDER, filename))
    const difficulty = getDifficulty(scenes.length)

    await LibraryScript.create({
      title,
      genre,
      difficulty,
      totalScenes: scenes.length,
      scenes,
      sourceFile: filename,
    })
    console.log(`  INSERT ${title}  (${scenes.length} scenes · ${genre} · ${difficulty})`)
    inserted++
  }

  console.log(`\nDone. Inserted: ${inserted}  Skipped (already exist): ${skipped}`)
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
