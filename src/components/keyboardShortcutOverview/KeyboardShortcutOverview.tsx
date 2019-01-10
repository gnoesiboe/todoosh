import React, { Fragment } from 'react';
import { Table, Row, Col } from 'reactstrap';
import { KeyboardShortcuts } from '../../navigation/KeyboardShortcuts';

function checkDashShouldBeDisplayed(shortcuts: string[], currentIndex: number) {
    return currentIndex < shortcuts.length - 1;
}

type ShortcutsAndDescriptionMappingType = Array<{
    shortcut: string | string[];
    description: string;
}>;

const shortcutsAndDescriptionMapping: ShortcutsAndDescriptionMappingType = [
    {
        shortcut: KeyboardShortcuts.TODAY_SHORTCUT,
        description: 'Navigate to today.',
    },
    {
        shortcut: KeyboardShortcuts.PREVIOUS_DATE_SHORTCUT,
        description: 'Move focus to the previous date.',
    },
    {
        shortcut: KeyboardShortcuts.NEXT_DATE_SHORCUT,
        description: 'Move focus to the next date.',
    },
    {
        shortcut: KeyboardShortcuts.PREVIOUS_TODO_SHORTCUT,
        description: 'Move focus to the previous todo.',
    },
    {
        shortcut: KeyboardShortcuts.NEXT_TODO_SHORTCUT,
        description: 'Move focus to the next todo.',
    },
    {
        shortcut: KeyboardShortcuts.TOGGLE_COMPLETED_SHORTCUT,
        description: 'Toggle completed status of currently selected todo.',
    },
    {
        shortcut: KeyboardShortcuts.ADD_TODO_SHORTCUT,
        description: 'Add a todo for the currently seleted date',
    },
    {
        shortcut: KeyboardShortcuts.TODO_EDIT_SHORTCUT,
        description: 'Start editing the currently selected todo.',
    },
    {
        shortcut: KeyboardShortcuts.TODO_DELETE_SHORTCUT,
        description: 'Delete the currently selected todo.',
    },
    {
        shortcut: KeyboardShortcuts.MOVE_TODO_DOWN,
        description: 'Move the currently selected todo down.',
    },
    {
        shortcut: KeyboardShortcuts.MOVE_TODO_UP,
        description: 'Move the currently selected todo up.',
    },
    {
        shortcut: KeyboardShortcuts.MOVE_TODO_TO_NEXT_DATE,
        description: 'Move the currently selected todo to the next date.',
    },
];

const KeyboardShortcutOverview = () => {
    return (
        <Row>
            <Col md={{ size: 6, offset: 3 }}>
                <h3>Keyboard shortcuts</h3>
                <Table bordered>
                    <tbody>
                        {shortcutsAndDescriptionMapping.map((pair, index) => {
                            const shortcuts = Array.isArray(pair.shortcut)
                                ? pair.shortcut
                                : [pair.shortcut];
                            const description = pair.description;

                            return (
                                <tr key={index}>
                                    <td>
                                        {shortcuts.map(
                                            (shortcut, shortcutIndex) => (
                                                <Fragment key={shortcutIndex}>
                                                    <code>{shortcut}</code>
                                                    {checkDashShouldBeDisplayed(
                                                        shortcuts,
                                                        shortcutIndex
                                                    ) && ' / '}
                                                </Fragment>
                                            )
                                        )}
                                    </td>
                                    <td>{description}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default KeyboardShortcutOverview;
