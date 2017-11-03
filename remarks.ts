function byId(id: string): Element {
  return document.getElementById(id)!;
}

function toggleMoodText(current_mood: string): string {
  var next_mood = "*";
  switch (current_mood) {
  case "*":
    next_mood = "+";
    break;
  case "+":
    next_mood = "-";
    break;
  case "-":
    next_mood = "?";
    break;
  default:
    next_mood = "*";
    break;
  }
  return next_mood;
}

function toggleMood(elem: HTMLElement): void {
  elem.innerText = toggleMoodText(elem.innerText);
}

function appendJudgement(container: Element, depth: number): void {
  return;
}

function main(): void {
  var judgements = byId("judgements");
  if (judgements.children.length === 0) {
    appendJudgement(judgements, 1);
  }
}
