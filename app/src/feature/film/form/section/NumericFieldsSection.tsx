import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    values: any;
    language: any;
    handleChange: any;
    formatDuration: (duration: string) => string;
    setFieldValue: (field: string, value: any) => void;
}

const NumericFieldsSection: React.FC<Props> = ({ values, language, handleChange, setFieldValue, formatDuration }) => {
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
            <Grid columns={5} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Input
                            name="year"
                            type="number"
                            onChange={handleChange}
                            className="create-input"
                            value={values.year || ''}
                            label={findTranslation("year", language)}
                            placeholder={findTranslation("yearPlaceholder", language)}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                let value = e.target.value.replace(/[^0-9]/g, '');
                                if (value.length > 4) value = value.slice(0, 4);
                                e.target.value = value;
                                handleChange(e);
                            }}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            name="duration"
                            className="create-input"
                            value={values.duration || ''}
                            label={findTranslation("duration", language)}
                            placeholder={findTranslation("durationPlaceholder", language)}
                            onChange={(e) => {
                                const formattedDuration = formatDuration(e.target.value);
                                setFieldValue("duration", formattedDuration);
                            }}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            type="number"
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
                            value={values.oscars}
                            className="create-input"
                            onChange={handleNumericInput}
                            label={findTranslation("oscars", language)}
                            placeholder={findTranslation("oscarsPlaceholder", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            name="imdb"
                            type="number"
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

export default NumericFieldsSection;