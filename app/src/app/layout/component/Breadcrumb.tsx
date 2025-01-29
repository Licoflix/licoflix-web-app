import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BreadcrumbDivider, BreadcrumbSection, Button, Icon, Image } from "semantic-ui-react";
import { useStore } from "../../store/store";
import { findTranslation } from '../../common/language/translations';

export default observer(function Breadcrumb() {
    const location = useLocation();
    const { commonStore } = useStore();
    const pathnames = location.pathname.split('/').filter(x => x);

    const sections = [
        { key: 'Dashboard', content: findTranslation('dashboard', commonStore.language), link: true, as: Link, to: '/' },
        ...commonStore.generateBreadcrumb(pathnames).map(section => ({
            ...section,
            content: findTranslation(section.content, commonStore.language)
        }))
    ];

    const handleButtonClick = () => {
        if (commonStore.language === 'ptbr')
            commonStore.changeLanguage('en');
        else
            commonStore.changeLanguage('ptbr');
    };

    return (
        <div className="breadcrumb-container">
            <div className="breadcrumb-sections">
                <Icon name='home' className="breadcrumb-home-icon" />
                {sections.map((section, index) => (
                    <React.Fragment key={section.key}>
                        {index > 0 && (
                            <BreadcrumbDivider
                                className="breadcrumb-divider"
                                icon='angle double right'
                            />
                        )}
                        {section.link ? (
                            <BreadcrumbSection link as={section.as} to={section.to}>
                                {section.content}
                            </BreadcrumbSection>
                        ) : (
                            <BreadcrumbSection active={true}>
                                {section.content}
                            </BreadcrumbSection>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <Button
                className='language-icon-container'
                onClick={handleButtonClick}
                size='huge'
            >
                <Image className='language-icon' src={commonStore.language === 'ptbr' ? '../../../images/br-flag.png' : '../../../images/us-flag.png'} />
            </Button>
        </div>
    )
});