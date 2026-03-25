import re
import spacy
from emotion_analyzer import analyzeEmotionsBatch

nlp = spacy.load("en_core_web_sm")

def splitIntoScenes(text):
    pattern = re.compile(
        r"^(INT\.|EXT\.|INT/EXT\.|EXT/INT\.).*$",
        re.MULTILINE
    )
    matches = list(pattern.finditer(text))
    scenes = []

    for i, match in enumerate(matches):
        start = match.start()
        end = (
            matches[i + 1].start()
            if i + 1 < len(matches)
            else len(text)
        )
        sceneTitle = match.group().strip()
        content = text[start:end].replace(sceneTitle, "", 1).strip()
        scenes.append({
            "sceneTitle": sceneTitle,
            "content": content
        })

    return scenes

def advancedParse(sceneText):
    lines = sceneText.split("\n")
    parsed = []
    currentSpeaker = None
    buffer = []

    def flushDialogue():
        nonlocal buffer, currentSpeaker
        if buffer and currentSpeaker:
            parsed.append({
                "type": "dialogue",
                "speaker": currentSpeaker,
                "text": " ".join(buffer).strip()
            })
        buffer = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if re.match(r"^\(.*\)$|^\[.*\]$", line):
            flushDialogue()
            parsed.append({
                "type": "stageDirection",
                "text": line
            })
            currentSpeaker = None
            continue

        if re.match(r"^[A-Z][A-Z\s]+$", line):
            flushDialogue()
            currentSpeaker = line.strip()
            continue

        match = re.match(
            r"^([A-Z][A-Z\s]+):\s*(.*)",
            line
        )

        if match:
            flushDialogue()
            currentSpeaker = match.group(1).strip()
            text = match.group(2).strip()
            if text:
                parsed.append({
                    "type": "dialogue",
                    "speaker": currentSpeaker,
                    "text": text
                })
            continue

        if currentSpeaker:
            buffer.append(line)
        else:
            parsed.append({
                "type": "stageDirection",
                "text": line
            })

    flushDialogue()
    return parsed

def parseScriptText(rawText):
    scenes = splitIntoScenes(rawText)
    print("Starting script analysis...")
    output = []

    for i, scene in enumerate(scenes, start=1):
        print(f"Analyzing Scene {i}: {scene['sceneTitle']}")
        parsed = advancedParse(scene["content"])
        emotions = analyzeEmotionsBatch(parsed)

        for j in range(len(parsed)):
            parsed[j]["emotions"] = emotions[j]["emotions"]
            if parsed[j]["type"] == "dialogue":
                print(f"{parsed[j]['speaker']}: {parsed[j]['text']}")
            else:
                print(f"[Stage]: {parsed[j]['text']}")
            print("Emotions detected:", parsed[j]["emotions"])
            print()

        output.append({
            "sceneId": i,
            "sceneTitle": scene["sceneTitle"],
            "content": parsed
        })

    print("Script analysis complete.")
    return output