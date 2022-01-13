import { useState, useCallback } from "react";

export function useDebounce(): Function {
  const [state, setState] = useState<any>();
  const debounce = useCallback(
    (value: Function, delay?: number) => {
      clearTimeout(state);
      const timeout = setTimeout(() => {
        value();
      }, delay || 300);
      setState(timeout);
    },
    [state]
  );
  return debounce;
}
