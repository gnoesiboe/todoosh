import mousetrap from 'mousetrap';

type KeyboardShortcut = string[] | string;

type KeyboardShortcutsType = {
    readonly [key: string]: KeyboardShortcut;
};

export const KeyboardShortcuts: KeyboardShortcutsType = {
    NEXT_DATE_SHORCUT: ['right', 'n'],
    PREVIOUS_DATE_SHORTCUT: ['left', 'p'],
    NEXT_TODO_SHORTCUT: ['down', 'j'],
    PREVIOUS_TODO_SHORTCUT: ['up', 'k'],
    TODAY_SHORTCUT: 't',
    TOGGLE_COMPLETED_SHORTCUT: 'space',
    ADD_TODO_SHORTCUT: 'a',
    TODO_EDIT_SHORTCUT: ['e', 'enter'],
    TODO_DELETE_SHORTCUT: ['d', 'del', 'backspace'],
    MOVE_TODO_DOWN: ['meta+down'],
    MOVE_TODO_UP: ['meta+up'],
    MOVE_TODO_TO_NEXT_DATE: ['meta+right'],
};

export function bindKeyboardShortcut(
    shortcut: KeyboardShortcut,
    callback: (e: ExtendedKeyboardEvent) => void
): void {
    mousetrap.bind(shortcut, callback);
}

export function unbindKeyboardShortcut(shortcut: KeyboardShortcut): void {
    mousetrap.unbind(shortcut);
}
