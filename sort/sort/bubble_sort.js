const swap = require('../swap');

/**
 * 冒泡排序
 * 原地排序 稳定排序
 * 平均事件复杂度 O(n^2)
 * 最好时间复杂度：当序列已经有序时 O(n)
 * 最坏时间复杂度: 当序列逆序 O(n^2)
 * 空间复杂度 O(1)
 */
function bubble_sort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let sorted = true;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        sorted = false;
        swap(arr, j, j + 1);
      }
    }
    if (sorted) {
      break;
    }
  }
  return arr;
}

const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(bubble_sort(arr));
