import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, FormGroup, FormFeedback, Label } from 'reactstrap';
import Select from 'react-select';
import { createDeadlineOptions } from './../utility/deadlineOptionsFactory';
import './TodoForm.scss';
import { ProjectCollection } from '../../../model/project';
import TextareaAutosize from 'react-autosize-textarea';

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

const deadlineOptions = createDeadlineOptions();

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
}) => {
    return (
        <Form onSubmit={handleSubmit} className="todo-form">
            <FormGroup>
                <Label for="title">Title</Label>
                <TextareaAutosize
                    className="form-control"
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Get some more milk.."
                    onChange={handleChange}
                    onKeyDown={(event: React.KeyboardEvent) => {
                        if (event.key === 'Escape') {
                            onCancel();
                        }

                        return true;
                    }}
                    onBlur={handleBlur}
                    value={values.title}
                    autoFocus
                />
                {errors.title && touched.title && (
                    <FormFeedback tooltip>{errors.title}</FormFeedback>
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
                    placeholder="Project"
                    name="project"
                />
                {errors.projectId && touched.projectId && (
                    <FormFeedback tooltip>{errors.projectId}</FormFeedback>
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
                    placeholder="Deadline"
                    name="deadline"
                />
                {errors.deadline && touched.deadline && (
                    <FormFeedback tooltip>{errors.deadline}</FormFeedback>
                )}
            </FormGroup>
            <button type="submit" className="btn btn-primary">
                Save
            </button>
            <button type="button" className="btn btn-link" onClick={onCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default TodoForm;
