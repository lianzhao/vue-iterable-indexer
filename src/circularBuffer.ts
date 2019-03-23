import { IterableBase } from './iterable';

// https://en.wikipedia.org/wiki/Circular_buffer
export default class CircularBuffer<T> extends IterableBase<T> implements Iterable<T> {
  public get length() {
    return this.size;
  }
  private readonly capacity: number;
  private readonly items: T[];
  private size = 0;
  private start = 0;

  public constructor(capacity: number, initItems: Iterable<T> | null = null) {
    super();
    if (capacity < 0) {
      throw new Error('Invalid capacity');
    }
    this.capacity = capacity;
    if (!initItems) {
      this.items = [];
    } else if (Array.isArray(initItems)) {
      this.items = initItems.length > capacity ? initItems.slice(initItems.length - capacity) : [...initItems];
      this.size = this.items.length;
    } else {
      this.items = [];
      for (const item of initItems) {
        this.push(item);
      }
    }
    // define indexer
    const self = this;
    for (let i = 0; i < this.capacity; i++) {
      Object.defineProperty(this, i, {
        get() {
          return self.getEelementAt(i);
        },
        set(val: T) {
          self.setEelementAt(i, val);
        },
      });
    }
  }

  public clear() {
    this.start = 0;
    this.size = 0;
  }

  public getEelementAt(index: number) {
    if (this.size === 0) {
      throw new Error('Index out of range');
    }
    return this.items[this.getIndex(index)];
  }

  public push(item: T) {
    if (this.size === this.capacity) {
      this.shift();
    }
    const index = (this.start + this.size) % this.capacity;
    this.items[index] = item;
    return ++this.size;
  }

  public pop() {
    if (this.size === 0) {
      return;
    }
    return this.items[--this.size];
  }

  public setEelementAt(index: number, element: T) {
    if (this.size === 0) {
      throw new Error('Index out of range');
    }
    this.items[this.getIndex(index)] = element;
  }

  public shift() {
    if (this.size === 0) {
      return;
    }
    const index = this.start;
    this.size--;
    this.start++;
    if (this.start === this.capacity) {
      this.start = 0;
    }
    return this.items[index];
  }

  public unshift(item: T) {
    if (this.size === this.capacity) {
      this.pop();
    }
    --this.start;
    if (this.start < 0) {
      this.start = this.capacity - 1;
    }
    this.items[this.start] = item;
    return ++this.size;
  }

  public [Symbol.iterator](): Iterator<T> {
    const items = this.items;
    const c = this.capacity;
    const len = this.size;
    let i = this.start;
    let j = 0;
    return {
      next(): IteratorResult<T> {
        if (j >= len) {
          return {
            done: true,
          } as IteratorResult<T>;
        }
        const value = items[i];
        i++;
        j++;
        if (i === c) {
          i = 0;
        }
        return {
          value,
          done: false,
        };
      },
    };
  }

  public getIndex(index: number) {
    return (index + this.start) % this.capacity;
  }

  // override
  protected guessLength(): number {
    return this.size;
  }
}
