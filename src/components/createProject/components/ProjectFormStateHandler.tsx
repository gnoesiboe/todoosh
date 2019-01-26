import React from 'react';
import { Formik, FormikProps, FormikActions } from 'formik';
import ProjectForm from './ProjectForm';
import { Project } from './../../../model/project';

export type ProjectFormValues = {
    title: string;
    abbrevation: string;
};

export type OnSubmittedAndValidCallback = (values: ProjectFormValues) => void;

type Props = {
    project?: Project;
    onFormSubmittedAndValid: OnSubmittedAndValidCallback;
    onCancel: () => void;
};

function validateValues(values: ProjectFormValues) {
    const errors: { [key: string]: string } = {};

    if (!values.title) {
        errors.title = 'Required';
    }

    if (!values.abbrevation) {
        errors.abbrevation = 'Required';
    }

    return errors;
}

const ProjectFormStateHandler: React.FunctionComponent<Props> = ({
    project,
    onFormSubmittedAndValid,
    onCancel,
}: Props) => {
    const initialValues: ProjectFormValues = {
        title: project ? project.title : '',
        abbrevation: project ? project.abbrevation : '',
    };

    return (
        <Formik
            initialValues={initialValues}
            validate={validateValues}
            onSubmit={(values, actions: FormikActions<ProjectFormValues>) => {
                actions.resetForm();

                onFormSubmittedAndValid(values);
            }}
        >
            {(childProps: FormikProps<ProjectFormValues>) => (
                <ProjectForm {...childProps} onCancel={onCancel} />
            )}
        </Formik>
    );
};

export default ProjectFormStateHandler;
