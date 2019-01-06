import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, Input } from 'reactstrap';
import Select from 'react-select';
import { createDeadlineOptions } from './../utility/deadlineOptionsFactory';

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
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                name="title"
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
            />
            {errors.title && touched.title && errors.title}
            <Select<DeadlineSelectOptionType>
                options={deadlineOptions}
                value={values.deadline}
                onChange={newValue => {
                    setFieldValue('deadline', newValue);
                    handleChange('deadline');
                }}
                onBlur={handleBlur}
                placeholder="Deadline"
                name="deadline"
            />
            {errors.deadline && touched.deadline && errors.deadline}
            <button type="submit">Verzenden</button>
        </Form>
    );
};

export default TodoForm;
