import React from 'react';
import uuid from 'uuid/v4';
import {
    Droppable,
    Draggable,
    DraggableProvided,
    DroppableProvided,
} from 'react-beautiful-dnd';

type Props = {
    children: JSX.Element[];
    droppableId: string;
};

const TodoOverview = ({ children, droppableId }: Props) => (
    <Droppable droppableId={droppableId}>
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
