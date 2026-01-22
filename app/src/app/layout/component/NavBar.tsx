import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {Container, Icon, Image, Menu, Popup, Segment} from "semantic-ui-react";
import {findTranslation} from '../../common/language/translations';
import {useStore} from '../../store/store';

const NavBar = () => {
    const location = useLocation();
    const [popupOpen, setPopupOpen] = useState(false);
    const {commonStore: {language, setLoading, changeLanguage, activeItem, setActiveItem}, userStore, filmStore: {list, entityList}} = useStore();

    const handleItemClick = async (name: string) => {
        await setLoading(true);
        setActiveItem(name);
        await setLoading(false);
    };

    const handlePopupItemClick = () => {
        setActiveItem('');
        setPopupOpen(false);
    };

    const menuItems = [
        {key: 'films', label: findTranslation('films', language)},
        {key: 'search', label: findTranslation('search', language)},
    ];

    useEffect(() => {
        const currentPath = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        if (activeItem !== currentPath) {
            setActiveItem(currentPath);
        }
    }, [location.pathname, activeItem, setActiveItem]);

    useEffect(() => {
        const loadData = async () => {
            if (location.pathname.includes("manage")) {
                if (entityList.data.length === 0)
                    await list(1, 10, undefined, true, "id", "desc");
                if (userStore.entityList.data.length === 0)
                    await userStore.list(1, 10);
            }
        };

        loadData().then();
    }, [entityList.totalElements, userStore.entityList.totalElements]);

    return (
        <Segment inverted className='navbar'>
            <Container>
                <Menu pointing secondary inverted style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div className='nav-icon'>
                        ☠️ Licoflix
                    </div>
                    <div style={{display: 'flex', flex: 1, justifyContent: 'center'}}>
                        {menuItems.map(({key, label}) => (
                            <Menu.Item
                                key={key}
                                name={label}
                                active={activeItem === key}
                                as={NavLink} to={`/${key}`}
                                onClick={() => {
                                    handleItemClick(key).then();
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        {userStore.entity && (
                            <Menu.Item className="language-nav-icon">
                                <Popup
                                    on="click"
                                    open={popupOpen}
                                    className='navbar'
                                    position="bottom left"
                                    onOpen={() => setPopupOpen(true)}
                                    onClose={() => setPopupOpen(false)}
                                    trigger={
                                        <img
                                            alt="Icon"
                                            className="user-avatar-img"
                                            src={userStore.entity.avatar ? `data:image/jpeg;base64,${userStore.entity.avatar}` : "../../../image/user.png"}
                                        />
                                    }
                                    content={
                                        <Menu vertical size="mini" className='navbar'>
                                            <Menu.Item className='navbar' as={NavLink} to={`/profile`} onClick={() => handlePopupItemClick()}><Icon name='user circle'/>
                                                <div className='popup-item'>{findTranslation('profile', language)}</div>
                                            </Menu.Item>
                                            <Menu.Item className='navbar' as={NavLink} to={'/subtitle-style'} onClick={() => handlePopupItemClick()}><Icon name='font'/>
                                                <div className='popup-item'>{findTranslation('settingsSubtitle', language)}</div>
                                            </Menu.Item>
                                            {userStore.entity?.admin && (
                                                <Menu.Item className='navbar' as={NavLink} to="/manage" onClick={() => {
                                                    handlePopupItemClick()
                                                }}>
                                                    <Icon name='film'/>
                                                    <div className='popup-item'>{findTranslation('manage', language)}</div>
                                                </Menu.Item>
                                            )}
                                            <Menu.Item className='navbar navbar-language-item' onClick={() => changeLanguage(language === 'ptbr' ? 'en' : 'ptbr')}><Image
                                                className='language-popup-icon' size='mini'
                                                src={language === 'ptbr' ? '../../../image/br-flag.png' : '../../../image/us-flag.png'}/>
                                                <div className='popup-item'>{findTranslation('Language', language)}</div>
                                            </Menu.Item>
                                            <Menu.Item className='navbar' onClick={() => {
                                                userStore.logout();
                                                handlePopupItemClick()
                                            }}><Icon name='sign-out'/>
                                                <div className='popup-item'>{findTranslation('signout', language)}</div>
                                            </Menu.Item>
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