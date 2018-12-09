import React from 'react';

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

const TimeNavigationButton = ({ direction, onClick }: Props) => {
    const icon = direction === Direction.Back ? '<' : '>';

    return (
        <a href="#" onClick={onClick}>
            {icon}
        </a>
    );
};

export default TimeNavigationButton;
