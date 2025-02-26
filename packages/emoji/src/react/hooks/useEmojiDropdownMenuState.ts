import { useEditorPlugin, useStableMemo } from '@udecode/plate/react';

import {
  type EmojiSettingsType,
  EmojiFloatingIndexSearch,
  EmojiSettings,
} from '../../lib';
import { EmojiPlugin } from '../EmojiPlugin';
import { FrequentEmojiStorage } from '../storage';
import { EmojiFloatingLibrary } from '../utils';
import { useEmojiPicker } from './useEmojiPicker';

export type EmojiDropdownMenuOptions = {
  closeOnSelect?: boolean;
  settings?: EmojiSettingsType;
};

export function useEmojiDropdownMenuState({
  closeOnSelect = true,
  settings = EmojiSettings,
}: EmojiDropdownMenuOptions = {}) {
  const { useOption } = useEditorPlugin(EmojiPlugin);
  const data = useOption('data')!;

  const [emojiLibrary, indexSearch] = useStableMemo(() => {
    const frequentEmojiStorage = new FrequentEmojiStorage({
      limit: settings.showFrequent.limit,
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const emojiLibrary = EmojiFloatingLibrary.getInstance(
      settings,
      frequentEmojiStorage,
      data
    );

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const indexSearch = EmojiFloatingIndexSearch.getInstance(emojiLibrary);

    return [emojiLibrary, indexSearch] as const;
  }, [settings]);

  const { isOpen, setIsOpen, ...emojiPickerState } = useEmojiPicker({
    closeOnSelect,
    emojiLibrary,
    indexSearch,
  });

  return {
    emojiPickerState,
    isOpen,
    setIsOpen,
  };
}
