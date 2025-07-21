import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from 'semantic-ui-react';
import {findTranslation} from '../../../../app/common/language/translations';

interface ActionButtonsProps {
    language: any;
    saving: boolean;
    isValid: boolean;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    onSubmit: () => void;
}

const ActionButtonsSection: React.FC<ActionButtonsProps> = ({isValid, language, saving, currentStep, setCurrentStep, onSubmit,}) => {
    return (
        <div className="create-film-buttons">
            {currentStep > 0 && (
                <Button
                    size="large"
                    color="grey"
                    type="button"
                    disabled={saving}
                    onClick={() => setCurrentStep(currentStep - 1)}
                >
                    {findTranslation('back', language)}
                </Button>
            )}
            {currentStep < 2 ? (
                <Button
                    size="large"
                    type="button"
                    color="purple"
                    onClick={() => setCurrentStep(currentStep + 1)}
                >
                    {findTranslation('next', language)}
                </Button>
            ) : (
                <Button
                    size="large"
                    type="submit"
                    color="purple"
                    loading={saving}
                    disabled={saving || !isValid}
                    onClick={onSubmit}
                >
                    {findTranslation('saveFilm', language)}
                </Button>
            )}
        </div>
    );
};

export default observer(ActionButtonsSection);