import type { EditorApi, EditorTransforms, Value } from '@udecode/slate';
import type { UnionToIntersection } from '@udecode/utils';
import type { TEqualityChecker } from 'zustand-x';

import type {
  AnyPluginConfig,
  BaseEditor,
  InferApi,
  InferOptions,
  InferTransforms,
  PluginConfig,
  WithRequiredKey,
} from '../../lib';
import type {
  AnyEditorPlatePlugin,
  EditorPlatePlugin,
  Shortcuts,
} from '../plugin/PlatePlugin';
import type { EXPOSED_STORE_KEYS, PlateStoreState } from '../stores';
import type { PlateCorePlugin } from './withPlate';

export type PlateEditor = {
  getApi: <C extends AnyPluginConfig = PluginConfig>(
    plugin?: WithRequiredKey<C>
  ) => PlateEditor['api'] & InferApi<C>;

  getPlugin: <C extends AnyPluginConfig = PluginConfig>(
    plugin: WithRequiredKey<C>
  ) => C extends { node: any } ? C : EditorPlatePlugin<C>;

  getTransforms: <C extends AnyPluginConfig = PluginConfig>(
    plugin?: WithRequiredKey<C>
  ) => PlateEditor['tf'] & InferTransforms<C>;

  setPlateState: <K extends (typeof EXPOSED_STORE_KEYS)[number]>(
    optionKey: K,
    value: PlateStoreState[K]
  ) => void;

  transforms: EditorTransforms &
    UnionToIntersection<InferTransforms<PlateCorePlugin>>;

  useOption: {
    <
      C extends AnyPluginConfig,
      K extends keyof InferOptions<C>,
      F extends InferOptions<C>[K],
    >(
      plugin: WithRequiredKey<C>,
      optionKey: K
    ): F extends (...args: any[]) => any ? never : F;

    <
      C extends AnyPluginConfig,
      K extends keyof InferOptions<C>,
      F extends InferOptions<C>[K],
      Args extends Parameters<((...args: any[]) => any) & F>,
    >(
      plugin: WithRequiredKey<C>,
      optionKey: K,
      ...args: Args
    ): F extends (...args: any[]) => any ? ReturnType<F> : F;
  };

  useOptions: {
    <C extends AnyPluginConfig, U>(
      plugin: WithRequiredKey<C>,
      selector: (s: InferOptions<C>) => U,
      equalityFn?: TEqualityChecker<U>
    ): U;
    <C extends AnyPluginConfig>(plugin: WithRequiredKey<C>): InferOptions<C>;
  };

  api: EditorApi & UnionToIntersection<InferApi<PlateCorePlugin>>;

  pluginList: AnyEditorPlatePlugin[];

  plugins: Record<string, AnyEditorPlatePlugin>;

  shortcuts: Shortcuts;

  // Alias for transforms
  tf: EditorTransforms & UnionToIntersection<InferTransforms<PlateCorePlugin>>;

  uid?: string;
} & BaseEditor;

export type TPlateEditor<
  V extends Value = Value,
  P extends AnyPluginConfig = PlateCorePlugin,
> = PlateEditor & {
  getApi: <C extends AnyPluginConfig = PluginConfig>(
    plugin?: WithRequiredKey<C>
  ) => TPlateEditor<V>['api'] & InferApi<C>;
  getTransforms: <C extends AnyPluginConfig = PluginConfig>(
    plugin?: WithRequiredKey<C>
  ) => TPlateEditor<V>['tf'] & InferTransforms<C>;
  tf: EditorTransforms<V> &
    UnionToIntersection<InferTransforms<P | PlateCorePlugin>>;
  transforms: EditorTransforms<V> &
    UnionToIntersection<InferTransforms<P | PlateCorePlugin>>;
  api: EditorApi<V> & UnionToIntersection<InferApi<P | PlateCorePlugin>>;
  children: V;
  pluginList: P[];
  plugins: { [K in P['key']]: Extract<P, { key: K }> };
};
