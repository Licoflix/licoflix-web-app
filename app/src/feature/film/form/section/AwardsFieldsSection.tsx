import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    values: any;
    language: any;
    saving: boolean;
    handleChange: any;
    formatDuration: (duration: string) => string;
    setFieldValue: (field: string, value: any) => void;
}

const AwardsFieldsSection: React.FC<Props> = ({ values, language, handleChange, saving }) => {
    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        handleChange(e);
    };

    const handleImdbInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        e.target.value = value;
        handleChange(e);
    };

    return (
        <section className="year-duration-section">
            <Grid columns={4} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Input
                            type="number"
                            disabled={saving}
                            name="baftaAwards"
                            className="create-input"
                            value={values.baftaAwards}
                            onChange={handleNumericInput}
                            label={findTranslation("baftaAwards", language)}
                            placeholder={findTranslation("baftaAwardsPlaceholder", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            type="number"
                            name="oscars"
                            disabled={saving}
                            value={values.oscars}
                            className="create-input"
                            onChange={handleNumericInput}
                            label={findTranslation("oscars", language)}
                            placeholder={findTranslation("oscarsPlaceholder", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            type="number"
                            disabled={saving}
                            name="goldenGlobes"
                            className="create-input"
                            value={values.goldenGlobes}
                            onChange={handleNumericInput}
                            label={findTranslation("goldenGlobes", language)}
                            placeholder={findTranslation("goldenGlobes", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            name="imdb"
                            type="number"
                            disabled={saving}
                            value={values.imdb}
                            className="create-input"
                            onChange={handleImdbInput}
                            label={findTranslation("imdb", language)}
                            placeholder={findTranslation("imdbPlaceholder", language)}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    );
};

export default AwardsFieldsSection;