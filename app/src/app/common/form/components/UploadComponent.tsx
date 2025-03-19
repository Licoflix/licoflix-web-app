import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import { findTranslation } from '../../language/translations';

interface UploadComponentProps {
    language: any;
    label: string;
    accept: string;
    saving: boolean;
    fieldName: string;
    value: File | null;
    validTypes?: string[];
    errorMessage?: string;
    setFieldValue: (field: string, value: any) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({
    label,
    value,
    accept,
    saving,
    language,
    fieldName,
    validTypes,
    setFieldValue,
    errorMessage = 'Invalid file type.',
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!validTypes || validTypes.includes(file.type) || validTypes.some((type) => file.name.endsWith(type))) {
                setFieldValue(fieldName, file);
            } else {
                alert(errorMessage);
            }
        }
    };

    return (
        <Form.Field disabled={saving}>
            <label>{label}</label>
            <Button
                type="button"
                disabled={saving}
                className='upload-buttom'
                style={{ width: '100%' }}
                onClick={() => document.getElementById(`${fieldName}-upload`)?.click()}
            >
                {value ? (
                    <>
                        {value.name.length > 8 ? `${value.name.slice(0, 8)}... ` : value.name}
                        <Icon style={{ paddingLeft: '10px' }} name='check' color='green' />
                    </>
                ) : (
                    <>
                        {findTranslation('uploadFile', language)}
                        <Icon style={{ paddingLeft: '10px' }} name='upload' color='grey' />
                    </>
                )}

            </Button>
            <Input
                type="file"
                accept={accept}
                disabled={saving}
                id={`${fieldName}-upload`}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </Form.Field >
    );
};

export default observer(UploadComponent);