import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoCompletedChangeCallback,
} from './components/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';
import {
    formatDate,
    parseDate,
    createDateRelativeToSupplied,
    checkIsSameDay,
    fomatDateToday,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';
import {
    createToggleTodoCompletedAction,
    createDeleteTodoAction,
    createMoveTodoAction,
} from '../../storage/actions/factory/todoActionFactories';
import mousetrap from 'mousetrap';
import { createTodosPath } from '../../routing/urlGenerator';
import { createSetCurrentTodoIndexAction } from '../../storage/actions/factory/currentTodoIndexActionFactories';
import {
    determineNextIndex,
    determinePrevousIndex,
} from './../../utility/arrayIndexNavigationHelper';
import DayOverviewTitle from './components/DayOverviewTitle';
import TodoOverview from './components/TodoOverview';
import Todo from '../todo/Todo';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import { Todo as TodoModel } from './../../model/todo';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodoCollection;
    visibleDateRange: Date[];
    currentDate: Date;
    currentTodoIndex: number;
};

type CombinedProps = OwnProps &
    ReduxSuppliedProps &
    DispatchProp<RootAction> &
    RouteComponentProps<{}>;

type State = {
    isEditingTodo: boolean;
};

const NEXT_DATE_SHORCUT = ['right', 'n'];
const PREVIOUS_DATE_SHORTCUT = ['left', 'p'];
const NEXT_TODO_SHORTCUT = ['down', 'j'];
const PREVIOUS_TODO_SHORTCUT = ['up', 'k'];
const TODAY_SHORTCUT = 't';
const TOGGLE_COMPLETED_SHORTCUT = 'space';
const TODO_EDIT_SHORTCUT = ['e', 'enter'];
const TODO_DELETE_SHORTCUT = ['d', 'del', 'backspace'];

class CalendarOverview extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isEditingTodo: false,
        };
    }
    public componentDidMount() {
        this.setCurrentDate(this.props.match.params.startDate);
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private bindKeyboardShortcuts() {
        mousetrap.bind(
            NEXT_DATE_SHORCUT,
            this.onMoveToNextDateKeyboardShortcutPressed
        );
        mousetrap.bind(
            PREVIOUS_DATE_SHORTCUT,
            this.onMoveToPreviousDateKeyboardShortcutPressed
        );
        mousetrap.bind(TODAY_SHORTCUT, this.onTodayKeyboardShortcutPressed);
        mousetrap.bind(
            NEXT_TODO_SHORTCUT,
            this.onMoveToNextTodoKeyboardShortcutPressed
        );
        mousetrap.bind(
            PREVIOUS_TODO_SHORTCUT,
            this.onMoveToPreviousTodoKeyboardShortcutPressed
        );
        mousetrap.bind(
            TOGGLE_COMPLETED_SHORTCUT,
            this.onToggleCompletedKeyboardShortcutPressed
        );
        mousetrap.bind(TODO_EDIT_SHORTCUT, this.onEditKeyboardShortcutPressed);
        mousetrap.bind(
            TODO_DELETE_SHORTCUT,
            this.onTodoDeleteKeyboardShortcutPressed
        );
    }

    private unbindKeyboardShortcuts() {
        mousetrap.unbind(NEXT_DATE_SHORCUT);
        mousetrap.unbind(PREVIOUS_DATE_SHORTCUT);
        mousetrap.unbind(TODAY_SHORTCUT);
        mousetrap.unbind(NEXT_TODO_SHORTCUT);
        mousetrap.unbind(PREVIOUS_TODO_SHORTCUT);
        mousetrap.unbind(TOGGLE_COMPLETED_SHORTCUT);
        mousetrap.unbind(TODO_EDIT_SHORTCUT);
        mousetrap.unbind(TODO_DELETE_SHORTCUT);
    }

    private onTodoDeleteKeyboardShortcutPressed = () => {
        const { todos, currentDate, currentTodoIndex, dispatch } = this.props;

        const currentDayTodos = todos[formatDate(currentDate)];
        const currentTodo = currentDayTodos[currentTodoIndex];

        if (!currentTodo) {
            throw new Error('Could not resolve current todo');
        }

        if (confirm('Are you sure?')) {
            dispatch(
                createDeleteTodoAction(currentTodo.id, formatDate(currentDate))
            );
        }
    };

    private onEditKeyboardShortcutPressed = () => {
        this.startEditingTodo();
    };

    private startEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: true,
        }));
    }

    private stopEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: false,
        }));
    }

    private onEditTodoCancel: OnCancelCallback = () => {
        this.stopEditingTodo();
    };

    private onToggleCompletedKeyboardShortcutPressed = () => {
        const { todos, currentDate, currentTodoIndex } = this.props;

        const currentDayTodos = todos[formatDate(currentDate)];
        const currentTodo = currentDayTodos[currentTodoIndex];

        if (!currentTodo) {
            throw new Error('Could not resolve current todo');
        }

        this.setTodoCompletedStatus(
            currentTodo.id,
            currentDate,
            !currentTodo.isCompleted
        );
    };

    private onMoveToNextDateKeyboardShortcutPressed = () => {
        this.navigateToNextDate();
    };

    private onMoveToPreviousTodoKeyboardShortcutPressed = () => {
        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determinePrevousIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private onMoveToNextTodoKeyboardShortcutPressed = () => {
        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determineNextIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private navigateToNextDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private onMoveToPreviousDateKeyboardShortcutPressed = () => {
        this.navigateToPreviousDate();
    };

    private onTodayKeyboardShortcutPressed = () => {
        const { history } = this.props;

        history.push(createTodosPath(fomatDateToday()));
    };

    private navigateToPreviousDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, -1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private setCurrentDate(date: string) {
        const { dispatch } = this.props;

        dispatch(createSetCurrentDateAction(date));
    }

    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToPreviousDate();
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToNextDate();
    };

    private onTodoCompletedChange: OnTodoCompletedChangeCallback = (
        todo,
        date,
        completed
    ) => {
        this.setTodoCompletedStatus(todo.id, date, completed);
    };

    private setTodoCompletedStatus(
        todoId: string,
        date: Date,
        completed: boolean
    ) {
        const action = createToggleTodoCompletedAction(
            todoId,
            formatDate(date),
            completed
        );

        this.props.dispatch(action);
    }

    private onTodoDragEnd = (result: DropResult) => {
        const { dispatch } = this.props;

        const destination = result.destination;

        if (!destination) {
            return;
        }

        const action = createMoveTodoAction(
            result.source.droppableId,
            destination.droppableId,
            result.source.index,
            destination.index
        );

        dispatch(action);
    };

    private renderTodo(todo: TodoModel, isCurrent: boolean, date: Date) {
        const isEditMode = isCurrent && this.state.isEditingTodo;

        return (
            <Todo
                key={todo.id}
                isEditMode={isEditMode}
                onEditCancel={this.onEditTodoCancel}
                todo={todo}
                date={date}
                isCurrent={isCurrent}
                onCompletedChange={complete =>
                    this.onTodoCompletedChange(todo, date, complete)
                }
            />
        );
    }

    private renderDayOverview(date: Date, isCurrentDate: boolean) {
        const { todos, currentDate, currentTodoIndex } = this.props;

        const dateAsString = formatDate(date);
        const todosForDate = todos[dateAsString];

        return (
            <DayOverview isCurrent={isCurrentDate}>
                <DayOverviewTitle date={date} />
                {isCurrentDate ? <CreateTodo date={currentDate} /> : undefined}
                <TodoOverview date={date}>
                    {todosForDate.map((todo, index) => {
                        const isCurrent =
                            isCurrentDate && index === currentTodoIndex;

                        return this.renderTodo(todo, isCurrent, date);
                    })}
                </TodoOverview>
            </DayOverview>
        );
    }

    public render() {
        const { currentDate, todos } = this.props;

        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onBackClick}
                    />
                </Col>
                <DragDropContext onDragEnd={this.onTodoDragEnd}>
                    {Object.keys(todos).map(dateAsString => {
                        const date = parseDate(dateAsString);
                        const isCurrentDate = checkIsSameDay(date, currentDate);

                        return (
                            <Col md={isCurrentDate ? 4 : 2} key={dateAsString}>
                                {this.renderDayOverview(date, isCurrentDate)}
                            </Col>
                        );
                    })}
                </DragDropContext>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Forward}
                        onClick={this.onForwardClick}
                    />
                </Col>
            </Row>
        );
    }
}

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: OwnProps
): ReduxSuppliedProps {
    const currentDate = parseDate(props.match.params.startDate);
    const visibleDateRange = createVisibleDateRangeFromRouterDate(currentDate);
    const todos: TodoCollection = applyOnlyRelevantTodosSelector(
        globalState.todos || null,
        visibleDateRange
    );
    const currentTodoIndex = globalState.currentTodoIndex || 0;

    return { todos, visibleDateRange, currentDate, currentTodoIndex };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    withRouter<OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>>(
        CalendarOverview
    )
);
