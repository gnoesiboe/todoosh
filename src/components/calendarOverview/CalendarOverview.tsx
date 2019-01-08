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
import './CalendarOverview.scss';

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

export const NEXT_DATE_SHORCUT = ['right', 'n'];
export const PREVIOUS_DATE_SHORTCUT = ['left', 'p'];
export const NEXT_TODO_SHORTCUT = ['down', 'j'];
export const PREVIOUS_TODO_SHORTCUT = ['up', 'k'];
export const TODAY_SHORTCUT = 't';
export const TOGGLE_COMPLETED_SHORTCUT = 'space';
export const TODO_EDIT_SHORTCUT = ['e', 'enter'];
export const TODO_DELETE_SHORTCUT = ['d', 'del', 'backspace'];

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
            return;
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
            return;
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
        this.navigateToToday();
    };

    private onTodayClick = () => {
        this.navigateToToday();
    };

    private navigateToToday() {
        const { history } = this.props;

        history.push(createTodosPath(fomatDateToday()));
    }

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

        dispatch(
            createMoveTodoAction(
                result.source.droppableId,
                destination.droppableId,
                result.source.index,
                destination.index
            )
        );

        dispatch(createSetCurrentDateAction(destination.droppableId));
        dispatch(createSetCurrentTodoIndexAction(destination.index));
    };

    private onDayOverviewTitleClick(date: string) {
        const { history } = this.props;

        history.push(createTodosPath(date));
    }

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
                <DayOverviewTitle
                    date={date}
                    onClick={() => this.onDayOverviewTitleClick(dateAsString)}
                />
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
            <div className="calendar-overview">
                <div className="calendar-overview--navigation">
                    <Row>
                        <Col md={{ size: 1, offset: 4 }} className="text-right">
                            <TimeNavigationButton
                                direction={Direction.Back}
                                onClick={this.onBackClick}
                            />
                        </Col>
                        <Col md={2} className="text-center">
                            <button
                                className="btn btn-link"
                                onClick={this.onTodayClick}
                            >
                                today
                            </button>
                        </Col>
                        <Col md={1} className="text-left">
                            <TimeNavigationButton
                                direction={Direction.Forward}
                                onClick={this.onForwardClick}
                            />
                        </Col>
                    </Row>
                </div>
                <Row>
                    <DragDropContext onDragEnd={this.onTodoDragEnd}>
                        {Object.keys(todos).map(dateAsString => {
                            const date = parseDate(dateAsString);
                            const isCurrentDate = checkIsSameDay(
                                date,
                                currentDate
                            );

                            return (
                                <Col md={3} key={dateAsString}>
                                    {this.renderDayOverview(
                                        date,
                                        isCurrentDate
                                    )}
                                </Col>
                            );
                        })}
                    </DragDropContext>
                </Row>
            </div>
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
