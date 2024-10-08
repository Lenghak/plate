import React from 'react';

import type { TEditableProps } from '@udecode/slate-react';

import type { PlateEditor } from '../editor/PlateEditor';
import type { PlateRenderLeafProps } from '../plugin/PlateRenderLeafProps';

import { pipeInjectNodeProps } from '../../lib';
import { DefaultLeaf } from '../components';
import { type RenderLeaf, pluginRenderLeaf } from './pluginRenderLeaf';

/** @see {@link RenderLeaf} */
export const pipeRenderLeaf = (
  editor: PlateEditor,
  renderLeafProp?: TEditableProps['renderLeaf']
): TEditableProps['renderLeaf'] => {
  const renderLeafs: RenderLeaf[] = [];

  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && plugin.key) {
      renderLeafs.push(pluginRenderLeaf(editor, plugin));
    }
  });

  return function render(nodeProps) {
    const props = pipeInjectNodeProps(
      editor,
      nodeProps
    ) as PlateRenderLeafProps;

    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props as any);

      if (newChildren !== undefined) {
        props.children = newChildren;
      }
    });

    if (renderLeafProp) {
      return renderLeafProp(props);
    }

    return <DefaultLeaf {...props} />;
  };
};
