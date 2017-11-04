var ctrl: HTMLElement | null;

function byId(
    id: string): HTMLElement {
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

function htmlDiv(): HTMLDivElement {
  return document.createElement("div");
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
  input.setAttribute("onkeydown",
    "remarkKeydown(event, this, this.parentNode);");
  input.setAttribute("onkeyup",
    "keyup(event, this);");

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
    judgement_id: string,
    depth: number): TextContainer {
  let header = document.createElement("h" + depth);

  let span = appendElement(htmlSpan, header);
  span.innerText = repeatString("#", depth);

  let input = appendTextInput(header);
  input.setAttribute("onkeydown",
    "judgementKeydown(\"" + judgement_id + "\", event, this);");
  input.setAttribute("onkeyup", "keyup(event, this);");

  return new TextContainer(header, input);
}

function appendJudgement(
    container: Element,
    depth: number): void {
  let judgement = appendElement(htmlSection, container);
  judgement.id = Guid.next();

  let header = createJudgementHeader(judgement.id, depth);
  judgement.appendChild(header.element());

  appendRemark(appendRemarks(judgement));

  header.focus();
}

function lastChild(elem: Element): Element | null {
  if (elem.children.length == 0) {
    return null;
  } else {
    return elem.children[elem.children.length - 1];
  }
}

function findJudgements(elem: Element): HTMLDivElement | null {
  let candidate = lastChild(elem);
  if (candidate instanceof HTMLDivElement) {
    return candidate;
  } else {
    return null;
  }
}

function getJudgements(elem: Element) : HTMLDivElement {
  let judgements = findJudgements(elem);
  if (judgements === null) {
    judgements = appendJudgements(elem);
  }
  return judgements;
}

function appendJudgements(container: Element) : HTMLDivElement {
  return appendElement(htmlDiv, container);
}

function appendJudgementAfter(judgement: HTMLElement): void {
  let depth = parseInt(judgement.children[0].tagName.substring(1), 10);
  let container = judgement.parentNode! as HTMLElement;
  appendJudgement(container, depth);
}

function moveUp(
    elem: HTMLElement,
    focus: HTMLElement): void {
  let prev = elem.previousSibling;
  if (prev) {
    let container = elem.parentNode!;
    container.removeChild(elem);
    container.insertBefore(elem, prev);
    focus.focus();
  }
}

function moveDown(
    elem: HTMLElement,
    focus: HTMLElement): void {
  var next = elem.nextSibling;
  if (next) {
    let container = elem.parentNode!;
    container.removeChild(elem);
    let nextnext = next.nextSibling;
    if (nextnext) {
      container.insertBefore(elem, nextnext);
    } else {
      container.appendChild(elem);
    }
    focus.focus();
  }
}

function detach(elem: HTMLElement) {
  elem.parentNode!.removeChild(elem);
}

function tryRemoveRemark(
    remark: HTMLElement,
    input: HTMLInputElement): void {
  if (input.value.length > 0) {
    return;
  }

  var sibling = remark.previousSibling;
  if (sibling === null) {
    sibling = remark.nextSibling;
  }
  if (sibling === null) {
    return;
  }

  detach(remark);
  ((sibling as HTMLElement).children[1] as HTMLElement).focus();
}

function remarkKeydown(
    e: KeyboardEvent,
    input: HTMLInputElement,
    remark: HTMLLIElement): void {
  if (e.code === "Enter") {
    let container = remark.parentNode! as HTMLElement;
    appendRemark(container, remark);
  } else if (e.code === "Backspace") {
    tryRemoveRemark(remark, input);
  } else if (e.key === "Control") {
    ctrl = input;
  } else if (ctrl === input && e.key === "ArrowUp") {
    moveUp(remark, input);
  } else if (ctrl === input && e.key === "ArrowDown") {
    moveDown(remark, input);
  }
}

function judgementKeydown(
    judgement_id: string,
    e: KeyboardEvent,
    elem: HTMLElement): void {
  let judgement = byId(judgement_id);
  if (e.code === "Enter") {
    appendJudgementAfter(judgement);
  } else if (e.key === "Control") {
    ctrl = elem;
  } else if (ctrl === elem && e.key === "ArrowUp") {
    moveUp(judgement, elem);
  } else if (ctrl === elem && e.key === "ArrowDown") {
    moveDown(judgement, elem);
  }
  elem = elem;
}

function keyup(
    e: KeyboardEvent,
    elem: HTMLElement): void {
  if (ctrl === elem && e.key === "Control") {
    ctrl = null;
  }
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
