import React from 'react';
import { Button } from 'reactstrap';
import editIcon from './../../../icons/edit.svg';

export type OnTodoEditClickCallback = (
    event: React.MouseEvent<HTMLButtonElement>
) => void;

type Props = {
    onClick: OnTodoEditClickCallback;
};

const TodoEditActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick}>
        <img src={editIcon} />
    </Button>
);

export default TodoEditActionButton;
