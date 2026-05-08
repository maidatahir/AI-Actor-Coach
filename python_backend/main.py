from fastapi import FastAPI, HTTPException
import os
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Actor Script API")

baseDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scriptFolder = os.path.join(baseDir, "Project_Dataset")
outputFolder = os.path.join(baseDir, "scripts_json")

os.makedirs(outputFolder, exist_ok=True)

def parseScript(filePath):
    with open(filePath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    scenes = []
    currentScene = None
    sceneCounter = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.lower().startswith("scene_heading:"):
            if currentScene:
                scenes.append(currentScene)
            sceneCounter += 1
            currentScene = {
                "sceneNumber": sceneCounter,
                "sceneHeading": line[len("scene_heading:"):].strip(),
                "elements": []
            }
            continue

        if currentScene is None:
            sceneCounter += 1
            currentScene = {
                "sceneNumber": sceneCounter,
                "sceneHeading": "Default Scene",
                "elements": []
            }

        if line.lower().startswith("speaker_heading:"):
            currentScene["elements"].append({
                "type": "speaker",
                "content": line[len("speaker_heading:"):].strip()
            })
            continue

        if line.lower().startswith("dialog:"):
            currentScene["elements"].append({
                "type": "dialog",
                "content": line[len("dialog:"):].strip()
            })
            continue

        if line.lower().startswith("text:"):
            currentScene["elements"].append({
                "type": "text",
                "content": line[len("text:"):].strip()
            })
            continue

        currentScene["elements"].append({
            "type": "text",
            "content": line
        })

    if currentScene:
        scenes.append(currentScene)

    return scenes

sceneData = {}

if not os.path.exists(scriptFolder):
    print(f"Error: Script folder does not exist: {scriptFolder}")
else:
    for filename in os.listdir(scriptFolder):
        if filename.endswith(".txt"):
            path = os.path.join(scriptFolder, filename)
            scenes = parseScript(path)
            sceneData[filename] = scenes

            jsonFilename = filename.rsplit(".txt", 1)[0] + ".json"
            outputPath = os.path.join(outputFolder, jsonFilename)
            with open(outputPath, "w", encoding="utf-8") as outF:
                json.dump(scenes, outF, ensure_ascii=False, indent=2)

print(f"Loaded {len(sceneData)} scripts into memory.")

@app.get("/")
def home():
    return {"message": "AI Actor API is running"}

@app.get("/sceneSummary")
def sceneSummary():
    return {script: len(scenes) for script, scenes in sceneData.items()}

@app.get("/scene/{scriptName}")
def getScenes(scriptName: str):
    if scriptName not in sceneData:
        raise HTTPException(status_code=404, detail="Script not found")
    return sceneData[scriptName]

@app.get("/scene/{scriptName}/{sceneNumber}")
def getScene(scriptName: str, sceneNumber: int):
    if scriptName not in sceneData:
        raise HTTPException(status_code=404, detail="Script not found")
    scenes = sceneData[scriptName]
    if sceneNumber < 1 or sceneNumber > len(scenes):
        raise HTTPException(status_code=404, detail="Scene number out of range")
    return scenes[sceneNumber - 1]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

