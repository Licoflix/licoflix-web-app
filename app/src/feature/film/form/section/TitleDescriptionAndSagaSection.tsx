import { observer } from 'mobx-react-lite';
import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    values: any;
    language: any;
    saving: boolean;
    editFlow: boolean;
    handleChange: any;
}
const TitleDescriptionAndSagaSection: React.FC<Props> = ({ values, language, handleChange, editFlow, saving }) => {
    return (
        <>
            <Grid style={{ marginBottom: '0.5vh' }}>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form.Input
                            name="title"
                            onChange={handleChange}
                            className='create-input'
                            value={values.title || ''}
                            disabled={editFlow || saving}
                            label={findTranslation("title", language)}
                            placeholder={findTranslation("titlePlaceholder", language)}
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Form.Input
                            disabled={saving}
                            name="originalTitle"
                            onChange={handleChange}
                            className='create-input'
                            value={values.originalTitle || ''}
                            label={findTranslation("originalTitle", language)}
                            placeholder={findTranslation("originalTitlePlaceholder", language)}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Form.Input
                name="saga"
                disabled={saving}
                onChange={handleChange}
                className='create-input'
                value={values.saga || ''}
                label={findTranslation("Saga", language)}
                placeholder={findTranslation("sagaPlaceholder", language)}
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

export default observer(TitleDescriptionAndSagaSection);