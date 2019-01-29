import React from 'react';
import {
    formatDistanceFromToday,
    parseDate,
    checkDateIsToday,
    checkDateIsTomorrow,
    checkDateIsInThePast,
} from '../../../utility/dateTimeHelper';
import createClassName from 'classnames';
import './TodoDeadline.scss';

type Props = {
    deadline: string;
};

const TodoDeadline = ({ deadline }: Props) => {
    const deadlineAsDate = parseDate(deadline);

    const className = createClassName('todo--deadline', {
        'todo--deadline__danger':
            checkDateIsToday(deadlineAsDate) ||
            checkDateIsInThePast(deadlineAsDate),
        'todo--deadline__warning': checkDateIsTomorrow(deadlineAsDate),
    });

    return (
        <span className={className}>
            {formatDistanceFromToday(deadlineAsDate)}
        </span>
    );
};

export default TodoDeadline;
