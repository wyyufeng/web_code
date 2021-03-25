/**
 * 快速排序
 * 不稳定排序 原地排序
 * 平均时间复杂度 O(nLogn) 最坏O(n^2) 空间复杂度 O(logn)
 */
function quick_sort(arr, startIndex, endIndex) {
  if (startIndex >= endIndex) return;
  const pivotIndex = partition(arr, startIndex, endIndex);
  // console.log(pivotIndex);
  quick_sort(arr, startIndex, pivotIndex - 1);
  quick_sort(arr, pivotIndex + 1, endIndex);

  function partition(arr, startIndex, endIndex) {
    const pivot = arr[startIndex];
    let left = startIndex;
    let right = endIndex;

    while (left < right) {
      while (left < right && arr[right] >= pivot) {
        right--;
      }
      if (left < right) {
        arr[left] = arr[right];
        left++;
      }

      while (left < right && arr[left] <= pivot) {
        left++;
      }
      if (left < right) {
        arr[right] = arr[left];
        right--;
      }
    }
    arr[left] = pivot;
    return left;
  }
  return arr;
}
const arr = [13, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(quick_sort(arr, 0, arr.length - 1));
