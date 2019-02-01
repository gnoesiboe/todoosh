import React from 'react';
import { Button } from 'reactstrap';

export type OnTodoEditClickCallback = (
    event: React.MouseEvent<HTMLButtonElement>
) => void;

type Props = {
    onClick: OnTodoEditClickCallback;
};

const TodoEditActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick}>
        edit
    </Button>
);

export default TodoEditActionButton;
