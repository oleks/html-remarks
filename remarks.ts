function byId(
    id: string): Element {
  return document.getElementById(id)!;
}

function toggleMoodText(
    current_mood: string): string {
  var retval: string;
  switch (current_mood) {
  case "*":
    retval = "+";
    break;
  case "+":
    retval = "-";
    break;
  case "-":
    retval = "?";
    break;
  default:
    retval = "*";
    break;
  }
  return retval;
}

function toggleMood(
    elem: HTMLElement): void {
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

function htmlSection(): HTMLElement {
  return document.createElement("section");
}

function htmlSpan(): HTMLSpanElement {
  return document.createElement("span");
}

function htmlInput(): HTMLInputElement {
  return document.createElement("input");
}

function htmlOList(): HTMLOListElement {
  return document.createElement("ol");
}

function htmlLI(): HTMLLIElement {
  return document.createElement("li");
}

function appendElement<T extends HTMLElement>(
    c: () => T,
    container: Element): T {
  let element = c();
  container.appendChild(element);
  return element;
}

function insertElementAfter<T extends HTMLElement>(
    c: () => T,
    container: Element,
    prev?: Element): T {
  let element = c();
  if (prev && prev.nextSibling) {
    container.insertBefore(element, prev.nextSibling);
  } else {
    container.appendChild(element);
  }
  return element;
}

function setValue(
    input: HTMLInputElement): void {
  input.setAttribute("value", input.value);
}

function appendTextInput(
    container: Element): HTMLInputElement {
  let input = appendElement(htmlInput, container);
  input.setAttribute("type", "text");
  input.setAttribute("onchange", "setValue(this);");

  return input;
}

function appendRemarks(
    container: Element): Element {
  return appendElement(htmlOList, container);
}

function appendMood(
    container: Element): void {
  let span = appendElement(htmlSpan, container);
  span.className = "mood";
  span.innerText = "*";
  span.setAttribute("onclick", "toggleMood(this);");
}

function appendRemark(
    container: Element,
    prev?: Element) {
  let remark = insertElementAfter(htmlLI, container, prev);
  remark.id = Guid.next();

  appendMood(remark);
  let input = appendTextInput(remark);

  input.focus();
}

function repeatString(
    text: string,
    times: number): string {
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

function createJudgementHeader(
    depth: number): TextContainer {
  let header = document.createElement("h" + depth);

  let span = appendElement(htmlSpan, header);
  span.innerText = repeatString("#", depth);

  let input = appendTextInput(header);

  return new TextContainer(header, input);
}

function appendJudgement(
    container: Element,
    depth: number): void {
  let section = appendElement(htmlSection, container);
  section.id = Guid.next();

  let header = createJudgementHeader(depth);
  section.appendChild(header.element());

  appendRemark(appendRemarks(section));

  container.appendChild(section);
  header.focus();
}

function basename() {
  let parts = document.location.href.split("?")[0].split("/");
  let last = parts[parts.length - 1];
  return last.split(".html")[0];
}

function main(): void {
  document.title = basename();

  let judgements = byId("judgements");
  if (judgements.children.length === 0) {
    appendJudgement(judgements, 1);
  }
}

main();
