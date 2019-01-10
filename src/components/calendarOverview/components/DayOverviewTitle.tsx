import React from 'react';
import { formatDistanceFromToday } from '../../../utility/dateTimeHelper';
import './DayOverviewTitle.scss';

type Props = {
    date: Date;
    onClick: () => void;
};

const DayOverviewTitle = ({ date, onClick }: Props) => {
    return (
        <h3 className="day-overview-title" onClick={onClick}>
            {formatDistanceFromToday(date)}
        </h3>
    );
};

export default DayOverviewTitle;
