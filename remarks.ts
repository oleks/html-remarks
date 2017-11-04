function byId(id: string): Element {
  return document.getElementById(id)!;
}

function toggleMoodText(current_mood: string): string {
  var next_mood: string;
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
  (elem.nextSibling! as HTMLElement).focus();
}

class Guid {
  static offset: number = 0;
  static next(): string {
    let retval = "id" + this.offset;
    this.offset = this.offset + 1;
    return retval;
  }
}

function setValue(input: HTMLInputElement): void {
  input.setAttribute("value", input.value);
}

function appendTextInput(container: Element): HTMLInputElement {
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("onchange", "setValue(this);");

  container.appendChild(input);

  return input;
}

function appendElement(tagName: string, container: Element): Element {
  var element = document.createElement(tagName);
  container.appendChild(element);
  return element;
}

function insertElementAfter(
    tagName: string, container: Element, prev?: Element): Element {
  let element = document.createElement(tagName);
  if (prev && prev.nextSibling) {
    container.insertBefore(element, prev.nextSibling);
  } else {
    container.appendChild(element);
  }
  return element;
}

function appendRemarks(container: Element): Element {
  return appendElement("ol", container);
}

function appendMood(container: Element): void {
  let span = appendElement("span", container) as HTMLSpanElement;
  span.className = "mood";
  span.innerText = "*";
  span.setAttribute("onclick", "toggleMood(this);");
}

function appendRemark(container: Element, prev?: Element) {
  let remark = insertElementAfter("li", container, prev);
  remark.id = Guid.next();

  appendMood(remark);
  let input = appendTextInput(remark);

  input.focus();
}

function repeatString(text: string, times: number): string {
  return Array(times + 1).join(text);
}

class TextContainer {
  private container: Element;
  private text: HTMLInputElement;
  constructor(container: Element, text: HTMLInputElement) {
    this.container = container;
    this.text = text;
  }
  element(): Element {
    return this.container;
  }
  focus(): void {
    this.text.focus();
  }
}

function createJudgementHeader(section_id: string, depth: number):
    TextContainer {
  var header = document.createElement("h" + depth);

  var span = document.createElement("span");
  span.innerText = repeatString("#", depth);
  header.appendChild(span);

  var input = appendTextInput(header);

  return new TextContainer(header, input);
}

function appendJudgement(container: Element, depth: number): void {
  var section = document.createElement("section");
  section.id = Guid.next();

  var header = createJudgementHeader(section.id, depth);
  section.appendChild(header.element());

  appendRemark(appendRemarks(section));

  container.appendChild(section);
  header.focus();
}

function basename() {
  var parts = document.location.href.split("?")[0].split("/");
  var last = parts[parts.length - 1];
  return last.split(".html")[0];
}

function main(): void {
  document.title = basename();

  var judgements = byId("judgements");
  if (judgements.children.length === 0) {
    appendJudgement(judgements, 1);
  }
}

main();
