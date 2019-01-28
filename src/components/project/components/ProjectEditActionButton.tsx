import React from 'react';
import { Button } from 'reactstrap';
import editIcon from './../../../icons/edit.svg';

type Props = {
    onClick: () => void;
};

const ProjectEditActionButton = ({ onClick }: Props) => (
    <Button color="link" onClick={onClick} className="project--action">
        <img src={editIcon} />
    </Button>
);

export default ProjectEditActionButton;
