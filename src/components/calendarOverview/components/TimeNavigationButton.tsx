import React from 'react';
import left from './../../../icons/left.svg';
import right from './../../../icons/right.svg';

export enum Direction {
    Back,
    Forward,
}

export type OnClickCallback = (
    event: React.MouseEvent<HTMLAnchorElement>
) => void;

type Props = {
    direction: Direction;
    onClick: OnClickCallback;
};

const TimeNavigationButton = ({ direction, onClick }: Props) => (
    <a href="#" onClick={onClick}>
        <img src={direction === Direction.Back ? left : right} />
    </a>
);

export default TimeNavigationButton;
