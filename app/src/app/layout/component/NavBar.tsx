import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Container, Icon, Image, Menu, Popup, Segment } from "semantic-ui-react";
import { findTranslation } from '../../common/language/translations';
import { useStore } from '../../store/store';

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState<string>(location.pathname.substring(location.pathname.lastIndexOf('/') + 1));
    const { commonStore: { language, scrollTop, setLoading, changeLanguage }, userStore,
        filmStore: { list, listGroupedFilms, getWatchingFilmsList, categories, entityList } } = useStore();

    const handleItemClick = async (name: string) => {
        setLoading(true)

        setActiveItem(name);
        scrollTop(name);

        if (name == 'films') {
            await Promise.all([
                listGroupedFilms(),
                getWatchingFilmsList()
            ]);
        }

        setLoading(false)
    };

    const handleIconClick = () => {
        setLoading(true)

        navigate('/films')
        setActiveItem('films');
        scrollTop(activeItem);

        setLoading(false)
    };

    const menuItems = [
        { key: 'films', label: findTranslation('films', language) },
        ...(userStore.entity?.admin ? [{ key: 'manage', label: findTranslation('manage', language) }] : []),
        { key: 'search', label: findTranslation('search', language) },
    ];

    useEffect(() => {
        const loadData = async () => {
            if (location.pathname.includes("manage")) {
                if (entityList.data.length === 0)
                    list(1, 10);
                if (userStore.entityList.data.length === 0)
                    userStore.list(1, 10);
            }
        };

        loadData();
    }, [categories.length, location.pathname, entityList.data.length]);

    return (
        <Segment inverted className='navbar'>
            <Container>
                <Menu pointing secondary inverted style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className='nav-icon' onClick={() => { handleIconClick() }}>
                        ☠️ Licoflix
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                        {menuItems.map(({ key, label }) => (
                            <Menu.Item
                                key={key}
                                name={label}
                                active={activeItem === key}
                                as={NavLink} to={`/${key}`}
                                onClick={() => {
                                    handleItemClick(key);
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {userStore.entity && (
                            <Menu.Item className="language-nav-icon">
                                <Popup
                                    on="click"
                                    className='navbar'
                                    position="bottom left"
                                    trigger={
                                        <img
                                            alt="Icon"
                                            style={{
                                                width: '3.4rem',
                                                height: '3.4rem',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                            }}
                                            src={userStore.entity.avatar ? `data:image/jpeg;base64,${userStore.entity.avatar}` : "../../../image/user.png"}
                                        />
                                    }
                                    content={
                                        <Menu vertical size="mini" className='navbar'>
                                            <Menu.Item className='navbar' as={NavLink} to={`/profile`} onClick={() => setActiveItem('')}><Icon name='user circle' /> {findTranslation('profile', language)}</Menu.Item>
                                            <Menu.Item className='navbar' as={NavLink} to={'/subtitle-style'} ><Icon name='cog' /> {findTranslation('settingsSubtitle', language)}</Menu.Item>
                                            <Menu.Item className='navbar' onClick={() => changeLanguage(language === 'ptbr' ? 'en' : 'ptbr')}><Image className='language-popup-icon' size='mini' src={language === 'ptbr' ? '../../../image/br-flag.png' : '../../../image/us-flag.png'} /> {findTranslation('Language', language)}</Menu.Item>
                                            <Menu.Item className='navbar' onClick={() => userStore.logout()}><Icon name='sign-out' /> {findTranslation('signout', language)}</Menu.Item>
                                        </Menu>
                                    }
                                />
                            </Menu.Item>
                        )}
                    </div>
                </Menu>
            </Container>
        </Segment>
    );
};

export default observer(NavBar);