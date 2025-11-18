// 快速点击下一页的时候，会导致页码和实际内容不同步，这时候需要利用节流来限制短时间内频繁操作的行为
export const useThrottle = (fn: Function, delay: number = 500) => {
  let last = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      return fn(...args);
    }
  };
};
