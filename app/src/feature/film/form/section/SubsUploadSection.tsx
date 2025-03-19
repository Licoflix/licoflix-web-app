import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import UploadComponent from '../../../../app/common/form/components/UploadComponent';
import { findTranslation } from '../../../../app/common/language/translations';

interface FileUploadSectionProps {
    language: any;
    saving: boolean;
    values: any | null;
    setFieldValue: (field: string, value: any) => void;
}

const SubsUploadSection: React.FC<FileUploadSectionProps> = ({ setFieldValue, values, language, saving }) => {
    return (
        <Grid columns={2} stackable>
            <Grid.Row>
                <GridColumn>
                    <UploadComponent
                        accept=".vtt"
                        saving={saving}
                        language={language}
                        fieldName="subtitle"
                        validTypes={['text/vtt']}
                        setFieldValue={setFieldValue}
                        value={values.subtitle || ''}
                        label={findTranslation("Subtitle", language) + "-ptbr"}
                        errorMessage="Please upload a valid subtitle file (.vtt)."
                    />
                </GridColumn>
                <GridColumn>
                    <UploadComponent
                        accept=".vtt"
                        saving={saving}
                        language={language}
                        fieldName="subtitleEn"
                        validTypes={['text/vtt']}
                        setFieldValue={setFieldValue}
                        value={values.subtitleEn || ''}
                        label={findTranslation("Subtitle", language) + "-en"}
                        errorMessage="Please upload a valid subtitle file (.vtt)."
                    />
                </GridColumn>
            </Grid.Row>
        </Grid>
    );
};

export default SubsUploadSection;