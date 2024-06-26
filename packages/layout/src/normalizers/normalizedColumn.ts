import {
  type PlateEditor,
  type TNode,
  type TNodeEntry,
  type Value,
  createPathRef,
  getLastChildPath,
  isElement,
} from '@udecode/plate-common/server';

import type { TColumnGroupElement } from '../types';

import { ELEMENT_COLUMN_GROUP } from '../createColumnPlugin';
import { moveMiddleColumn } from '../transforms';
import { insertEmptyColumn } from '../transforms/insertEmptyColumn';
import { setColumnWidth } from '../transforms/setColumnWidth';

export const normalizeColumn = <V extends Value, N extends TNode>(
  editor: PlateEditor<V>
) => {
  const { normalizeNode } = editor;

  return function (entry: TNodeEntry<N>) {
    if (isElement(entry[0]) && entry[0].type === ELEMENT_COLUMN_GROUP) {
      return normalizeColumnHelper(
        editor,
        entry as unknown as TNodeEntry<TColumnGroupElement>
      );
    }

    return normalizeNode(entry);
  };
};

const normalizeColumnHelper = <V extends Value, N extends TColumnGroupElement>(
  editor: PlateEditor<V>,
  entry: TNodeEntry<N>
) => {
  const [node, path] = entry;

  const prevChildrenCnt = node.children.length;
  const currentLayout = node.layout;

  if (!currentLayout) return;

  const currentChildrenCnt = currentLayout.length;

  const groupPathRef = createPathRef(editor, path);

  if (prevChildrenCnt === 2 && currentChildrenCnt === 3) {
    const lastChildPath = getLastChildPath(entry);

    insertEmptyColumn(editor, {
      at: lastChildPath,
    });

    setColumnWidth(editor, groupPathRef, currentLayout);
  }
  if (prevChildrenCnt === 3 && currentChildrenCnt === 2) {
    moveMiddleColumn(editor, entry, { direction: 'left' });
    setColumnWidth(editor, groupPathRef, currentLayout);
  }
  if (prevChildrenCnt === currentChildrenCnt) {
    setColumnWidth(editor, groupPathRef, currentLayout);
  }
};
