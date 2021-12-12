export class FixedCapQueue<Element> {
  private queue: Element[];

  private head = 0;

  private tail = 0;

  constructor(private readonly cap: number) {
    this.queue = new Array<Element>(cap + 1);
  }

  size(): number {
    if (this.head < this.tail) {
      return this.tail - this.head;
    }
    return this.tail + (this.cap - this.head);
  }

  empty(): boolean {
    return this.head === this.tail;
  }

  full(): boolean {
    return this.size() === this.cap;
  }

  front(): Element {
    return this.queue[this.head];
  }

  end(): Element {
    return this.queue[this.tail === 0 ? this.cap - 1 : this.tail - 1];
  }

  pushBack(e: Element) {
    this.queue[this.tail] = e;
    this.tail = this.tail === this.cap - 1 ? 0 : this.tail + 1;
  }

  popFront(): Element {
    const e = this.queue[this.head];
    this.head = this.head === this.cap - 1 ? 0 : this.head + 1;
    return e;
  }
}
