import os
import json

def selectScene(scriptFolder=None, outputFolder=None):
    baseDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    defaultScriptFolder = os.path.join(baseDir, "Project_Dataset")
    finalScriptFolder = scriptFolder or defaultScriptFolder
    finalOutputFolder = outputFolder or os.path.join(baseDir, "scripts_json")

    os.makedirs(finalOutputFolder, exist_ok=True)

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

    summary = {}

    if not os.path.exists(finalScriptFolder):
        print(f"Error: Script folder does not exist: {finalScriptFolder}")
        return summary

    for filename in os.listdir(finalScriptFolder):
        if filename.endswith(".txt"):
            path = os.path.join(finalScriptFolder, filename)
            scenes = parseScript(path)
            jsonFilename = filename.rsplit(".txt", 1)[0] + ".json"
            outputPath = os.path.join(finalOutputFolder, jsonFilename)
            with open(outputPath, "w", encoding="utf-8") as outF:
                json.dump(scenes, outF, ensure_ascii=False, indent=2)
            summary[filename] = len(scenes)

    return summary


if __name__ == "__main__":
    results = selectScene()
    print("Scene summary per script:")
    for script, count in results.items():
        print(f"{script}: {count} scenes")