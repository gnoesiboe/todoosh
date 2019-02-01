import React from 'react';
import { Button } from 'reactstrap';

type Props = {
    onClick: () => void;
};

const ProjectDeleteActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick} className="project--action">
        delete
    </Button>
);

export default ProjectDeleteActionButton;
