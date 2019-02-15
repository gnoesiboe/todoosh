import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { createDateSelectOptions } from './../utility/deadlineOptionsFactory';
import './TodoForm.scss';
import { ProjectCollection } from '../../../model/project';
import TextareaAutosize from 'react-autosize-textarea';
import InvalidFormFeedback from '../../forms/components/InvalidFormFeedback';
import createClassName from 'classnames';

export type OnCancelCallback = () => void;

type Props = {
    onCancel: OnCancelCallback;
    projects: ProjectCollection;
};

export type DeadlineSelectOptionType = {
    label: string;
    value: Date;
} | null;

export type ProjectSelectOptionType = {
    label: string;
    value: string;
};

const deadlineOptions = createDateSelectOptions();

const TodoForm: React.FunctionComponent<
    Props & FormikProps<TodoFormValues>
> = ({
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    onCancel,
    setFieldValue,
    projects,
    isValid: formIsValid,
    submitForm,
}) => {
    const hasErrors = {
        title: touched.title && !!errors.title,
        projectId: touched.projectId && !!errors.projectId,
        deadline: touched.deadline && !!errors.deadline,
    };

    const isValid = {
        title: touched.title && !errors.title,
        projectId: touched.projectId && !errors.projectId,
        deadline: touched.deadline && !errors.deadline,
    };

    const classNames = {
        title: createClassName('form-control', {
            'is-valid': isValid.title,
            'is-invalid': hasErrors.title,
        }),
        projectId: createClassName(
            'form-control',
            'form-control__alternative-padding',
            {
                'is-valid': isValid.projectId,
                'is-invalid': hasErrors.projectId,
            }
        ),
        deadline: createClassName(
            'form-control',
            'form-control__alternative-padding',
            {
                'is-valid': isValid.deadline,
                'is-invalid': hasErrors.deadline,
            }
        ),
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            submitForm();
        }

        if (event.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="todo-form">
            <FormGroup>
                <Label for="title">Title</Label>
                <TextareaAutosize
                    className={classNames.title}
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Get some more milk.."
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    onBlur={handleBlur}
                    value={values.title}
                    autoFocus
                />
                {hasErrors.title && (
                    <InvalidFormFeedback>{errors.title}</InvalidFormFeedback>
                )}
            </FormGroup>
            <FormGroup>
                <Label for="projectId">Project</Label>
                <Select<ProjectSelectOptionType>
                    options={projects.map(project => ({
                        label: `${project.title} (${project.abbrevation})`,
                        value: project.id,
                    }))}
                    value={values.projectId}
                    onChange={newValue => {
                        setFieldValue('projectId', newValue);
                        handleChange('projectId');
                    }}
                    inputId="projectId"
                    onBlur={handleBlur}
                    onKeyDown={onKeyDown}
                    placeholder="Project"
                    name="project"
                    className={classNames.projectId}
                />
                {hasErrors.projectId && (
                    <InvalidFormFeedback>
                        {errors.projectId}
                    </InvalidFormFeedback>
                )}
            </FormGroup>
            <FormGroup>
                <Label for="deadline">Deadline</Label>
                <Select<DeadlineSelectOptionType>
                    options={deadlineOptions}
                    value={values.deadline}
                    onChange={newValue => {
                        setFieldValue('deadline', newValue);
                        handleChange('deadline');
                    }}
                    inputId="deadline"
                    onBlur={handleBlur}
                    onKeyDown={onKeyDown}
                    placeholder="Deadline"
                    name="deadline"
                    className={classNames.deadline}
                />
                {hasErrors.deadline && (
                    <InvalidFormFeedback>{errors.deadline}</InvalidFormFeedback>
                )}
            </FormGroup>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={!formIsValid}
            >
                Save
            </button>
            <button type="button" className="btn btn-link" onClick={onCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default TodoForm;
