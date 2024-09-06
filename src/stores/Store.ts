import { JSONPath } from "jsonpath-plus";
import type { Store, StateTree } from "pinia";
import { computed } from "vue";

// TODO: see capabilities of Typescripts Template Literal Types (regarding recursivity) or when and if RegEx-Types are available
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

export type JSONPathExpression =
  | `$` // Root element
  | `$.${JSONPathSubExpression}`; // Child operator

export interface StoreGetter {
  (path: JSONPathExpression): any;
}

export interface StoreSetterMetaData {
  [key: string]: any;
}

export interface StoreSetterPayload {
  path: JSONPathExpression;
  value: any;
  metadata?: StoreSetterMetaData;
}

export interface StoreSetter {
  (payload: StoreSetterPayload): void;
}

export interface StoreAPI<State extends StateTree = {}> {
  store?: StateTree;
  getProperty: StoreGetter;
  setProperty: StoreSetter;
}

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

export const useStore = (store: StateTree): StoreAPI => {
  return {
    store: store,
    getProperty: (path: JSONPathExpression) => {
      let result = JSONPath({ path: path, json: store });
      if (result.length === 1) return result[0];
      else return result;
    },
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

// useMockStore({
//   test: "test"
// });
