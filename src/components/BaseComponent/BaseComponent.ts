import type { StoreAPI, JSONPathExpression } from "@/stores/Store";
import { ensurePathExists } from "@/stores/Store";
import { unref, computed, ref } from "vue";
import type { Ref, ComputedRef, StyleValue, EmitFn } from "vue";
import type { TypeOfLastTupleElement } from "@/Util/Util";

/**
 * A description of a user-facing method of a component.
 */
export interface MethodReference {
  description: string;
}

/**
 * A map of method names and their descriptions.
 */
export interface MethodReferences {
  [methodName: string]: MethodReference;
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
export interface ExposedMethods {
  [methodName: string]: MethodImplementation;
}

/**
 * The basic properties of a CARPET component.
 */
export interface ComponentProps {
  /**
   * The ID of the component.
   *
   * @minimumn 0
   * @TJS-type integer
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
 * Base-type of a private emitted event of a component. Private events are meant to be consumed only by other components.
 */
export type PrivateComponentEmit = [];

/**
 * The payload of an public action-event.
 */
export interface ActionPayload {}

/**
 * Base-type of a public emitted event of a component.
 * Public events are meant to be consumed by the execution engine that executes the component.
 */
export type PublicComponentEmit = [actionType: string, payload: ActionPayload] &
  PrivateComponentEmit;

/**
 * Eventual emitted events of a component. Parent components can listen to these events.
 *
 * These should be consumed by the execution engine for the individual components.
 *
 * Also useful when nesting components.
 */
export interface ComponentEmits {
  [key: string]: PrivateComponentEmit;
}
// Record<string, PrivateComponentEmit>;

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
export type ValidationConfiguration = {};

/**
 * There may be multiple validation strategies for a component.
 * It is advised to utilize the ValidationStrategy-interface and its type property to distinguish between different strategies.
 */
export interface ValidationStrategy extends ValidationConfiguration {
  type: string;
}

/**
 * If multiple strategies are used, the strategies are to be acessed via the InputFieldValidationConfigurationMap-type.
 */
// export type ValidationConfigurationMap = Record<string, ValidationStrategy>;
export interface ValidationConfigurationMap {}

/**
 * Serialised dependencies of a component.
 */
// Since interface Index Signatures can not be optional, the following Typedefinitions have to be types of Record<S, T> https://github.com/microsoft/TypeScript/issues/46969
export type SerialisedDependencies = Record<string, JSONPathExpression | undefined>;
/**
 * The dependencies of a component.
 */
export type ComponentDependencies = Record<string, any>;

/**
 * If a component provides a custom inner component layout, this type is to be used to configure the layout.
 * The layout is required to be built with CSS Grid.
 */
// TODO: This type is not yet used in the codebase. It is a placeholder for future development. E.g. for FermentALADIN.
export type CustomInnerComponentLayout = {};

/**
 * Possible nested components of a component. The components can be nested arbitrarily.
 */
export interface NestedComponents {
  [nestedComponentGroupNameOrnestedComponentName: string]:
    | SerializedBaseComponent
    | NestedComponents;
}

/**
 * Component configuration. This holds possible configuration options for the component.
 */
export interface ComponentConfiguration {
  /**
   * Some components may offer a customizable inner component layout. The layout is required to be built with CSS Grid.
   */
  innerComponentLayout?: CustomInnerComponentLayout;
}

/**
 * The state of a component.
 */
export type ComponentState = {
  /**
   * Specifices whether the user-inputs put the component in a valid state. Gives no indication of correctness of the inputs.
   */
  isValid: boolean;
  /**
   * Specifices whether the user-inputs put the component in a correct state. Inputs are validated according to the components validation specification.
   */
  isCorrect: boolean;
};

/**
 * The serialized configuration of a component action.
 */
export interface ComponentAction {
  type: string;
}

/**
 * The fetch action is a special action that is used to fetch data from an external source.
 */
export interface FetchAction extends ComponentAction {
  type: "fetch";
}

/**
 * The serialized configuration for the actions of a component.
 */
export interface ComponentActions {
  [key: string]: ComponentAction;
}

/**
 * Generic type description with defaults of a serialised base component.
 */
export interface SerializedBaseComponent<T extends BaseComponentType = BaseComponentType> {
  /**
   * The type of the component.
   */
  type: T;
  /**
   * The name of the component instance. Will be displayed in the component header in CARPET.
   */
  name: string;
  /**
   * The dependencies of the component.
   */
  dependencies: SerialisedDependencies;
  /**
   * The state of the component.
   */
  state: ComponentState;
  /**
   * Configuration options that are specific to the individual component.
   */
  componentConfiguration?: ComponentConfiguration;
  /**
   * The validation configuration of the component.
   */
  validationConfiguration?: ValidationConfiguration;
  /**
   * Optional: The methods of the component.
   */
  methods?: MethodReferences;
  /**
   * Optional: The context menu of the component.
   */
  contextMenu?: SerialisedContextMenu;
  /**
   * Optional: Nested components of the component.
   */
  nestedComponents?: NestedComponents;
  /**
   * Optional: Actions that can be emitted by the component.
   */
  actions?: ComponentActions;
}

/**
 * The specification of a component. Contains the serialized component, and the actual dependencies and the method implementations of the runtime component instance.
 */
export interface ComponentTypeSpecification {
  SerializedComponent: SerializedBaseComponent;
  Dependencies: ComponentDependencies;
  MethodImplementations: ExposedMethods;
  Emits: ComponentEmits;
}

/**
 * The BaseComponent class is the base class for all derived CARPET components.
 */
export abstract class BaseComponent<
  T extends ComponentTypeSpecification = ComponentTypeSpecification
> {
  protected serializedBaseComponent: ComputedRef<T["SerializedComponent"]>;
  protected dependencies: ComputedRef<T["Dependencies"]>;
  protected validationConfiguration: ComputedRef<
    T["SerializedComponent"]["validationConfiguration"]
  >;

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
    this.serializedBaseComponent = this.getComputedTaskGraphProperty<T["SerializedComponent"]>(
      serialisedBaseComponentPath
    );

    this.dependencies = this.loadDependencies();
    this.validationConfiguration = this.loadValidationConfiguration();
  }

  private loadValidationConfiguration() {
    return <ComputedRef<T["SerializedComponent"]["validationConfiguration"]>>computed(() => {
      return unref(this.serializedBaseComponent).validationConfiguration;
    });
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
   * @returns ComputedRef<T["Dependencies"]
   */
  public loadDependencies() {
    this.dependencies = <ComputedRef<T["Dependencies"]>>computed(() => {
      const dependencies: { [key: string]: any } = {};

      const dependencyPaths = this.getDependencyPaths();
      for (const [dependencyName, dependencyPath] of Object.entries(unref(dependencyPaths))) {
        const dependencyValue = unref(this.storeObject).getProperty(
          dependencyPath as JSONPathExpression
        );
        dependencies[dependencyName] = dependencyValue;
      }
      return dependencies;
    });
    return this.dependencies;
  }

  /**
   * Getter function to get the component state.
   * @returns <Ref<T["SerializedComponent"]["state"]>>
   */
  public getComponentState(): Ref<T["SerializedComponent"]["state"]> {
    return <Ref<T["SerializedComponent"]["state"]>>ref(unref(this.serializedBaseComponent).state);
  }

  /**
   * Getter function to get the component configuration.
   * @returns <Ref<T["SerializedComponent"]["componentConfiguration"]>
   */
  public getComponentConfiguration(): Ref<T["SerializedComponent"]["componentConfiguration"]> {
    return <Ref<T["SerializedComponent"]["componentConfiguration"]>>(
      ref(unref(this.serializedBaseComponent).componentConfiguration)
    );
  }

  /**
   * Getter function to get the component serialisation.
   * @returns Ref<T["SerializedComponent"]>
   */
  public getSerializedComponent(): Ref<T["SerializedComponent"]> {
    return this.serializedBaseComponent;
  }

  /**
   * Getter function to get the component dependency paths
   * @returns T["SerializedComponent"]["dependencies"]
   */
  public getDependencyPaths(): T["SerializedComponent"]["dependencies"] {
    return <T["SerializedComponent"]["dependencies"]>(
      unref(this.serializedBaseComponent).dependencies
    );
  }

  /**
   * Getter function to get the component dependencies
   * @returns ComputedRef<T["Dependencies"]
   */
  public getDependencies() {
    return this.dependencies;
  }

  /**
   * Getter function to get the nested components
   * @returns T["SerializedComponent"]["nestedComponents"]
   */
  public getNestedComponents() {
    return <T["SerializedComponent"]["nestedComponents"]>(
      unref(this.serializedBaseComponent).nestedComponents
    );
  }

  /**
   * Getter function to get the component path
   */
  public getComponentPath() {
    return this.serialisedBaseComponentPath;
  }

  /**
   * Validation function to validate the component.
   * The function must set the isValid property of the component by assessing the structural validity of the component. (Type assertion)
   * The function must set the isCorrect property of the component by assessing the correctness of the component. (Value assertion)
   */
  protected abstract validate(value: any): { isValid: boolean; isCorrect: boolean };

  /**
   * Helper function to get a computed property from the store.
   * @param taskGraphPath
   * @returns ComputedRef<P>
   */
  public getComputedTaskGraphProperty = <P = any>(taskGraphPath: JSONPathExpression) => {
    return computed<P>(() => unref(this.storeObject).getProperty(taskGraphPath));
  };

  /**
   * Getter function to get the selected methods.
   * @param methodImplementations
   * @returns T["MethodImplementations"]
   */
  public getSelectedMethods = (
    methodImplementations: T["MethodImplementations"]
  ): T["MethodImplementations"] => {
    const methods = <T["SerializedComponent"]["methods"]>(
      unref(this.serializedBaseComponent).methods
    );
    // Typeguard
    if (!methods) return <T["MethodImplementations"]>{};
    return Object.entries(methods).reduce(
      (selectedMethods, [methodName, methodDefinition]) => {
        const { description } = methodDefinition;
        return { ...selectedMethods, [description]: methodImplementations[methodName] };
      },
      <T["MethodImplementations"]>{}
    );
  };

  /**
   * Returns the action configuration for a specific action of the component.
   * @param event String that associates with an action of the component.
   * @returns
   */
  public getActionConfig = (event: string) => {
    return this.serializedBaseComponent.value.actions?.[event] as ComponentAction;
  };

  /**
   * The actionHandler function is used to emit an action event.
   * @param emit
   * @param event
   */
  public actionHandler = (emit: EmitFn, event: string) => {
    const payload = this.constructPayload?.();
    const { type } = this.getActionConfig(event);

    emit("action", type, payload);
  };

  /**
   * The constructPayload function is used to construct the payload of an action event.
   * The function must be implemented in the derived component class.
   * @returns
   */
  protected constructPayload?(): ActionPayload | TypeOfLastTupleElement<T["Emits"][string]>;
}
