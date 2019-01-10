import React, { Fragment } from 'react';
import {
    createDateRelativeToSupplied,
    checkDateIsInThePast,
} from './../../../utility/dateTImeHelper';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './TimeNavigationButton';
import { Col } from 'reactstrap';

type Props = {
    currentDate: Date;
    onBackClick: OnClickCallback;
    onForwardClick: OnClickCallback;
    onTodayClick: () => void;
};

const DateNavigator = ({
    currentDate,
    onBackClick,
    onForwardClick,
    onTodayClick,
}: Props) => {
    const nextDate = createDateRelativeToSupplied(currentDate, -1);
    const previousDateIsAccessible = !checkDateIsInThePast(nextDate);

    return (
        <Fragment>
            <Col md={{ size: 1, offset: 4 }} className="text-right">
                {previousDateIsAccessible && (
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={onBackClick}
                    />
                )}
            </Col>
            <Col md={2} className="text-center">
                <button className="btn btn-link" onClick={onTodayClick}>
                    today
                </button>
            </Col>
            <Col md={1} className="text-left">
                <TimeNavigationButton
                    direction={Direction.Forward}
                    onClick={onForwardClick}
                />
            </Col>
        </Fragment>
    );
};

export default DateNavigator;
