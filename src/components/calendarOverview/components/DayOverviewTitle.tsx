import React from 'react';
import { formatDistanceFromToday } from './../../../utility/dateTImeHelper';
import './DayOverviewTitle.scss';

type Props = {
    date: Date;
};

const DayOverviewTitle = ({ date }: Props) => {
    return (
        <h3 className="day-overview-title">{formatDistanceFromToday(date)}</h3>
    );
};

export default DayOverviewTitle;
