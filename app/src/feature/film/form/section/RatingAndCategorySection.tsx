import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Grid } from 'semantic-ui-react';
import { findTranslation } from '../../../../app/common/language/translations';
import { CategoryOption } from '../../../../app/model/CategoryOption';

interface Props {
    language: any;
    ageOptions: any[];
    values: any | null;
    categoryOptions: CategoryOption[];
    setFieldValue: (field: string, value: any) => void;
}

const RatingAndCategorySection: React.FC<Props> = ({ values, setFieldValue, ageOptions, categoryOptions, language }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
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
    }, [searchQuery, categoryOptions]);

    const translatedCategoryOptions = filteredCategories.map((option) => ({
        ...option,
        text: findTranslation(option.text, language),
        value: option.value
    }));

    return (
        <section className="rating-category-section">
            <Grid columns={2} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Field>
                            <label>{findTranslation("rating", language)}</label>
                            <Dropdown
                                fluid
                                selection
                                options={ageOptions}
                                value={values.age || ''}
                                className='create-input'
                                onChange={(_, { value }) => setFieldValue('age', value)}
                                placeholder={findTranslation("ratingPlaceholder", language)}
                            />
                        </Form.Field>
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Field>
                            <label>{findTranslation("category", language)}</label>
                            <Dropdown
                                fluid
                                search
                                lazyLoad
                                multiple
                                selection
                                className='create-input'
                                value={values.categories || ''}
                                options={translatedCategoryOptions}
                                placeholder={findTranslation("categoryPlaceholder", language)}
                                onSearchChange={(_, { searchQuery }) => setSearchQuery(searchQuery)}
                                onChange={(_, { value }) => setFieldValue('categories', value as string[])}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    );
};

export default RatingAndCategorySection;