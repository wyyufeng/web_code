const swap = require('../swap');

/**
 * 选择排序（选择最小的）
 * 原地排序  不稳定排序
 * 最坏时间复杂度 O(n^2)
 * 最好事件复杂度 O(n^2)
 * 平均事件复杂度 O(n^2)
 * 空间复杂度 O(1)
 */
function selection_sort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    if (min !== i) swap(arr, i, min);
  }
  return arr;
}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(selection_sort(arr));
