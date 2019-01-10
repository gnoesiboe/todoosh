import React from 'react';
import uuid from 'uuid/v4';
import {
    Droppable,
    Draggable,
    DraggableProvided,
    DroppableProvided,
} from 'react-beautiful-dnd';
import { formatDate } from '../../../utility/dateTimeHelper';

type Props = {
    children: JSX.Element[];
    date: Date;
};

const TodoOverview = ({ children, date }: Props) => (
    <Droppable droppableId={formatDate(date)}>
        {(droppableProvided: DroppableProvided) => (
            <ul className="list-unstyled" ref={droppableProvided.innerRef}>
                {React.Children.map(children, (child, index) => {
                    const key = child.key ? child.key.toString() : uuid();

                    return (
                        <Draggable key={key} draggableId={key} index={index}>
                            {(draggableProvided: DraggableProvided) => (
                                <li
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                >
                                    {child}
                                </li>
                            )}
                        </Draggable>
                    );
                })}
                {droppableProvided.placeholder}
            </ul>
        )}
    </Droppable>
);

export default TodoOverview;
