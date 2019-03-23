export abstract class IterableBase<T> implements Iterable<T> {
  public abstract [Symbol.iterator](): Iterator<T>;

  public find(callback: (element: T, index: number, iterable: Iterable<T>) => boolean) {
    return this._find(callback)[0];
  }

  public findIndex(callback: (element: T, index: number, iterable: Iterable<T>) => boolean) {
    return this._find(callback)[1];
  }

  public getEelementAt(index: number) {
    // todo if typeof List<T> ?
    return this.find((_, i) => i === index);
  }

  public indexOf(element: T) {
    return this.findIndex(ele => ele === element);
  }

  public forEach(callback: (element: T, index: number, iterable: Iterable<T>) => void) {
    this._find((element, i, iterable) => {
      callback(element, i, iterable);
      return false;
    });
  }

  public toArray() {
    const len = this.guessLength();
    const arr = new Array<T>(len);
    this.forEach((ele, i) => (arr[i] = ele));
    return arr;
  }

  protected guessLength(): number {
    const that = this as any;
    if (typeof that.length === 'number') {
      return that.length;
    }
    if (typeof that.size === 'number') {
      return that.size;
    }
    throw new Error('Can not guess length');
  }

  private _find(callback: (element: T, index: number, iterable: Iterable<T>) => boolean): [T | undefined, number] {
    let i = 0;
    for (const element of this) {
      if (callback(element, i, this)) {
        return [element, i];
      }
      i++;
    }
    return [undefined, -1];
  }
}

export interface List<T> extends Iterable<T> {
  length: number;
  [key: number]: T;
}
