from transformers import pipeline

emotionClassifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)

def safeTruncate(text, maxChars=300):
    return text[:maxChars]

def mapEmotions(rawScores):

    mapped = {
        "anger": 0.0,
        "sadness": 0.0,
        "joy": 0.0,
        "fear": 0.0,
        "neutral": 0.0
    }

    for item in rawScores:
        label = item["label"].lower()
        score = item["score"]

        if label in ["anger", "disgust"]:
            mapped["anger"] += score
        elif label == "fear":
            mapped["fear"] += score
        elif label == "sadness":
            mapped["sadness"] += score
        elif label == "joy":
            mapped["joy"] += score
        elif label in ["neutral", "surprise"]:
            mapped["neutral"] += score

    return mapped

def applySegmentWeight(emotions, segmentType):

    weight = 1.0 if segmentType == "dialogue" else 0.7

    return {
        k: round(v * weight, 4)
        for k, v in emotions.items()
    }

def analyzeEmotionsBatch(segments, batchSize=8):

    results = []

    for i in range(0, len(segments), batchSize):

        batch = segments[i:i + batchSize]

        texts = [safeTruncate(seg["text"]) for seg in batch]

        try:
            rawOutputs = emotionClassifier(
                texts,
                truncation=True,
                top_k=None
            )

            for seg, rawScores in zip(batch, rawOutputs):

                mapped = mapEmotions(rawScores)

                weighted = applySegmentWeight(
                    mapped,
                    seg["type"]
                )

                results.append({
                    "text": seg["text"],
                    "type": seg["type"],
                    "emotions": weighted
                })

        except Exception as e:
            print(f"Error during batch processing: {e}")

    return results