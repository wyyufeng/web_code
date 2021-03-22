function merge_sort(arr) {
  function merge(leftArr, rightArr) {
    let i = 0,
      j = 0;
    const result = [];
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        result.push(leftArr[i]);
        i++;
      } else {
        result.push(rightArr[j]);
        j++;
      }
    }
    if (i < leftArr.length) {
      result.push(...leftArr.splice(i));
    }
    if (j < rightArr.length) {
      result.push(...rightArr.splice(j));
    }
    return result;
  }
  function sort(arr) {
    if (arr.length < 2) return arr;
    const mid = Math.floor(arr.length / 2);
    return merge(sort(arr.slice(0, mid)), sort(arr.slice(mid)));
  }

  return sort(arr);
}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(merge_sort(arr));
