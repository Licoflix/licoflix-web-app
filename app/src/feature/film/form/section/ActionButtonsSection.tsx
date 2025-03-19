import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface ActionButtonsProps {
    language: any;
    saving: boolean;
    isValid: boolean;
}

const ActionButtonsSection: React.FC<ActionButtonsProps> = ({ isValid, language, saving }) => {

    return (
        <div className="create-film-buttons">
            <Button
                size="large"
                color="grey"
                type="button"
                disabled={saving}
                style={{ marginLeft: '10px' }}
                onClick={() => window.history.back()}
            >
                {findTranslation('cancel', language)}
            </Button>
            <Button
                size="large"
                type="submit"
                color="purple"
                loading={saving}
                disabled={saving || !isValid}
            >
                {findTranslation('saveFilm', language)}
            </Button>
        </div >
    );
};

export default observer(ActionButtonsSection);
