import React from 'react';
import { Button } from 'reactstrap';

type Props = {
    onClick: () => void;
};

const ProjectEditActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick}>
        edit
    </Button>
);

export default ProjectEditActionButton;
