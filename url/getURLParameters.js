function getURLParameters(url) {
  const paramsString = url.split('?')[1];
  return paramsString === undefined
    ? {}
    : paramsString.split('&').reduce((a, b) => {
        a[b.slice(0, b.indexOf('='))] = b.slice(b.indexOf('=') + 1);
        return a;
      }, {});
}
