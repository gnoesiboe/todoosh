import React, { ReactElement } from 'react';
import FlipMove from 'react-flip-move';

type Props = {
    settings?: FlipMove.FlipMoveProps;
    children: Array<ReactElement<any> | JSX.Element[] | null | undefined>;
};

const ListAnimation = ({ settings = {}, children }: Props) => {
    const mergedSettings: FlipMove.FlipMoveProps = {
        duration: 200,
        staggerDelayBy: 50,
        enterAnimation: 'accordionVertical',
        leaveAnimation: 'accordionVertical',
        ...settings,
    };

    return <FlipMove {...mergedSettings}>{children}</FlipMove>;
};

export default ListAnimation;
