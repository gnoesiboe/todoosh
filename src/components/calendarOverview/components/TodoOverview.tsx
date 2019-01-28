import React from 'react';
import uuid from 'uuid/v4';
import {
    Droppable,
    Draggable,
    DraggableProvided,
    DroppableProvided,
} from 'react-beautiful-dnd';
import { TodoSection } from '../../../model/TodoSection';

type Props = {
    children: JSX.Element[];
    droppableId: string;
    section: TodoSection;
};

const TodoOverview = ({ children, droppableId, section }: Props) => (
    <Droppable droppableId={droppableId}>
        {(droppableProvided: DroppableProvided) => (
            <ul className="list-unstyled" ref={droppableProvided.innerRef}>
                {React.Children.map(children, (child, index) => {
                    // inlclude section in key as todo will be present in both sections, and keys would
                    // be the same, causing both to drag and drop.
                    const key = `${section}__${
                        child.key ? child.key.toString() : uuid()
                    }`;

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
