import React from 'react';
import { TodoCollection } from '../../model/todo';
import uuid from 'uuid/v4';
import Todo, { OnChangeCallback } from '../todo/Todo';
import TodoOverview from './components/TodoOverview';

const dummyTodoCollection: TodoCollection = [0, 1, 2, 3, 4].map(() => {
    return {
        id: uuid(),
        title: 'Some todo title',
        isChecked: true,
    };
});

export default class DayOverview extends React.Component {
    private onTodoChange: OnChangeCallback = (field, newValue) => {
        console.log('on change', field, newValue);
    };

    public render() {
        return (
            <div>
                <h3>Today</h3>
                <TodoOverview>
                    {dummyTodoCollection.map(todo => (
                        <Todo
                            key={todo.id}
                            todo={todo}
                            onChange={this.onTodoChange}
                        />
                    ))}
                </TodoOverview>
            </div>
        );
    }
}
