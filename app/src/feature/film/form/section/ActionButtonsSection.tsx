import React from 'react';
import { Button } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';
import { useStore } from '../../../../app/store/store';
import { observer } from 'mobx-react-lite';

interface ActionButtonsProps {
    language: any;
    isValid: boolean;
}

const ActionButtonsSection: React.FC<ActionButtonsProps> = ({ isValid, language }) => {
    const { filmFormStore: { saving } } = useStore();

    return (
        <div className="create-film-buttons">
            <Button
                type="button"
                size="large"
                color="grey"
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
