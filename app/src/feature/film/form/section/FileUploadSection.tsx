import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import UploadComponent from '../../../../app/common/form/components/UploadComponent';
import { findTranslation } from '../../../../app/common/language/translations';

interface FileUploadSectionProps {
    language: any;
    values: any | null;
    setFieldValue: (field: string, value: any) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ values, setFieldValue, language }) => {
    return (
        <Grid columns={4} stackable>
            <Grid.Row>
                <GridColumn width={4}>
                    <UploadComponent
                        fieldName="image"
                        language={language}
                        accept=".jpg,.jpeg,.png"
                        value={values.image || ''}
                        setFieldValue={setFieldValue}
                        label={findTranslation("poster", language)}
                        validTypes={['image/jpeg', 'image/png', 'image/jpg']}
                        errorMessage="Please upload a valid image file (.jpg, .jpeg, .png)."
                    />
                </GridColumn>
                <GridColumn width={4}>
                    <UploadComponent
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
                <GridColumn width={4}>
                    <UploadComponent
                        label="Video"
                        accept=".mp4"
                        fieldName="film"
                        language={language}
                        value={values.film || ''}
                        validTypes={['video/mp4']}
                        setFieldValue={setFieldValue}
                        errorMessage="Please upload a valid video file (.mp4)."
                    />
                </GridColumn>
                <GridColumn width={4}>
                    <UploadComponent
                        accept=".vtt"
                        language={language}
                        fieldName="subtitle"
                        validTypes={['text/vtt']}
                        setFieldValue={setFieldValue}
                        value={values.subtitle || ''}
                        label={findTranslation("Subtitle", language)}
                        errorMessage="Please upload a valid subtitle file (.vtt)."
                    />
                </GridColumn>
            </Grid.Row>
        </Grid>
    );
};

export default FileUploadSection;