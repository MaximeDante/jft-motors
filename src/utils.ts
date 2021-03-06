type Callback = (...args: []) => void;
type Handler = (error: Error, cb?: Callback) => void;

export const Logger = <Value>(value: Value, warn?: boolean): Value => {
  if (value instanceof Error) {
    console.log("Error not Handled:", value);
  } else {
    warn ? console.warn("Handle:", value) : console.log(value);
  }
  return value;
};

export function onError(error: Error, handler: Handler): void | Error {
  if (typeof handler === "function") {
    handler(error);
  } else {
    throw error;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function tryCatch(handler: Handler | Callback | any) {
  return (
    _target: any,
    _key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const method = descriptor.value;
    descriptor.value = function(...args: []) {
      try {
        const result = method.apply(this, args);

        // Handle async errors
        if (result && result instanceof Promise) {
          return result.catch((error: Error) => {
            onError(error, handler);
          });
        }

        return result;
      } catch (error) {
        onError(error, handler);
      }
    };

    return descriptor;
  };
}

// form helper & partial functions
export const required = msg => v => !!v || msg;
export const requiredArray = msg => v =>
  (Array.isArray(v) && v.length > 1) || msg;
export const minLen = l => v => (v && v.length >= l) || `min. ${l} Characters`;
export const maxLen = l => v => (v && v.length <= l) || `max. ${l} Characters`;
export const nonZero = () => v => v > 0 || "can't be zero or less";
export const emailVal = () => v =>
  /.+@.+\..+/.test(v) || "E-mail must be valid";

export function range(start, end) {
  return start !== end ? [start, ...range(start + 1, end)] : [start];
}
export const phoneVal = () => v =>
  /^((?:\+27|27)|0)(\d{2})[- ]?(\d{3})[- ]?(\d{4})$/gm.test(v) ||
  "Please supply a valid South African Phone number";
