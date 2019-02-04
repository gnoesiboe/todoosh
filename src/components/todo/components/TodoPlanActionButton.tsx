import React from 'react';
import { Button } from 'reactstrap';

export type OnTodoPlanClickCallback = (
    event: React.MouseEvent<HTMLButtonElement>
) => void;

type Props = {
    onClick: OnTodoPlanClickCallback;
};

const TodoPlanActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick}>
        plan
    </Button>
);

export default TodoPlanActionButton;
