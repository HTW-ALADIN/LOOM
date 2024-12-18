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
