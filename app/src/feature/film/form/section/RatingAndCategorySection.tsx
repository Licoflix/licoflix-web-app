import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';
import { CategoryOption } from '../../../../app/model/CategoryOption';

interface Props {
    language: any;
    saving: boolean;
    ageOptions: any[];
    values: any | null;
    languageOptions: CategoryOption[];
    categoryOptions: CategoryOption[];
    setFieldValue: (field: string, value: any) => void;
}

const RatingAndCategorySection: React.FC<Props> = ({ setFieldValue, values, ageOptions, categoryOptions, languageOptions, language, saving }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchLanguage, setSearchLanguage] = useState<string>('');

    const [filteredLanguages, setFilteredLanguages] = useState<any[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = categoryOptions.filter(option =>
                option.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categoryOptions);
        }

        if (searchLanguage) {
            const filtered = languageOptions.filter(option =>
                option.text.toLowerCase().includes(searchLanguage.toLowerCase())
            );
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages(languageOptions);
        }
    }, [searchQuery, searchLanguage, categoryOptions, languageOptions]);

    const translatedCategoryOptions = filteredCategories
        .map((option) => ({
            ...option,
            text: findTranslation(option.text, language),
            value: option.value
        }))
        .sort((a, b) => a.text.localeCompare(b.text));

    const translatedLanguagesOptions = filteredLanguages
        .map((option) => ({
            ...option,
            text: findTranslation(option.text, language),
            value: option.value
        }))
        .sort((a, b) => a.text.localeCompare(b.text));


    return (
        <section className="rating-category-section">
            <Grid columns={3} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Field disabled={saving}>
                            <label>{findTranslation("rating", language)}</label>
                            <Dropdown
                                fluid
                                selection
                                disabled={saving}
                                options={ageOptions}
                                value={values.age || ''}
                                className='create-input'
                                onChange={(_, { value }) => setFieldValue('age', value)}
                                placeholder={findTranslation("ratingPlaceholder", language)}
                            />
                        </Form.Field>
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Field disabled={saving}>
                            <label>{findTranslation("category", language)}</label>
                            <Dropdown
                                fluid
                                search
                                lazyLoad
                                multiple
                                selection
                                disabled={saving}
                                className='create-input'
                                value={values.categories || ''}
                                options={translatedCategoryOptions}
                                placeholder={findTranslation("categoryPlaceholder", language)}
                                onSearchChange={(_, { searchQuery }) => setSearchQuery(searchQuery)}
                                onChange={(_, { value }) => setFieldValue('categories', value as string[])}
                            />
                        </Form.Field>
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Field disabled={saving}>
                            <label>{findTranslation("OriginalLanguage", language)}</label>
                            <Dropdown
                                fluid
                                search
                                selection
                                disabled={saving}
                                className='create-input'
                                value={values.language || ''}
                                options={translatedLanguagesOptions}
                                onChange={(_, { value }) => setFieldValue('language', value)}
                                placeholder={findTranslation("originalLanguagePlaceholder", language)}
                                onSearchChange={(_, { searchLanguage }) => setSearchLanguage(searchLanguage)}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    );
};

export default RatingAndCategorySection;