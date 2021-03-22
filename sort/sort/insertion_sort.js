function insertion_sort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    const current = arr[i];

    let j = i - 1;

    for (; j >= 0 && arr[j] > current; j--) {
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = current;
  }
  return arr;
}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

function insertion_sort2(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    const current = arr[i];
    let left = 0;
    let right = i - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] > current) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    let j = i - 1;
    for (; j >= left; j--) {
      arr[j + 1] = arr[j];
    }
    arr[left] = current;
  }
  return arr;
}

console.log(insertion_sort2(arr));
