import { observer } from 'mobx-react-lite';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    values: any;
    language: any;
    saving: boolean;
    editFlow: boolean;
    handleChange: any;
}
const TitleDescriptionSection: React.FC<Props> = ({ values, language, handleChange, editFlow, saving }) => {

    return (
        <>
            <Form.Input
                name="title"
                onChange={handleChange}
                className='create-input'
                value={values.title || ''}
                disabled={editFlow || saving}
                label={findTranslation("title", language)}
                placeholder={findTranslation("titlePlaceholder", language)}
            />
            <Form.TextArea
                disabled={saving}
                name="description"
                onChange={handleChange}
                className='create-input'
                value={values.description || ''}
                label={findTranslation("description", language)}
                placeholder={findTranslation("descriptionPlaceholder", language)}
            />
        </>
    );
};

export default observer(TitleDescriptionSection);
