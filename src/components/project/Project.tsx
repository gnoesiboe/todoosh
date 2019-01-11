import React from 'react';
import { Project as ProjectModel } from './../../model/project';
import { Card, CardTitle, CardBody } from 'reactstrap';
import './Project.scss';
import TodoOverview from '../calendarOverview/components/TodoOverview';
import { Todo as TodoModel } from '../../model/todo';
import Todo from '../todo/Todo';
import QuickCreateTodo from './../quickCreateTodo/QuickCreateTodo';
import { connect } from 'react-redux';
import { GlobalState } from '../../storage/reducers';

type Props = {
    project: ProjectModel;
};

type ReduxSuppliedProps = {
    todos: TodoModel[];
};

type CombinedProps = Props & ReduxSuppliedProps;

class Project extends React.Component<CombinedProps> {
    public render() {
        const { project, todos } = this.props;

        return (
            <div className="project">
                <Card>
                    <CardBody>
                        <CardTitle>
                            {project.title} ({project.abbrevation})
                        </CardTitle>
                        <QuickCreateTodo project={project} />
                        <TodoOverview droppableId={project.id}>
                            {todos.map(todo => (
                                <Todo
                                    project={project}
                                    key={todo.id}
                                    isEditMode={false}
                                    onEditCancel={() => {
                                        console.log('on edit cancel');
                                    }}
                                    todo={todo}
                                    isCurrent={false}
                                    onCompletedChange={complete => {
                                        console.log(
                                            'on complete change',
                                            complete
                                        );
                                    }}
                                />
                            ))}
                        </TodoOverview>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: Props
): ReduxSuppliedProps {
    const { project } = props;

    const allTodos = globalState.todos || {};
    const projectTodos = allTodos[project.id] || [];

    return { todos: projectTodos };
}

export default connect<ReduxSuppliedProps, {}, Props>(mapGlobalStateToProps)(
    Project
);
