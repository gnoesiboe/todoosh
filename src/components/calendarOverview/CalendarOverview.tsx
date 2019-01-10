import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoCompletedChangeCallback,
} from './components/DayOverview';
import { OnClickCallback } from './components/TimeNavigationButton';
import {
    formatDate,
    parseDate,
    createDateRelativeToSupplied,
    checkIsSameDay,
    checkDateIsInThePast,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps, withRouter, Redirect } from 'react-router';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';
import {
    createToggleTodoCompletedAction,
    createDeleteTodoAction,
    createMoveTodoAction,
    createMoveUnfinishedTodosInThePastToTodayAndRemoveCompletedAction,
} from '../../storage/actions/factory/todoActionFactories';
import { createTodosPath, createHomePath } from '../../routing/urlGenerator';
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
import DateNavigator from './components/DateNavigator';
import {
    KeyboardShortcuts,
    bindKeyboardShortcut,
    unbindKeyboardShortcut,
} from './../../navigation/KeyboardShortcuts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

class CalendarOverview extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isEditingTodo: false,
        };
    }
    public componentDidMount() {
        this.redirectToTodayIfCurrentDateIsInThePast();
        this.ensureAllCompletedTodosInThePastAreEitherMovedOrRemoved();
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private redirectToTodayIfCurrentDateIsInThePast() {
        const currentDate = this.props.currentDate;

        if (checkDateIsInThePast(currentDate)) {
            this.navigateToToday();
        }
    }

    private navigateToDate(nextDate: Date) {
        const { history } = this.props;
        const dateAsString = formatDate(nextDate);

        history.push(createTodosPath(dateAsString));
    }

    private navigateToToday() {
        const today = new Date();

        this.navigateToDate(today);
    }

    private ensureAllCompletedTodosInThePastAreEitherMovedOrRemoved() {
        this.props.dispatch(
            createMoveUnfinishedTodosInThePastToTodayAndRemoveCompletedAction()
        );
    }

    private bindKeyboardShortcuts() {
        bindKeyboardShortcut(
            KeyboardShortcuts.NEXT_DATE_SHORCUT,
            this.onMoveToNextDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.PREVIOUS_DATE_SHORTCUT,
            this.onMoveToPreviousDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODAY_SHORTCUT,
            this.onTodayKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.NEXT_TODO_SHORTCUT,
            this.onMoveToNextTodoKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.PREVIOUS_TODO_SHORTCUT,
            this.onMoveToPreviousTodoKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TOGGLE_COMPLETED_SHORTCUT,
            this.onToggleCompletedKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODO_EDIT_SHORTCUT,
            this.onEditKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODO_DELETE_SHORTCUT,
            this.onTodoDeleteKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_DOWN,
            this.onMoveTodoDownKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_UP,
            this.onMoveTodoUpKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_TO_NEXT_DATE,
            this.onMoveTodoToNextDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_TO_PREVIOUS_DATE,
            this.onMoveTodoToPreviousDateKeyboardShortcutPressed
        );
    }

    private unbindKeyboardShortcuts() {
        unbindKeyboardShortcut(KeyboardShortcuts.NEXT_DATE_SHORCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.PREVIOUS_DATE_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODAY_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.NEXT_TODO_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.PREVIOUS_TODO_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TOGGLE_COMPLETED_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODO_EDIT_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODO_DELETE_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_DOWN);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_UP);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_TO_NEXT_DATE);
    }

    private onTodoDeleteKeyboardShortcutPressed = () => {
        const { todos, currentDate, currentTodoIndex, dispatch } = this.props;

        const currentDayTodos = todos[formatDate(currentDate)];
        const currentTodo = currentDayTodos[currentTodoIndex];

        if (!currentTodo) {
            toast.error('There is no current todo to delete');
        }

        if (confirm('Are you sure?')) {
            dispatch(
                createDeleteTodoAction(currentTodo.id, formatDate(currentDate))
            );
        }
    };

    private onEditKeyboardShortcutPressed = (event: ExtendedKeyboardEvent) => {
        // prevent typing the letter 'e' in input
        event.preventDefault();

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

    private onToggleCompletedKeyboardShortcutPressed = (event: Event) => {
        // prevent scrolling down the page
        event.preventDefault();

        if (this.state.isEditingTodo) {
            // when editing and using space to submit form, we don't want to complete the todo

            return;
        }

        const { todos, currentDate, currentTodoIndex } = this.props;

        const currentDayTodos = todos[formatDate(currentDate)];
        const currentTodo = currentDayTodos[currentTodoIndex];

        if (!currentTodo) {
            toast.error(
                'There is no current todo to toggle the completed status of'
            );

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

    private onMoveToPreviousTodoKeyboardShortcutPressed = (event: Event) => {
        // prevent page scrolling up
        event.preventDefault();

        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determinePrevousIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private onMoveToNextTodoKeyboardShortcutPressed = (event: Event) => {
        // prevent page scrolling down
        event.preventDefault();

        const { dispatch, currentTodoIndex, todos, currentDate } = this.props;

        const arrayLength = todos[formatDate(currentDate)].length;
        const nextIndex = determineNextIndex(currentTodoIndex, arrayLength);

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
    };

    private navigateToNextDate() {
        const { currentDate } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);

        this.navigateToDate(nextDate);
    }

    private onMoveToPreviousDateKeyboardShortcutPressed = () => {
        if (!this.checkPreviousDateIsAccessible()) {
            toast.error('Cannot move before today');

            return;
        }

        this.navigateToPreviousDate();
    };

    private onTodayKeyboardShortcutPressed = () => {
        this.navigateToToday();
    };

    private onTodayClick = () => {
        this.navigateToToday();
    };

    private navigateToPreviousDate() {
        const { currentDate } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, -1);

        this.navigateToDate(nextDate);
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

        const oldDate = result.source.droppableId;
        const newDate = destination.droppableId;

        const oldIndex = result.source.index;
        const newIndex = destination.index;

        dispatch(createMoveTodoAction(oldDate, newDate, oldIndex, newIndex));

        const newCurrentTodoIndex = oldDate === newDate ? newIndex : 0;

        dispatch(createSetCurrentTodoIndexAction(newCurrentTodoIndex));
    };

    private onMoveTodoDownKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + down is also used for moving down the page in Google Chrome, prevent default behaviour
        event.preventDefault();
        const { currentTodoIndex, todos, dispatch, currentDate } = this.props;
        const currentDateAsString = formatDate(currentDate);

        const noOfTodosForCurrentDate =
            typeof todos[currentDateAsString] !== 'undefined'
                ? todos[currentDateAsString].length
                : 0;
        const nextTodoIndex = determineNextIndex(
            currentTodoIndex,
            noOfTodosForCurrentDate
        );

        dispatch(
            createMoveTodoAction(
                currentDateAsString,
                currentDateAsString,
                currentTodoIndex,
                nextTodoIndex
            )
        );

        dispatch(createSetCurrentTodoIndexAction(nextTodoIndex));
    };

    private onMoveTodoUpKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + up is also used for moving up the page in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { currentDate, currentTodoIndex, todos, dispatch } = this.props;
        const currentDateAsString = formatDate(currentDate);

        const noOfTodosForCurrentDate =
            typeof todos[currentDateAsString] !== 'undefined'
                ? todos[currentDateAsString].length
                : 0;
        const nextTodoIndex = determinePrevousIndex(
            currentTodoIndex,
            noOfTodosForCurrentDate
        );

        dispatch(
            createMoveTodoAction(
                currentDateAsString,
                currentDateAsString,
                currentTodoIndex,
                nextTodoIndex
            )
        );

        dispatch(createSetCurrentTodoIndexAction(nextTodoIndex));
    };

    private onMoveTodoToNextDateKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + right is also used for navigation in history, in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { dispatch, currentDate, currentTodoIndex } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);
        const nextIndex = 0;

        dispatch(
            createMoveTodoAction(
                formatDate(currentDate),
                formatDate(nextDate),
                currentTodoIndex,
                nextIndex
            )
        );

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
        this.navigateToDate(nextDate);
    };

    private onMoveTodoToPreviousDateKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + left is also used for navigation in history, in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { dispatch, currentDate, currentTodoIndex, todos } = this.props;

        const currentDateAsString = formatDate(currentDate);
        const previousDate = createDateRelativeToSupplied(currentDate, -1);

        if (checkDateIsInThePast(previousDate)) {
            toast.error('Cannot move a todo to the past');

            return;
        }

        const previousDateAsString = formatDate(previousDate);
        const nextIndex = 0;

        if (
            typeof todos[currentDateAsString] === 'undefined' ||
            typeof todos[currentDateAsString][currentTodoIndex] === 'undefined'
        ) {
            toast.error('No todo was selected to move to the previous date');

            return;
        }

        dispatch(
            createMoveTodoAction(
                formatDate(currentDate),
                previousDateAsString,
                currentTodoIndex,
                nextIndex
            )
        );

        dispatch(createSetCurrentTodoIndexAction(nextIndex));
        this.navigateToDate(previousDate);
    };

    private onDayOverviewTitleClick(date: string) {
        this.navigateToDate(parseDate(date));
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

    private checkPreviousDateIsAccessible(): boolean {
        const startDate = this.props.currentDate;
        const nextDate = createDateRelativeToSupplied(startDate, -1);

        return !checkDateIsInThePast(nextDate);
    }

    public render() {
        const { currentDate, todos } = this.props;

        if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
            return <Redirect to={createHomePath()} />;
        }

        return (
            <div className="calendar-overview">
                <div className="calendar-overview--navigation">
                    <Row>
                        <DateNavigator
                            currentDate={currentDate}
                            onBackClick={this.onBackClick}
                            onForwardClick={this.onForwardClick}
                            onTodayClick={this.onTodayClick}
                        />
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
                                <Col md={4} key={dateAsString}>
                                    {this.renderDayOverview(
                                        date,
                                        isCurrentDate
                                    )}
                                </Col>
                            );
                        })}
                    </DragDropContext>
                </Row>
                <ToastContainer />
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
        globalState.todos || {},
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
