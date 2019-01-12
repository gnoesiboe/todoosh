import React from 'react';
import { Project as ProjectModel } from './../../model/project';
import './Project.scss';
import TodoOverview from '../calendarOverview/components/TodoOverview';
import { Todo as TodoModel } from '../../model/todo';
import Todo from '../todo/Todo';
import QuickCreateTodo from './../quickCreateTodo/QuickCreateTodo';
import { connect } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import createClassName from 'classnames';

type Props = {
    project: ProjectModel;
    isCurrent: boolean;
};

type ReduxSuppliedProps = {
    todos: TodoModel[];
};

type CombinedProps = Props & ReduxSuppliedProps;

class Project extends React.Component<CombinedProps> {
    public render() {
        const { project, todos, isCurrent } = this.props;

        const className = createClassName('project', {
            project__current: isCurrent,
        });

        return (
            <div className={className}>
                <h3 className="project--title">
                    {project.abbrevation} | {project.title}
                </h3>
                <QuickCreateTodo project={project} />
                <TodoOverview droppableId={project.id}>
                    {todos.map(todo => (
                        <Todo
                            onEditClick={() =>
                                console.log('@todo on todo click')
                            }
                            showProject={false}
                            project={project}
                            key={todo.id}
                            isEditMode={false}
                            onEditCancel={() => {
                                console.log('on edit cancel');
                            }}
                            todo={todo}
                            isCurrent={false}
                            onCompletedChange={complete => {
                                console.log('on complete change', complete);
                            }}
                        />
                    ))}
                </TodoOverview>
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
