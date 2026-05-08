#!/usr/bin/env python3
import sys
import subprocess

def ensurePackage(package: str, importName: str | None = None) -> None:
    name = importName or package
    try:
        __import__(name)
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", package, "-q"],
            stdout=subprocess.DEVNULL,
        )

print("Checking dependencies...")
ensurePackage("transformers")
ensurePackage("torch")
ensurePackage("rich")
print("Dependencies confirmed.\n")

from transformers import pipeline
from rich.console import Console
from rich.table import Table
from rich.text import Text

MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"
BAR_WIDTH = 22

EMOTION_COLORS = {
    "anger": "bold red",
    "disgust": "bold green",
    "fear": "bold yellow",
    "joy": "bold bright_yellow",
    "neutral": "white",
    "sadness": "bold blue",
    "surprise": "bold magenta",
}

def createProgressBar(score: float, width: int = BAR_WIDTH) -> str:
    filledLength = round(score * width)
    return "█" * filledLength + "░" * (width - filledLength)

def generateSummaryText(sortedResults: list[tuple[str, float]]) -> str:
    topEmotion, topScore = sortedResults[0]
    if topScore >= 0.60:
        return f"This line carries strong [bold]{topEmotion}[/bold]."
    secondResult = sortedResults[1] if len(sortedResults) > 1 else None
    if secondResult and secondResult[1] >= 0.20:
        return (
            f"This line carries [bold]{topEmotion}[/bold] "
            f"with underlying [bold]{secondResult[0]}[/bold]."
        )
    return f"This line carries moderate [bold]{topEmotion}[/bold]."

def runAnalysis(text: str, classifier, console: Console) -> None:
    rawOutput = classifier(text, return_all_scores=True)
    scores: dict[str, float] = {r["label"].lower(): r["score"] for r in rawOutput[0]}

    sortedResults: list[tuple[str, float]] = sorted(
        scores.items(), key=lambda x: x[1], reverse=True
    )
    dominantEmotion = sortedResults[0][0]

    console.print(f"\n[bold]Input:[/bold] [italic dim]{text}[/italic dim]\n")
    console.print("[bold]Emotion Breakdown:[/bold]")

    table = Table(show_header=False, box=None, padding=(0, 1))
    table.add_column(width=10, justify="right")
    table.add_column(width=BAR_WIDTH + 2)
    table.add_column(width=7, justify="right")
    table.add_column()

    for emotion, score in sortedResults:
        color = EMOTION_COLORS.get(emotion, "white")
        barString = createProgressBar(score)
        percentageString = f"{score * 100:.1f}%"
        isDominant = (emotion == dominantEmotion)
        tag = Text("← dominant", style="bold green") if isDominant else Text("")

        emotionText = Text(emotion, style=color + (" bold" if isDominant else ""))
        barText = Text(barString, style=color if isDominant else "dim " + color)
        percentageText = Text(percentageString, style="bold" if isDominant else "dim")

        table.add_row(emotionText, barText, percentageText, tag)

    console.print(table)
    console.print(f"\n[bold]Summary:[/bold] {generateSummaryText(sortedResults)}\n")
    console.rule(style="dim")

def main() -> None:
    console = Console()
    console.print(f"Loading model: {MODEL_NAME}")
    classifier = pipeline("text-classification", model=MODEL_NAME, return_all_scores=True)
    console.print("Model ready.\n")

    if len(sys.argv) > 1:
        runAnalysis(" ".join(sys.argv[1:]), classifier, console)
        return

    console.print("Interactive mode - enter a line of text (or blank to quit):\n")
    while True:
        try:
            textInput = input("  Text > ").strip()
        except (KeyboardInterrupt, EOFError):
            break
        if not textInput:
            break
        runAnalysis(textInput, classifier, console)

    console.print("\nGoodbye!")

if __name__ == "__main__":
    main()
