import React, { Fragment } from 'react';
import { Table, Row, Col } from 'reactstrap';
import {
    TODAY_SHORTCUT,
    PREVIOUS_DATE_SHORTCUT,
    NEXT_DATE_SHORCUT,
    PREVIOUS_TODO_SHORTCUT,
    NEXT_TODO_SHORTCUT,
    TOGGLE_COMPLETED_SHORTCUT,
    TODO_EDIT_SHORTCUT,
    TODO_DELETE_SHORTCUT,
} from '../calendarOverview/CalendarOverview';

function checkDashShouldBeDisplayed(shortcuts: string[], currentIndex: number) {
    return currentIndex < shortcuts.length - 1;
}

type ShortcutsAndDescriptionMappingType = Array<{
    shortcut: string | string[];
    description: string;
}>;

const shortcutsAndDescriptionMapping: ShortcutsAndDescriptionMappingType = [
    {
        shortcut: TODAY_SHORTCUT,
        description: 'Navigate to today.',
    },
    {
        shortcut: PREVIOUS_DATE_SHORTCUT,
        description: 'Move focus to the previous date.',
    },
    {
        shortcut: NEXT_DATE_SHORCUT,
        description: 'Move focus to the next date.',
    },
    {
        shortcut: PREVIOUS_TODO_SHORTCUT,
        description: 'Move focus to the previous todo.',
    },
    {
        shortcut: NEXT_TODO_SHORTCUT,
        description: 'Move focus to the next todo.',
    },
    {
        shortcut: TOGGLE_COMPLETED_SHORTCUT,
        description: 'Toggle completed status of currently selected todo.',
    },
    {
        shortcut: TODO_EDIT_SHORTCUT,
        description: 'Start editing the currently selected todo.',
    },
    {
        shortcut: TODO_DELETE_SHORTCUT,
        description: 'Delete the currently selected todo',
    },
];

const KeyboardShortcutOverview = () => {
    return (
        <Row>
            <Col md={{ size: 6, offset: 3 }}>
                <Table>
                    <thead>
                        <tr>
                            <th style={{ width: '200px' }}>
                                Key (combination)
                            </th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shortcutsAndDescriptionMapping.map(pair => {
                            const shortcuts = Array.isArray(pair.shortcut)
                                ? pair.shortcut
                                : [pair.shortcut];
                            const description = pair.description;

                            return (
                                <tr>
                                    <td>
                                        {shortcuts.map((shortcut, index) => (
                                            <Fragment>
                                                <code>{shortcut}</code>
                                                {checkDashShouldBeDisplayed(
                                                    shortcuts,
                                                    index
                                                ) && ' / '}
                                            </Fragment>
                                        ))}
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
