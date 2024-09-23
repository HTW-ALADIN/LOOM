import type { StoreAPI, JSONPathExpression } from "@/stores/Store";
import { ensurePathExists } from "@/stores/Store";
import { unref, computed, ref } from "vue";
import type { Ref, ComputedRef, StyleValue } from "vue";

/**
 * A description of a user-facing method of a component.
 */
export interface SerialisedMethod {
  description: string;
}

/**
 * A map of method names and their descriptions.
 */
export interface SerialisedMethods {
  [methodName: string]: SerialisedMethod;
}

/**
 * A method implementation.
 */
export interface MethodImplementation {
  (): void;
}

/**
 * A map of method names and their implementations.
 */
export interface MethodImplementations {
  [methodName: string]: MethodImplementation;
}

/**
 * The basic properties of a CARPET component.
 */
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
/**
 * The type of a component.
 */
export type BaseComponentType = string;

/**
 * The serialised context menu of a component.
 */
export type SerialisedContextMenu = {
  /**
   * Specifies whether the context menu is open.
   */
  isOpen: boolean;
  /**
   * The methods that will be made available in the context menu.
   */
  usedMethods: Array<string>;
};

/**
 * The configuration of the validation of a component.
 */
//TODO: Implement validation configuration (mostly governed by Matrix component, as it is most complex as of now)
export type ValidationConfiguration = {};

/**
 * Serialised dependencies of a component.
 */
// Since interface Index Signatures can not be optional, the following Typedefinitions have to be types of Record<S, T> https://github.com/microsoft/TypeScript/issues/46969
export type SerialisedDependencies = Record<string, JSONPathExpression>;
/**
 * The dependencies of a component.
 */
export type ComponentDependencies = Record<string, any>;
/**
 * Possible nested components of a component.
 */
export type NestedComponents = Record<string, BaseComponent>;
/**
 * The data of a component.
 */
export type ComponentData = Record<string, any>;
/**
 * Supported layout sizes for CARPET.
 */
export type LayoutSizes = "phone" | "tablet" | "desktop";
/**
 * The layout of a component.
 */
export type Layout = Array<{
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
}>;

export type Layouts = {
  [layoutSize in LayoutSizes]: Layout;
};

/**
 * Generic type description with defaults of a serialised base component.
 */
export interface SerializedBaseComponent<
  T extends BaseComponentType = BaseComponentType,
  D extends SerialisedDependencies = SerialisedDependencies,
  C extends ComponentData = ComponentData,
  SM extends SerialisedMethods = SerialisedMethods,
  SC extends SerialisedContextMenu = SerialisedContextMenu,
  NC extends NestedComponents = NestedComponents
> {
  /**
   * The type of the component.
   */
  type: T;
  /**
   * The layouts of the component.
   */
  layouts: Layouts;
  /**
   * The name of the component. Will be displayed in the component header in CARPET.
   */
  name: string;
  /**
   * Specifices whether the user-inputs put the component in a valid state. Gives no indication of correctness of the inputs.
   */
  isValid: boolean;
  /**
   * Specifices whether the user-inputs put the component in a correct state. Inputs are validated according to the components validation specification.
   */
  isCorrect: boolean;
  /**
   * The dependencies of the component.
   */
  dependencies: D;
  /**
   * The data of the component.
   */
  component: C;
  /**
   * The methods of the component.
   */
  methods?: SM;
  /**
   * Optional: The context menu of the component.
   */
  contextMenu?: SC;
  /**
   * Optional: Nested components of the component.
   */
  nestedComponents?: NC;
}

// TODO: keep an eye on https://github.com/microsoft/TypeScript/issues/10571 for better type inference

/**
 * The BaseComponent class is the base class for all derived CARPET components.
 */
export abstract class BaseComponent<
  C extends SerializedBaseComponent = SerializedBaseComponent,
  SD extends SerialisedDependencies = SerialisedDependencies,
  D extends ComponentDependencies = ComponentDependencies,
  CD extends ComponentData = ComponentData,
  SM extends SerialisedMethods = SerialisedMethods,
  M extends MethodImplementations = MethodImplementations,
  NC extends NestedComponents = NestedComponents
> {
  protected serializedBaseComponent: ComputedRef<C>;
  protected dependencies: ComputedRef<D>;

  constructor(
    /**
     * Instantiate component with mandatory props:
     * @param storeObject The store object, that is used to access and mutate the data.
     * @param componentID The ID of the component.
     * @param serialisedBaseComponentPath The path in the store object that points to the serialised component.
     */
    protected storeObject: Ref<StoreAPI>,
    protected componentID: number,
    protected serialisedBaseComponentPath: JSONPathExpression
  ) {
    this.serializedBaseComponent = this.getComputedTaskGraphProperty<C>(
      serialisedBaseComponentPath
    );

    this.dependencies = this.loadDependencies();
  }

  /**
   * Check if dependencies exists in the store.
   * @param dependencyPath
   * @returns boolean
   */
  public checkDependency(dependencyPath: string) {
    return computed(() => {
      if (dependencyPath) return ensurePathExists(dependencyPath);
      return false;
    });
  }

  /**
   * Load the dependencies of the component.
   * @returns ComputedRef<D>
   */
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

  /**
   * Getter function to get the component data.
   * @returns Ref<CD>
   */
  public getComponentData(): Ref<CD> {
    return <Ref<CD>>ref(unref(this.serializedBaseComponent).component);
  }

  /**
   * Getter function to get the component serialisation.
   * @returns Ref<C>
   */
  public getSerializedComponent(): Ref<C> {
    return this.serializedBaseComponent;
  }

  /**
   * Getter function to get the component dependency paths
   * @returns SD
   */
  public getDependencyPaths(): SD {
    return <SD>unref(this.serializedBaseComponent).dependencies;
  }

  /**
   * Getter function to get the component dependencies
   * @returns ComputedRef<D>
   */
  public getDependencies() {
    return this.dependencies;
  }

  /**
   * Getter function to get the nested components
   * @returns ComputedRef<NC>
   */
  public getNestedComponents() {
    return unref(this.serializedBaseComponent).nestedComponents;
  }

  /**
   * Getter function to get the nested component paths
   * @returns ComputedRef<{ [nestedComponentName in KeyOfType<NC>]: JSONPathExpression }>
   */
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

  /**
   * Validation function to validate the component.
   */
  protected abstract validate(): void;

  /**
   * Helper function to get a computed property from the store.
   * @param taskGraphPath
   * @returns ComputedRef<T>
   */
  public getComputedTaskGraphProperty = <T = any>(taskGraphPath: JSONPathExpression) => {
    return computed<T>(() => unref(this.storeObject).getProperty(taskGraphPath));
  };

  /**
   * Getter function to get the selected methods.
   * @param methodImplementations
   * @returns
   */
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
