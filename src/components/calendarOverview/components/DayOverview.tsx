import React from 'react';
import { Todo as TodoModel } from '../../../model/todo';
import createClassName from 'classnames';
import './DayOverview.scss';

export type OnTodoCompletedChangeCallback = (
    todo: TodoModel,
    date: Date,
    completed: boolean
) => void;

type Props = {
    isCurrent: boolean;
    children?: Array<JSX.Element | undefined>;
};

const DayOverview = ({ isCurrent, children }: Props) => {
    const className = createClassName('day-overview', {
        'day-overview__current': isCurrent,
    });

    return <div className={className}>{children}</div>;
};

export default DayOverview;
