import React from 'react';
import { FormikProps } from 'formik';
import { ProjectFormValues } from './ProjectFormStateHandler';
import { Form, FormGroup, Label, FormFeedback } from 'reactstrap';
import Input from 'reactstrap/lib/Input';

type Props = {};

const ProjectForm: React.FunctionComponent<
    Props & FormikProps<ProjectFormValues>
> = ({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
    <Form onSubmit={handleSubmit}>
        <FormGroup>
            <Label for="title">Title</Label>
            <Input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                autoFocus
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.title}
                invalid={!!errors.title && touched.title}
                valid={!errors.title && touched.title}
            />
            {errors.title && touched.title && (
                <FormFeedback tooltip>{errors.title}</FormFeedback>
            )}
        </FormGroup>
        <FormGroup>
            <Label for="abbrevation">Abbrevation</Label>
            <Input
                type="text"
                name="abbrevation"
                id="abbrevation"
                placeholder="Abbrevation"
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.abbrevation}
                invalid={!!errors.abbrevation && touched.abbrevation}
                valid={!errors.abbrevation && touched.abbrevation}
            />
            {errors.abbrevation && touched.abbrevation && (
                <FormFeedback tooltip>{errors.abbrevation}</FormFeedback>
            )}
        </FormGroup>
        <button type="submit" className="btn btn-primary">
            Save
        </button>
    </Form>
);

export default ProjectForm;
