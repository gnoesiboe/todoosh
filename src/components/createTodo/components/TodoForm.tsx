import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, Input, FormGroup, FormFeedback, Label } from 'reactstrap';
import Select from 'react-select';
import { createDeadlineOptions } from './../utility/deadlineOptionsFactory';
import './TodoForm.scss';

export type OnCancelCallback = () => void;

type Props = {
    onCancel: OnCancelCallback;
};

export type DeadlineSelectOptionType = {
    label: string;
    value: Date;
} | null;

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
}) => {
    return (
        <Form onSubmit={handleSubmit} className="todo-form">
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    onChange={handleChange}
                    autoComplete="off"
                    onKeyDown={(event: React.KeyboardEvent) => {
                        if (event.key === 'Escape') {
                            onCancel();
                        }

                        return true;
                    }}
                    onBlur={handleBlur}
                    value={values.title}
                    autoFocus
                    invalid={!!errors.title && touched.title}
                    valid={!errors.title && touched.title}
                />
                {errors.title && touched.title && (
                    <FormFeedback tooltip>{errors.title}</FormFeedback>
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
