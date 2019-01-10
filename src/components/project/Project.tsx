import React from 'react';
import { Project as ProjectModel } from './../../model/project';
import { Card, CardTitle, CardBody } from 'reactstrap';

type Props = {
    project: ProjectModel;
};

export default class Project extends React.Component<Props> {
    public render() {
        const { project } = this.props;

        return (
            <div className="project">
                <Card>
                    <CardBody>
                        <CardTitle>
                            {project.title} ({project.abbrevation})
                        </CardTitle>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
