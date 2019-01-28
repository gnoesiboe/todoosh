import React from 'react';
import { Button } from 'reactstrap';
import deleteIcon from './../../../icons/delete.svg';

type Props = {
    onClick: () => void;
};

const ProjectDeleteActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick} className="project--action">
        <img src={deleteIcon} />
    </Button>
);

export default ProjectDeleteActionButton;
