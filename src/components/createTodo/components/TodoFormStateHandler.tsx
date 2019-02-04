import React from 'react';
import { Formik, FormikProps, FormikActions, FormikErrors } from 'formik';
import TodoForm, {
    OnCancelCallback,
    DeadlineSelectOptionType,
    ProjectSelectOptionType,
} from './TodoForm';
import { Todo } from '../../../model/todo';
import {
    parseDate,
    formatDistanceFromToday,
} from '../../../utility/dateTimeHelper';
import { ProjectCollection } from '../../../model/project';

export type TodoFormValues = {
    title: string;
    projectId: ProjectSelectOptionType | undefined;
    deadline: DeadlineSelectOptionType | undefined;
};

export type OnSubmitCallback = (values: TodoFormValues) => void;

type Props = {
    todo?: Todo;
    projects: ProjectCollection;
    onFormSubmittedAndValid: OnSubmitCallback;
    onCancel: OnCancelCallback;
};

export default class TodoFormStateHandler extends React.Component<Props> {
    private static validateValues(
        values: TodoFormValues
    ): FormikErrors<TodoFormValues> {
        const errors: { [key: string]: string } = {};

        if (!values.title) {
            errors.title = 'Required';
        }

        if (!values.projectId) {
            errors.projectId = 'Required';
        }

        return errors;
    }

    private resolveCurrentProjectOption(
        todoId: string
    ): ProjectSelectOptionType | undefined {
        const selectedProject = this.props.projects.find(project =>
            project.todos.includes(todoId)
        );

        if (!selectedProject) {
            return undefined;
        }

        return {
            label: selectedProject.title,
            value: selectedProject.id,
        };
    }

    private resolveCurrentDeadlineOption(
        deadline: string
    ): DeadlineSelectOptionType {
        const deadlineAsDate = parseDate(deadline);

        return {
            label: formatDistanceFromToday(deadlineAsDate),
            value: deadlineAsDate,
        };
    }

    private determineInitialValues(todo?: Todo): TodoFormValues {
        return {
            title: todo ? todo.title : '',
            projectId: todo
                ? this.resolveCurrentProjectOption(todo.id)
                : undefined,
            deadline:
                todo && todo.deadline
                    ? this.resolveCurrentDeadlineOption(todo.deadline)
                    : undefined,
        };
    }

    public render() {
        const {
            todo,
            onFormSubmittedAndValid,
            onCancel,
            projects,
        } = this.props;

        const initialValues = this.determineInitialValues(todo);

        return (
            <Formik
                initialValues={initialValues}
                validate={TodoFormStateHandler.validateValues}
                onSubmit={(values, actions: FormikActions<TodoFormValues>) => {
                    actions.resetForm();

                    onFormSubmittedAndValid(values);
                }}
            >
                {(childProps: FormikProps<TodoFormValues>) => (
                    <TodoForm
                        {...childProps}
                        projects={projects}
                        onCancel={onCancel}
                    />
                )}
            </Formik>
        );
    }
}
