class BinaryHeap {
  constructor(data = []) {
    this.container = data;
  }
  left(i) {
    return 2 * i + 1;
  }
  right(i) {
    return 2 * i + 2;
  }
  parent(i) {
    return Math.ceil((i - 2) / 2);
  }
  swap(i, j) {
    [this.container[i], this.container[j]] = [
      this.container[j],
      this.container[i],
    ];
  }
  heapifyUp(i) {
    let current = i;
    if (this.parent(current)) {
      while (this.container[current] > this.container[this.parent(current)]) {
        this.swap(current, this.parent(current));
        current = this.parent(current);
      }
    }
  }
  heapilyDown(i) {
    let current = i;
    let nextIndex;

    while (this.left(current) < this.container.length) {
      if (
        this.right(current) < this.container.length &&
        this.container[this.right(current)] > this.container[this.left(current)]
      ) {
        nextIndex = this.right(current);
      } else {
        nextIndex = this.left(current);
      }
      if (this.container[current] < this.container[nextIndex]) {
        this.swap(current, nextIndex);
        current = nextIndex;
      } else {
        break;
      }
    }
  }
  insert(v) {
    this.container.push(v);
    this.heapifyUp(this.container.length - 1);
    return this;
  }
  remove(index) {
    this.container[index] = this.container[this.container.length - 1];
    this.container.length = this.container.length - 1;
    this.heapilyDown(index);
    return this;
  }
  build() {
    for (let i = Math.floor(this.container.length / 2); i > 0; i--) {
      this.heapilyDown(i);
    }
  }
}

const heap = new BinaryHeap([
  3,
  44,
  38,
  5,
  47,
  15,
  36,
  26,
  27,
  2,
  46,
  4,
  19,
  50,
  48,
]);

console.log(heap.container);
