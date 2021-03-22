function quick_sort(arr) {
  function sort(arr, startIndex, endIndex) {
    if (startIndex >= endIndex) {
      return;
    }
    const pivotIndex = partition2(arr, startIndex, endIndex);
    sort(arr, startIndex, pivotIndex - 1);
    sort(arr, pivotIndex + 1, endIndex);
  }
  function partition(arr, startIndex, endIndex) {
    const pivot = arr[startIndex];
    let left = startIndex;
    let right = endIndex;

    while (left !== right) {
      while (left < right && arr[right] > pivot) {
        right--;
      }
      while (left < right && arr[left] <= pivot) {
        left++;
      }
      if (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
      }
    }
    arr[startIndex] = arr[left];
    arr[left] = pivot;
    return left;
  }
  function partition2(arr, startIndex, endIndex) {
    const pivot = arr[startIndex];
    let mark = startIndex;
    for (let i = startIndex + 1; i <= endIndex; i++) {
      if (arr[i] < pivot) {
        mark++;
        [arr[mark], arr[i]] = [arr[i], arr[mark]];
      }
    }
    arr[startIndex] = arr[mark];
    arr[mark] = pivot;
    return mark;
  }
  sort(arr, 0, arr.length - 1);
  return arr;
}

const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(quick_sort(arr));
