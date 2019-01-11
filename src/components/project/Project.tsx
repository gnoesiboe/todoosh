import React from 'react';
import { Project as ProjectModel } from './../../model/project';
import { Card, CardTitle, CardBody } from 'reactstrap';
import './Project.scss';
import TodoOverview from '../calendarOverview/components/TodoOverview';
import { Todo as TodoModel } from '../../model/todo';
import Todo from '../todo/Todo';

type Props = {
    project: ProjectModel;
};

export default class Project extends React.Component<Props> {
    public render() {
        const { project } = this.props;
        const todos: TodoModel[] = [];

        return (
            <div className="project">
                <Card>
                    <CardBody>
                        <CardTitle>
                            {project.title} ({project.abbrevation})
                        </CardTitle>
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
