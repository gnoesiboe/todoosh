import React from 'react';
import { ProjectCollection } from '../../model/project';
import { connect } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import CreateProject from './../createProject/CreateProject';
import Project from './../project/Project';
import { Row, Col } from 'reactstrap';

type OwnProps = {};

type ReduxSuppliedProps = {
    projects: ProjectCollection;
};

class ProjectOverview extends React.Component<OwnProps & ReduxSuppliedProps> {
    public render() {
        const { projects } = this.props;
        return (
            <div className="project-overview">
                <Row>
                    {projects.map(project => (
                        <Col md={3}>
                            <Project key={project.id} project={project} />
                        </Col>
                    ))}
                    <Col md={3}>
                        <CreateProject />
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapGlobalStateToProps(globalState: GlobalState): ReduxSuppliedProps {
    return {
        projects: globalState.projects || [],
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    ProjectOverview
);
