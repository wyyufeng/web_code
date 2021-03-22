function debounce(fn, delay, immediate) {
  let timer = null;
  return function () {
    const ctx = this;
    const args = arguments;
    if (immediate && timer === null) {
      fn.apply(ctx, args);
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (!immediate) fn.apply(ctx, args);
      timer = null;
    }, delay);
  };
}
