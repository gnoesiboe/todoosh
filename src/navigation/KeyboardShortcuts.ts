type KeyboardShortcutsType = {
    readonly [key: string]: string[] | string;
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
};
