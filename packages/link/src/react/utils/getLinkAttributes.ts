import type { PlateEditor } from '@udecode/plate-common/react';

import { sanitizeUrl } from '@udecode/plate-common';

import type { TLinkElement } from '../../lib/types';
import type { LinkConfig } from '../LinkPlugin';

export const getLinkAttributes = (editor: PlateEditor, link: TLinkElement) => {
  const { allowedSchemes, dangerouslySkipSanitization, defaultLinkAttributes } =
    editor.getOptions<LinkConfig>({ key: 'a' });

  const attributes = { ...defaultLinkAttributes };

  const href = dangerouslySkipSanitization
    ? link.url
    : sanitizeUrl(link.url, { allowedSchemes }) || undefined;

  // Avoid passing `undefined` for href or target
  if (href !== undefined) {
    attributes.href = href;
  }
  if ('target' in link) {
    attributes.target = link.target;
  }

  return attributes;
};
