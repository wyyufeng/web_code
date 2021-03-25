/**
 * 插入排序(打牌)
 * 原地排序 稳定排序
 * 最坏时间复杂度 O(n^2)
 * 最好事件复杂度 O(n)
 * 平均时间复杂度 O(n^2)
 *  空间复杂度 O(1)
 */
function insertion_sort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let prevIndex = i - 1;
    while (prevIndex >= 0 && current < arr[prevIndex]) {
      arr[prevIndex + 1] = arr[prevIndex];
      prevIndex--;
    }
    arr[prevIndex + 1] = current;
  }
  return arr;
}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(insertion_sort(arr));
