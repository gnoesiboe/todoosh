import React from 'react';

type Props = {
    abbrevation: string;
};

const TodoProjectPrefix = ({ abbrevation }: Props) => (
    <span>
        <strong>{abbrevation}</strong> |&nbsp;
    </span>
);

export default TodoProjectPrefix;
