import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Form, Segment } from 'semantic-ui-react';
import { findTranslation } from '../../../app/common/language/translations';
import { FilmRequest } from '../../../app/model/Film';
import { useStore } from '../../../app/store/store';
import ActionButtonsSection from './section/ActionButtonsSection';
import AwardsFieldsSection from './section/AwardsFieldsSection';
import FileUploadSection from './section/FileUploadSection';
import NumericFieldsSection from './section/NumericFieldsSection';
import RatingAndCategorySection from './section/RatingAndCategorySection';
import SubsUploadSection from './section/SubsUploadSection';
import TeamFilmSection from './section/TeamFilmSection';
import TitleDescriptionSection from './section/TitleDescriptionSection';

const CreateFilmPage: React.FC = () => {
    const {
        commonStore: { language }, filmFormStore: { onSubmit, formatDuration, getCategoryOptions, getLanguageOptions, setFormValues, setSelectedFilm,
            initialFormValues, ageOptions, formValues, validationSchema, selectedFilm, saving }, } = useStore();

    const handleSubmit = (request: FilmRequest, resetForm: () => void) => {
        onSubmit(request, language)
            .finally(() => {
                resetForm();
                setSelectedFilm(null);
                setFormValues(initialFormValues);
            });
    };

    return (
        <Segment className="create-film-segment" style={{ maxWidth: 800, margin: '0 auto', marginTop: '11vh' }}>
            <div style={{ marginRight: '5vw' }}>
                <h1 className="create-film-title">{findTranslation('createFilm', language)}</h1>
                <Formik<FilmRequest>
                    validateOnMount
                    initialValues={formValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleSubmit, setFieldValue, isValid }) => {
                        return (
                            <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                                <TitleDescriptionSection saving={saving} editFlow={selectedFilm != null} values={values} handleChange={handleChange} language={language} />
                                <NumericFieldsSection
                                    values={values}
                                    saving={saving}
                                    language={language}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    formatDuration={formatDuration}
                                />
                                <AwardsFieldsSection
                                    values={values}
                                    saving={saving}
                                    language={language}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    formatDuration={formatDuration}
                                />
                                <TeamFilmSection saving={saving} values={values} handleChange={handleChange} language={language} />
                                <RatingAndCategorySection
                                    values={values}
                                    saving={saving}
                                    language={language}
                                    ageOptions={ageOptions}
                                    setFieldValue={setFieldValue}
                                    categoryOptions={getCategoryOptions()}
                                    languageOptions={getLanguageOptions()}
                                />
                                <FileUploadSection saving={saving} values={values} setFieldValue={setFieldValue} language={language} />
                                <SubsUploadSection saving={saving} values={values} setFieldValue={setFieldValue} language={language} />
                                <ActionButtonsSection saving={saving} isValid={isValid} language={language} />
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Segment>
    );
};

export default observer(CreateFilmPage);