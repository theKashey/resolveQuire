const withAllStubsUsed = (stubs) => {
  const used = {};
  const proxy = new Proxy(stubs, {
    get(target, name) {
      used[name] = (used[name] || 0 ) + 1;
      return target[name];
    }
  });

  const findUnused = () => {
    for (const i in stubs) {
      // magic of shit. One access in .load, next - usage
      if (used[i] < 2) {
        return i;
      }
    }
  };

  return {
    proxy,
    findUnused
  }
};

export default withAllStubsUsed;