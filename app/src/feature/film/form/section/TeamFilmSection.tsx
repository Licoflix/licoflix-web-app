import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';

interface Props {
    language: any;
    values: any | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TeamFilmSection: React.FC<Props> = ({ values, language, handleChange }) => {
    return (
        <section className="team-film-section">
            <Grid columns={3} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Input
                            name="cast"
                            onChange={handleChange}
                            className='create-input'
                            value={values.cast || ''}
                            label={findTranslation("cast", language)}
                            placeholder={findTranslation("castPlaceholder", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            name="producers"
                            onChange={handleChange}
                            className='create-input'
                            value={values.producers || ''}
                            label={findTranslation("producers", language)}
                            placeholder={findTranslation("producersPlaceholder", language)}
                        />
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Input
                            name="directors"
                            onChange={handleChange}
                            className='create-input'
                            value={values.directors || ''}
                            label={findTranslation("directors", language)}
                            placeholder={findTranslation("directorsPlaceholder", language)}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    );
};

export default TeamFilmSection;