import { JSONPath } from "jsonpath-plus";
import type { StateTree } from "pinia";

// TODO: see capabilities of Typescripts Template Literal Types (regarding recursivity) or when and if RegEx-Types are available
/**
 * The JSONPathSubExpression type is used to define JSONPath sub-expression, according to the working standard (https://www.ietf.org/archive/id/draft-goessner-dispatch-jsonpath-00.html).
 */
export type JSONPathSubExpression<T extends string = string> =
  | T // Atomic case
  | `${T}.${T}` // Child operator
  | `${T}..${T}` // Recursive descent
  | `${T}[${T}]` // Array subscript by index
  | `${T}[*]` // Wildcard for array elements
  | `${T}[${T | "*" | ""}]` // Array subscript (index, wildcard, or empty)
  | `${T}[${T}:${T}:${T}]` // Array slice
  | `${T}[?(${T})]` // Filter expression
  | `${T}(${T})` // Script expression
  | `${T}(@${T})` // Script expression on current element
  | `${T}[${T},${T}]`; // Union operator

/**
 * The JSONPathExpression type is used to define a JSONPath expression.
 */
export type JSONPathExpression =
  | `$` // Root element
  | `$.${JSONPathSubExpression}`; // Child operator

/**
 * The StoreGetter function is used to get a value from the store.
 */
export interface StoreGetter {
  (path: JSONPathExpression): any;
}

/**
 * The StoreSetterMetaData interface is used to pass additional information to the StoreSetter function.
 */
export interface StoreSetterMetaData {
  [key: string]: any;
}

/**
 * The StoreSetterPayload interface is used to pass the necessary information to the StoreSetter function.
 */
export interface StoreSetterPayload {
  path: JSONPathExpression;
  value: any;
  metadata?: StoreSetterMetaData;
}

/**
 * The StoreSetter function is used to set a value in the store.
 */
export interface StoreSetter {
  (payload: StoreSetterPayload): void;
}

/**
 * The StoreAPI interface provides the set of methods, with which the components can interact with the store.
 */
export interface StoreAPI<State extends StateTree = StateTree> {
  store?: State;
  getProperty: StoreGetter;
  setProperty: StoreSetter;
}

/**
 * Helper function, to determine if a path exists in the store.
 * @param path JSONPath expression
 * @returns boolean
 */
export const ensurePathExists = (path: string) => {
  if (typeof path !== "string") {
    throw new Error(`Path is not a string: ${path}`);
  }
  const splitPath = JSONPath.toPathArray(path).slice(1);
  let subState = <any>this;
  let pathIsValid = true;
  for (let depth = 0; depth < splitPath.length; depth++) {
    if (splitPath[depth] in subState) {
      subState = subState[splitPath[depth]];
    } else {
      pathIsValid = false;
      break;
    }
  }
  return pathIsValid;
};

/**
 * MockStore for testing purposes.
 * @param store A store object, consisting of keys and values.
 * @returns StoreAPI
 */
export const useStore = (store: StateTree): StoreAPI => {
  return {
    /**
     * The store object.
     */
    store: store,
    /**
     * The getProperty function is used to get a value from the store.
     * @param path JSONPath expression
     * @returns Any
     */
    getProperty: (path: JSONPathExpression) => {
      const result = JSONPath({ path: path, json: store });
      if (result.length === 1) return result[0];
      else return result;
    },
    /**
     * The setProperty function is used to mutate a value in the store.
     * This function can be hooked into, to log all changes to the store.
     * @param payload StoreSetterPayload
     */
    setProperty: (payload: StoreSetterPayload) => {
      const { path, value } = payload;
      const splitPath = JSONPath.toPathArray(path).slice(1);
      let subState = store;
      for (let depth = 0; depth < splitPath.length; depth++) {
        if (depth === splitPath.length - 1) {
          if (subState[splitPath[depth]] != value) {
            subState[splitPath[depth]] = value;
          }
        } else subState = subState[splitPath[depth]];
      }
    }
  };
};
