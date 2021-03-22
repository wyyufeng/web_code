const MaxHeap = require('../data_structures/max_heap');
function heap_sort(arr = []) {
  const result = [];
  let temp = arr;
  for (let i = arr.length; i > 0; i--) {
    const maxHeap = new MaxHeap(temp.slice(0));
    maxHeap.buildMaxHeap();
    [maxHeap.data[0], maxHeap.data[maxHeap.data.length - 1]] = [
      maxHeap.data[maxHeap.data.length - 1],
      maxHeap.data[0],
    ];
    result.push(maxHeap.data.pop());
    temp = maxHeap.data;
  }
  return result;
}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(heap_sort(arr));
