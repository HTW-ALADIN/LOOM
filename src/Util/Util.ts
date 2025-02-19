// see typescript issue https://github.com/microsoft/TypeScript/issues/23724
export type KeyTypes<T> = {
  [K in keyof T]-?: K extends string
    ? string
    : K extends number
      ? number
      : K extends symbol
        ? symbol
        : never;
}[keyof T];
export type KeyOfType<T, KeyType extends string | number | symbol = KeyTypes<T>> = Extract<
  keyof T,
  KeyType
>;

export type TypeOfLastTupleElement<T extends any[]> = T extends [...any[], infer R] ? R : never;

export type ValueOf<T> = T[keyof T];

// https://stackoverflow.com/a/75088992/14804461
export type StringLiteralList<T, K extends keyof T> = T[keyof Pick<T, K>];
