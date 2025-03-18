import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, GridColumn, Menu, MenuItem, Segment } from "semantic-ui-react";
import { findTranslation } from "../../../app/common/language/translations";
import { useStore } from "../../../app/store/store";
import CreateFilmPage from "../form/CreateFilmPage";
import ManageFilmPage from "./section/ManageFilmPage";
import ManageUserPage from "./section/ManageUserPage";

const ManagePage: React.FC = () => {
    const { filmStore: { setSearchTerm }, commonStore: { language }, filmFormStore: { setSelectedFilm, setActiveItem, setFormValues, initialFormValues, activeItem } } = useStore();

    const menuItems = [
        { key: 'manageUsers', label: findTranslation('manageUsers', language), component: <ManageUserPage /> },
        { key: 'manageFilms', label: findTranslation('manageFilms', language), component: <ManageFilmPage /> },
        { key: 'createFilms', label: findTranslation('createFilms', language), component: <CreateFilmPage /> },
    ];

    const activeComponent = menuItems.find((item) => item.key === activeItem)?.component;

    const handleItemClick = (key: string) => {
        setActiveItem(key);
        setSelectedFilm(null);
        setFormValues(initialFormValues);
    };

    useEffect(() => {
        setSearchTerm(null);
        setFormValues(initialFormValues);
    }, []);

    return (
        <Grid className="manage-grid">
            <GridColumn width={2} className="manage-column">
                <Menu className="manage-menu" pointing secondary vertical fluid>
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.key}
                            name={item.key}
                            active={activeItem === item.key}
                            onClick={() => handleItemClick(item.key)}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            </GridColumn>
            <GridColumn width={12}>
                <Segment basic style={{ flex: 1, padding: "20px" }}>
                    {activeComponent && activeComponent}
                </Segment>
            </GridColumn>
        </Grid>
    );
};

export default observer(ManagePage);