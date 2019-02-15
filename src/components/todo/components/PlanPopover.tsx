import React from 'react';
import { Popover, PopoverHeader, PopoverBody, Button } from 'reactstrap';
import './PlanPopover.scss';

type Props = {
    isOpen: boolean;
    onCancel: () => void;
    targetId: string;
    children: JSX.Element;
};

const PlanPopover = ({ isOpen, onCancel, targetId, children }: Props) => (
    <Popover
        placement="top"
        isOpen={isOpen}
        target={targetId}
        trigger="click"
        toggle={() => false}
        className="todo--plan-popover"
    >
        <Button
            onClick={onCancel}
            color="link"
            className="todo--plan-popover--cancel-button"
        >
            x
        </Button>
        <PopoverHeader>Plan todo</PopoverHeader>
        <PopoverBody>{children}</PopoverBody>
    </Popover>
);

export default PlanPopover;
