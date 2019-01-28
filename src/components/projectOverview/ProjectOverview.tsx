import React from 'react';
import { ProjectCollection } from '../../model/project';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import CreateProject from './../createProject/CreateProject';
import Project from './../project/Project';
import { Row, Col } from 'reactstrap';
import './ProjectOverview.scss';
import {
    bindKeyboardShortcut,
    KeyboardShortcuts,
    unbindKeyboardShortcut,
} from '../../navigation/KeyboardShortcuts';
import { createSetCurrentProjectIndexAction } from '../../storage/actions/factory/currentProjectIndexActionFactories';
import {
    determineNextIndex,
    determinePrevousIndex,
} from '../../utility/arrayIndexNavigationHelper';
import { RootAction } from '../../storage/actions/rootAction';

type OwnProps = {};

type ReduxSuppliedProps = {
    projects: ProjectCollection;
    currentProjectIndex: number | null;
};

type CombinedProps = OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>;

class ProjectOverview extends React.Component<CombinedProps> {
    public componentDidMount() {
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private bindKeyboardShortcuts() {
        bindKeyboardShortcut(
            KeyboardShortcuts.NEXT_PROJECT,
            this.onNextProjectKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.PREVIOUS_PROJECT,
            this.onPreviousProjectKeyboardShortcutPressed
        );
    }

    private onNextProjectKeyboardShortcutPressed = () => {
        const { currentProjectIndex, dispatch, projects } = this.props;

        if (projects.length === 0) {
            return;
        }

        const newProjectIndex =
            currentProjectIndex === null
                ? 0
                : determineNextIndex(currentProjectIndex, projects.length);

        dispatch(createSetCurrentProjectIndexAction(newProjectIndex));
    };

    private onPreviousProjectKeyboardShortcutPressed = () => {
        const { currentProjectIndex, dispatch, projects } = this.props;

        if (projects.length === 0) {
            return;
        }

        const newProjectIndex =
            currentProjectIndex === null
                ? projects.length - 1
                : determinePrevousIndex(currentProjectIndex, projects.length);

        dispatch(createSetCurrentProjectIndexAction(newProjectIndex));
    };

    private unbindKeyboardShortcuts() {
        unbindKeyboardShortcut(KeyboardShortcuts.NEXT_PROJECT);
        unbindKeyboardShortcut(KeyboardShortcuts.PREVIOUS_PROJECT);
    }

    public render() {
        const { projects, currentProjectIndex } = this.props;

        return (
            <div className="project-overview">
                <Row>
                    {projects.map((project, index) => (
                        <Col md={3} key={project.id}>
                            <Project
                                index={index}
                                project={project}
                                isCurrent={index === currentProjectIndex}
                            />
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
    const projects = globalState.projects || [];
    const currentProjectIndex =
        projects.length > 0 &&
        globalState.currentProjectIndex !== undefined &&
        globalState.currentProjectIndex !== null
            ? globalState.currentProjectIndex
            : null;

    return { projects, currentProjectIndex };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    ProjectOverview
);
