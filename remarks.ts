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
    container: Element): HTMLOListElement {
  return appendElement(htmlOList, container);
}

function appendMood(
    container: Element): void {
  let span = appendElement(htmlSpan, container);
  span.className = "mood";
  span.innerText = "*";
  span.setAttribute("onclick", "toggleMood(this);");
}

class TextField {
  constructor(
      public readonly input: HTMLInputElement) {
    // The signature does all the work.
  }

  focus(): void {
    this.input.focus();
  }

  isEmpty(): boolean {
    return this.input.value.length === 0;
  }
}

class Remark extends TextField {
  public readonly input: HTMLInputElement;

  constructor(
      public readonly element: HTMLLIElement) {
    super(element.children[1]! as HTMLInputElement);
  }

  tryRemove(e: KeyboardEvent): void {
    if (!this.isEmpty()) {
      return;
    }

    let sibling = this.element.previousSibling ||
      this.element.nextSibling;

    if (sibling === null) {
      return;
    }

    detach(this.element);
    e.preventDefault();
    new Remark(sibling as HTMLLIElement).focus();
  }

  indent(): void {
    let prev = this.element.previousSibling;
    if (prev) {
      let remarks = getRemarks(prev as HTMLElement);
      detach(this.element);
      remarks.appendChild(this.element);
      this.input.focus();
    }
  }

  unindent(): void {
    let elem = this.element;
    if (elem.parentNode &&
        elem.parentNode.parentNode &&
        elem.parentNode.parentNode.parentNode) {
      let grandParent = elem.parentNode!.parentNode!;
      let container = grandParent.parentNode! as HTMLElement;
      if (container instanceof HTMLOListElement) {
        let next = grandParent.nextSibling;
        detach2(elem);
        if (next) {
          container.insertBefore(elem, next);
        } else {
          container.appendChild(elem);
        }
        this.input.focus();
      }
    }
  }
}

class Judgement extends TextField {
  public readonly input: HTMLInputElement;
  public readonly remarks: HTMLOListElement;

  constructor(
      public readonly element: HTMLElement) {
    super((element.children[0]! as HTMLElement).
      children[1]! as HTMLInputElement);
    this.remarks = element.children[1]! as HTMLOListElement;
  }

  isEmpty(): boolean {
    return super.isEmpty() &&
      this.remarks.children.length === 1 &&
        new Remark(this.remarks.children[0] as HTMLLIElement).isEmpty();
  }

  tryRemove(e: KeyboardEvent): void {
    if (!this.isEmpty()) {
      return;
    }

    let sibling = this.element.previousSibling ||
      this.element.nextSibling;

    if (sibling === null) {
      return;
    }

    detach(this.element);
    e.preventDefault();
    new Judgement(sibling as HTMLElement).focus();
  }
}

function appendRemark(
    container: Element,
    prev?: Element): Remark {
  let element = insertElementAfter(htmlLI, container, prev);

  appendMood(element);

  let input = appendTextInput(element);
  input.setAttribute("onkeydown",
    "remarkKeydown(event, this, this.parentNode);");
  input.setAttribute("onkeyup",
    "keyup(event, this);");

  input.focus();
  return new Remark(element);
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
    depth: number,
    input?: HTMLInputElement): TextContainer {
  let header = document.createElement("h" + depth);

  let span = appendElement(htmlSpan, header);
  span.innerText = repeatString("#", depth);

  if (input) {
    header.appendChild(input);
  } else {
    input = appendTextInput(header);
    input.setAttribute("onkeydown",
      "judgementKeydown(event, this, this.parentNode.parentNode);");
    input.setAttribute("onkeyup", "keyup(event, this);");
  }

  return new TextContainer(header, input);
}

function appendJudgement(
    container: Element,
    depth: number): void {
  let judgement = appendElement(htmlSection, container);

  let header = createJudgementHeader(depth);
  judgement.appendChild(header.element());

  appendRemark(appendRemarks(judgement));

  header.focus();
}

function lastChild(
    elem: Element): Element | null {
  if (elem.children.length === 0) {
    return null;
  } else {
    return elem.children[elem.children.length - 1];
  }
}

function findJudgements(
    elem: Element): HTMLDivElement | null {
  let candidate = lastChild(elem);
  if (candidate instanceof HTMLDivElement) {
    return candidate;
  } else {
    return null;
  }
}

function getJudgements(
    elem: Element) : HTMLDivElement {
  let judgements = findJudgements(elem);
  if (judgements === null) {
    judgements = appendJudgements(elem);
  }
  return judgements;
}

function appendJudgements(
    container: Element) : HTMLDivElement {
  return appendElement(htmlDiv, container);
}

function appendJudgementAfter(
    judgement: HTMLElement): void {
  let depth = parseInt(judgement.children[0].tagName.substring(1), 10);
  let container = judgement.parentNode! as HTMLElement;
  appendJudgement(container, depth);
}

function findRemarks(
    elem: Element): HTMLOListElement | null {
  let candidate = lastChild(elem);
  if (candidate instanceof HTMLOListElement) {
    return candidate;
  } else {
    return null;
  }
}

function getRemarks(
    elem: Element) : HTMLOListElement {
  let remarks = findRemarks(elem);
  if (remarks === null) {
    remarks = appendRemarks(elem);
  }
  return remarks;
}

function getJudgementDepth(
    judgement: HTMLElement): number {
  return parseInt(judgement.children[0].tagName.substring(1), 10);
}

function indentJudgementAux(
    judgement: HTMLElement,
    input: HTMLInputElement): void {
  if (judgement.previousSibling === null) {
    return;
  }

  let sibling = judgement.previousSibling as HTMLElement;

  if (sibling.tagName !== "SECTION") {
    return;
  }

  let judgements = getJudgements(sibling);
  detach(judgement);
  judgements.appendChild(judgement);

  let depth = getJudgementDepth(judgement);
  if (depth === 3) {
    return;
  }

  let header = createJudgementHeader(depth + 1, input);
  judgement.removeChild(judgement.children[0]);
  judgement.insertBefore(header.element(), judgement.children[0]);
}

function indentJudgement(
    judgement: HTMLElement,
    input: HTMLInputElement): void {
  indentJudgementAux(judgement, input);
  input.focus();
}

function unindentJudgementAux(
    judgement: HTMLElement,
    input: HTMLInputElement): void {
  let depth = getJudgementDepth(judgement);
  if (depth === 1) {
    return;
  }

  let container = judgement.parentNode!;
  let parentJudgement = container.parentNode!;
  let grandParent = parentJudgement.parentNode!;
  let nextSibling = parentJudgement.nextSibling;

  detach2(judgement);
  if (nextSibling) {
    grandParent.insertBefore(judgement, nextSibling);
  } else {
    grandParent.appendChild(judgement);
  }

  let header = createJudgementHeader(depth - 1, input);
  judgement.removeChild(judgement.children[0]);
  judgement.insertBefore(header.element(), judgement.children[0]);
}

function unindentJudgement(
    judgement: HTMLElement,
    input: HTMLInputElement): void {
  unindentJudgementAux(judgement, input);
  input.focus();
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

function detach(elem: HTMLElement): void {
  elem.parentNode!.removeChild(elem);
}

function detach2(elem: HTMLElement): void {
  let container = elem.parentNode!;
  detach(elem);
  if ((container as HTMLElement).children.length === 0) {
    detach(container as HTMLElement);
  }
}

function remarkKeydown(
    e: KeyboardEvent,
    input: HTMLInputElement,
    remark: HTMLLIElement): void {
  if (e.code === "Enter") {
    let container = remark.parentNode! as HTMLElement;
    appendRemark(container, remark);
  } else if (e.code === "Backspace") {
    new Remark(remark).tryRemove(e);
  } else if (e.key === "Control") {
    ctrl = input;
  } else if (ctrl === input && e.code === "Space") {
    toggleMood(input.previousSibling! as HTMLElement);
  } else if (ctrl === input && e.key === "ArrowRight") {
    new Remark(remark).indent();
  } else if (ctrl === input && e.key === "ArrowLeft") {
    new Remark(remark).unindent();
  } else if (ctrl === input && e.key === "ArrowUp") {
    moveUp(remark, input);
  } else if (ctrl === input && e.key === "ArrowDown") {
    moveDown(remark, input);
  }
}

function judgementKeydown(
    e: KeyboardEvent,
    input: HTMLInputElement,
    judgement: HTMLLIElement): void {
  if (e.code === "Enter") {
    appendJudgementAfter(judgement);
  } else if (e.code === "Backspace") {
    new Judgement(judgement).tryRemove(e);
  } else if (e.key === "Control") {
    ctrl = input;
  } else if (ctrl === input && e.key === "ArrowRight") {
    indentJudgement(judgement, input);
  } else if (ctrl === input && e.key === "ArrowLeft") {
    unindentJudgement(judgement, input);
  } else if (ctrl === input && e.key === "ArrowUp") {
    moveUp(judgement, input);
  } else if (ctrl === input && e.key === "ArrowDown") {
    moveDown(judgement, input);
  }
}

function keyup(
    e: KeyboardEvent,
    elem: HTMLElement): void {
  if (ctrl === elem && e.key === "Control") {
    ctrl = null;
  }
}

function basename(): string {
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
