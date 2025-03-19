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

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ setFieldValue, values, language, saving }) => {
    return (
        <Grid columns={3} stackable>
            <Grid.Row>
                <GridColumn>
                    <UploadComponent
                        fieldName="image"
                        saving={saving}
                        language={language}
                        accept=".jpg,.jpeg,.png"
                        value={values.image || ''}
                        setFieldValue={setFieldValue}
                        label={findTranslation("poster", language)}
                        validTypes={['image/jpeg', 'image/png', 'image/jpg']}
                        errorMessage="Please upload a valid image file (.jpg, .jpeg, .png)."
                    />
                </GridColumn>
                <GridColumn>
                    <UploadComponent
                        saving={saving}
                        language={language}
                        fieldName="background"
                        accept=".jpg,.jpeg,.png"
                        setFieldValue={setFieldValue}
                        value={values.background || ''}
                        label={findTranslation("background", language)}
                        validTypes={['image/jpeg', 'image/png', 'image/jpg']}
                        errorMessage="Please upload a valid background file (.jpg, .jpeg, .png)."
                    />
                </GridColumn>
                <GridColumn>
                    <UploadComponent
                        label="Video"
                        accept=".mp4"
                        saving={saving}
                        fieldName="film"
                        language={language}
                        value={values.film || ''}
                        validTypes={['video/mp4']}
                        setFieldValue={setFieldValue}
                        errorMessage="Please upload a valid video file (.mp4)."
                    />
                </GridColumn>
            </Grid.Row>
        </Grid>
    );
};

export default FileUploadSection;