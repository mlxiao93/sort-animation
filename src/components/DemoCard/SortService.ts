export enum SortType {
  selectionSort = 'selectionSort',    // 选择排序
  insertionSort = 'insertionSort',     // 插入排序
  bubbleSort = 'bubbleSort',           // 冒泡排序
  quickSort = 'quickSort',             // 快速排序
  heapSort = 'heapSort',              // 堆排序
}

export interface SortStep {
  arr: number[];
  active?: number[];
  swap?: number[];
  swapStart?: boolean;
  swapEnd?: boolean;
}

export default class SortService {

  private steps: SortStep[] = [];

  private greaterThan(arr: number[], i: number, j: number): boolean {
    this.steps.push({
      arr: [...arr],
      active: [i, j]
    });
    this.steps.push({
      arr: [...arr],
    });
    return arr[i] > arr[j];
  }

  private notGreateThan(arr: number[], i: number, j: number): boolean {
    this.steps.push({
      arr: [...arr],
      active: [i, j]
    });
    this.steps.push({
      arr: [...arr],
    });
    return arr[i] <= arr[j];
  }

  private notLessThan(arr: number[], i: number, j: number): boolean {
    this.steps.push({
      arr: [...arr],
      active: [i, j]
    });
    this.steps.push({
      arr: [...arr],
    });
    return arr[i] >= arr[j];
  }

  private swap(arr: number[], i: number, j: number): void {
    this.steps.push({
      arr: [...arr],
      swap: [i, j],
      swapStart: true
    });
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    this.steps.push({
      arr: [...arr],
      swap: [j, i],
      swapEnd: true
    });
    this.steps.push({
      arr: [...arr],
    });
  }

  private selectedSort: any;

  private selectionSort(arr: number[]): void {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let min = i;
      for (let j = i + 1; j < len; j++) {
        if (this.greaterThan(arr, min, j)) min = j;
      }
      if (min !== i) this.swap(arr, i, min)
    }
  }

  private insertionSort(arr: number[]): void {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
      for (let j = 0; j < i; j++) {
        if (this.greaterThan(arr, j, i)) {
          this.swap(arr, j, i);
        }
      }
    }
  }

  private bubbleSort (arr: number[]): void {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (this.greaterThan(arr, j,j + 1)) this.swap(arr, j, j + 1);
      }
    }
  }

  private quickSort(arr: number[], low: number = 0, high: number = arr.length - 1) {
    if (low >= high) return;
    let mid = low;

    let left = low + 1, right = high, newMid;
    while (true) {
      while (this.notGreateThan(arr, left, mid)) {
        if (left === right) {
          if (left === high) newMid = high;    // 所有元素都比第一个元素大
          break;
        }
        left++;
      }
      while (this.notLessThan(arr, right, mid)) {
        if (right === left) break;
        right--;
      }
      if (left < right) {
        this.swap(arr, left, right)
      } else {
        break;
      }
    }

    if (newMid === undefined) newMid = left - 1;

    mid !== newMid && this.swap(arr, newMid, mid);
    mid = newMid;

    this.quickSort(arr, low, mid - 1);
    this.quickSort(arr, mid + 1, high);
  }

  private heapSort(arr: number[]) {
    const that = this;
    function maxHeap(arr: number[], top = 0, last = arr.length - 1) {
      if  (top >= last) return;
      let l = 2 * top + 1, r = 2 * top + 2;
      maxHeap(arr, l, last);
      maxHeap(arr, r, last);
      let max = top;
      if (l <= last && that.greaterThan(arr, l, max)) max = l;
      if (r <= last && that.greaterThan(arr, r, max)) max = r;
      max !== top && that.swap(arr, max, top)
    }
    for (let last = arr.length - 1; last >= 0; last--) {
      maxHeap(arr, 0, last);
      that.swap(arr, 0, last);
    }
  }

  constructor(sortType: SortType) {
    this.selectedSort = this[sortType];
  }

  sort(arr: number[]): SortStep[] {
    this.steps = [];
    const originArr = [...arr];
    this.selectedSort(arr);
    this.steps = this.steps.filter((step: SortStep) => step.swap || step.active);
    this.steps.unshift({arr: originArr});
    this.steps.push({arr});
    return this.steps;
  }
}