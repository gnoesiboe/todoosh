import React from 'react';
import { Button } from 'reactstrap';

export type OnTodoPlanClickCallback = (
    event: React.MouseEvent<HTMLButtonElement>
) => void;

type Props = {
    onClick: OnTodoPlanClickCallback;
    targetId: string;
};

const TodoPlanActionButton = ({ onClick, targetId }: Props) => (
    <Button color="link" onClick={onClick} id={targetId}>
        plan
    </Button>
);

export default TodoPlanActionButton;
