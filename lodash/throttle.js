function throttle(fn, delay, immediate) {
  let timer = null;
  let initialCall = true;
  return function () {
    const ctx = this;
    const args = arguments;
    if (immediate && initialCall) {
      fn.apply(ctx, args);
      initialCall = false;
    }
    if (timer === null) {
      timer = setTimeout(() => {
        fn.apply(ctx, args);
        timer = null;
      }, delay);
    }
  };
}
