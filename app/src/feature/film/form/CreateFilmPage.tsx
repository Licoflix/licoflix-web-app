import {Formik} from 'formik';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {Form, Segment} from 'semantic-ui-react';
import {findTranslation} from '../../../app/common/language/translations';
import {FilmRequest} from '../../../app/model/Film';
import {useStore} from '../../../app/store/store';
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
        commonStore: {language},
        filmFormStore: {
            onSubmit,
            formatDuration,
            getCategoryOptions,
            getLanguageOptions,
            setActiveItem,
            setSelectedFilm,
            ageOptions,
            formValues,
            validationSchema,
            selectedFilm,
            saving,
        },
    } = useStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const handleSubmit = (request: FilmRequest, resetForm: () => void) => {
        onSubmit(request, language).finally(() => {
            resetForm();
            setCurrentStep(0);
            setSelectedFilm(null);
            setActiveItem('manageFilms');
        });
    };

    const handleNext = () => {
        setDirection('forward');
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setDirection('backward');
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <Segment className="create-film-segment" style={{margin: '0 auto', marginTop: '11vh'}}>
            <div style={{marginRight: '5vw'}}>
                <h1 className="create-film-title">{findTranslation('createFilm', language)}</h1>
                <Formik<FilmRequest>
                    validateOnMount
                    initialValues={formValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, {resetForm}) => handleSubmit(values, resetForm)}
                >
                    {({values, handleChange, handleSubmit, setFieldValue, isValid}) => {
                        return (
                            <Form className="ui form error" autoComplete="off">
                                <div className={`steps-container ${direction}`}
                                     style={{transform: `translateX(${-currentStep * 100}%)`}}>
                                    <div className="step">
                                        {currentStep === 0 && (
                                            <>
                                                <TitleDescriptionSection
                                                    saving={saving}
                                                    editFlow={selectedFilm != null}
                                                    values={values}
                                                    handleChange={handleChange}
                                                    language={language}
                                                />
                                                <NumericFieldsSection
                                                    values={values}
                                                    saving={saving}
                                                    language={language}
                                                    handleChange={handleChange}
                                                    setFieldValue={setFieldValue}
                                                    formatDuration={formatDuration}
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="step">
                                        {currentStep === 1 && (
                                            <>
                                                <AwardsFieldsSection
                                                    values={values}
                                                    saving={saving}
                                                    language={language}
                                                    handleChange={handleChange}
                                                    setFieldValue={setFieldValue}
                                                    formatDuration={formatDuration}
                                                />
                                                <TeamFilmSection
                                                    saving={saving}
                                                    values={values}
                                                    handleChange={handleChange}
                                                    language={language}
                                                />
                                                <RatingAndCategorySection
                                                    values={values}
                                                    saving={saving}
                                                    language={language}
                                                    ageOptions={ageOptions}
                                                    setFieldValue={setFieldValue}
                                                    categoryOptions={getCategoryOptions()}
                                                    languageOptions={getLanguageOptions()}
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="step">
                                        {currentStep === 2 && (
                                            <>
                                                <FileUploadSection
                                                    saving={saving}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    language={language}
                                                />
                                                <SubsUploadSection
                                                    saving={saving}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    language={language}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <ActionButtonsSection
                                    saving={saving}
                                    isValid={isValid}
                                    language={language}
                                    currentStep={currentStep}
                                    setCurrentStep={(step) =>
                                        step > currentStep ? handleNext() : handleBack()
                                    }
                                    onSubmit={() => handleSubmit()}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Segment>
    );
};
export default observer(CreateFilmPage);