import React from 'react';
import { Form } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    values: any;
    language: any;
    handleChange: any;
}
const TitleDescriptionSection: React.FC<Props> = ({ values, language, handleChange }) => {

    return (
        <>
            <Form.Input
                name="title"
                className='create-input'
                onChange={handleChange}
                value={values.title || ''}
                label={findTranslation("title", language)}
                placeholder={findTranslation("titlePlaceholder", language)}
            />
            <Form.TextArea
                name="description"
                className='create-input'
                onChange={handleChange}
                value={values.description || ''}
                label={findTranslation("description", language)}
                placeholder={findTranslation("descriptionPlaceholder", language)}
            />
        </>
    );
};

export default TitleDescriptionSection;
