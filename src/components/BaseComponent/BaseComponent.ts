import type { StoreAPI, JSONPathExpression } from "@/stores/Store";
import { ensurePathExists } from "@/stores/Store";
import { unref, computed, ref } from "vue";
import type { Ref, ComputedRef, StyleValue } from "vue";

export interface SerialisedMethod {
  description: string;
  impact: number;
}

export interface SerialisedMethods {
  [methodName: string]: SerialisedMethod;
}

export interface MethodImplementation {
  (): void;
}

export interface MethodImplementations {
  [methodName: string]: MethodImplementation;
}

export interface ComponentProps {
  /**
   * The ID of the component.
   */
  componentID: number;
  /**
   * The store object, that is used to access and mutate the data.
   */
  storeObject: StoreAPI;
  /**
   * The path in the store object that points to the serialised component.
   */
  componentPath: JSONPathExpression;
  /**
   * Optionally passed styling for the component.
   */
  style?: StyleValue;
}

export type BaseComponentType = string;
export type SerialisedContextMenu = {
  isOpen: boolean;
  usedMethods: Array<string>;
};
export interface SerialisedDependencies {}
export type ComponentDependencies = Record<string, any>;
export interface NestedComponents {}
export interface ComponentData {}

export interface SerializedBaseComponent<
  T extends BaseComponentType = BaseComponentType,
  D extends SerialisedDependencies = SerialisedDependencies,
  C extends ComponentData = ComponentData,
  SM extends SerialisedMethods = SerialisedMethods,
  SC extends SerialisedContextMenu = SerialisedContextMenu,
  NC extends NestedComponents = NestedComponents
> {
  type: T;
  name: string;
  isValid: boolean;
  isCorrect: boolean;
  dependencies: D;
  component: C;
  methods?: SM;
  contextMenu?: SC;
  nestedComponents?: NC;
}

// TODO: keep an eye on https://github.com/microsoft/TypeScript/issues/10571 for better type inference
export abstract class BaseComponent<
  C extends SerializedBaseComponent = SerializedBaseComponent,
  SD extends SerialisedDependencies = SerialisedDependencies,
  D extends ComponentDependencies = ComponentDependencies,
  CD extends ComponentData = ComponentData,
  SM extends SerialisedMethods = SerialisedMethods,
  M extends MethodImplementations = MethodImplementations,
  NC extends NestedComponents = NestedComponents
> {
  /**
   * The BaseComponent class is the base class for all derived components.
   */
  protected serializedBaseComponent: ComputedRef<C>;
  protected dependencies: ComputedRef<D>;

  constructor(
    protected storeObject: Ref<StoreAPI>,
    protected componentID: number,
    protected serialisedBaseComponentPath: JSONPathExpression
  ) {
    this.serializedBaseComponent = this.getComputedTaskGraphProperty<C>(
      serialisedBaseComponentPath
    );

    this.dependencies = this.loadDependencies();
  }

  public checkDependency(dependencyPath: string) {
    return computed(() => {
      if (dependencyPath) return ensurePathExists(dependencyPath);
      return false;
    });
  }

  public loadDependencies() {
    this.dependencies = <ComputedRef<D>>computed(() => {
      const dependencies: { [key: string]: any } = {};

      const dependencyPaths = this.getDependencyPaths();
      for (const [dependencyName, dependencyPath] of Object.entries(unref(dependencyPaths))) {
        const dependencyValue = unref(this.storeObject).getProperty(dependencyPath);
        dependencies[dependencyName] = dependencyValue;
      }
      return dependencies;
    });
    return this.dependencies;
  }

  public getComponentData(): Ref<CD> {
    return <Ref<CD>>ref(unref(this.serializedBaseComponent).component);
  }

  public getSerializedComponent(): Ref<C> {
    return this.serializedBaseComponent;
  }

  public getDependencyPaths(): SD {
    return <SD>unref(this.serializedBaseComponent).dependencies;
  }
  public getDependencies() {
    return this.dependencies;
  }
  public getNestedComponents() {
    return unref(this.serializedBaseComponent).nestedComponents;
  }

  public getNestedComponentPaths() {
    const nestedComponents = this.getNestedComponents();
    const nestedComponentsPaths = <
      { [nestedComponentName in KeyOfType<NC>]: JSONPathExpression }
    >{};
    for (const nestedComponentName in nestedComponents) {
      nestedComponentsPaths[nestedComponentName as KeyOfType<NC>] =
        `$.${this.serialisedBaseComponentPath}.nestedComponents.${nestedComponentName}`;
    }
    return nestedComponentsPaths;
  }

  protected abstract validate(): void;

  public getComputedTaskGraphProperty = <T = any>(taskGraphPath: JSONPathExpression) => {
    return computed<T>(() => unref(this.storeObject).getProperty(taskGraphPath));
  };

  public getSelectedMethods = (methodImplementations: M): M => {
    const methods = <SM>unref(this.serializedBaseComponent).methods;
    return Object.entries(methods).reduce(
      (selectedMethods, [methodName, methodDefinition]) => {
        const { description } = methodDefinition;
        return { ...selectedMethods, [description]: methodImplementations[methodName] };
      },
      <M>{}
    );
  };
}

// see typescript issue https://github.com/microsoft/TypeScript/issues/23724
type KeyTypes<T> = {
  [K in keyof T]-?: K extends string
    ? string
    : K extends number
      ? number
      : K extends symbol
        ? symbol
        : never;
}[keyof T];
type KeyOfType<T, KeyType extends string | number | symbol = KeyTypes<T>> = Extract<
  keyof T,
  KeyType
>;
