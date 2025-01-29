import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Menu, MenuItem } from 'semantic-ui-react';
import { findTranslation } from '../../../common/language/translations';
import { BaseEntity } from '../../../model/BaseEntity';
import { IBaseStore } from '../../../store/IBaseStore';
import { useStore } from '../../../store/store';
import HeaderComponent from './HeaderComponent';
import TableComponent from './TableComponent';

interface StoreMapItem<T extends BaseEntity> {
    columns: string[];
    activeItem: string;
    store: IBaseStore<T> | undefined;
}

interface GenericTableComponentProps<T extends BaseEntity> {
    entityName: string;
    store?: IBaseStore<T>;
    handleEditClick?: any;
    entityColumns: string[];
    storeMap?: StoreMapItem<T>[];
    formModalComponent?: React.ReactElement<any>;
    headerModalComponent?: React.ReactElement<any>;
    confirmationModalComponent?: React.ReactElement<any>;
    renderCell?: (entity: T, column: string) => React.ReactNode;
}

const GenericTableComponent = <T extends BaseEntity>({
    store,
    storeMap,
    entityName,
    renderCell,
    entityColumns,
    handleEditClick,
    headerModalComponent,
    confirmationModalComponent,
}: GenericTableComponentProps<T>) => {
    const { commonStore: { language } } = useStore();
    const menuItems = storeMap?.map(item => item.activeItem) || [];
    const [activeItem, setActiveItem] = useState(menuItems[0] || undefined);

    const handleItemClick = (_e: any, { name }: any) => {
        setActiveItem(name);
    };

    const columns: string[] = storeMap ? storeMap?.flatMap(item => item.columns) ?? [] : entityColumns!;
    const currentStore = storeMap ? storeMap.find(item => item.activeItem === activeItem)?.store : store;

    const {
        xls = () => { },
        list = () => { },
        searchTerm = null,
        entityList = null,
        deleteEntity = () => { },
        setSearchTerm = () => { },
    } = currentStore || {};

    return (
        <>
            <HeaderComponent
                xls={xls}
                list={list}
                searchTerm={searchTerm}
                entityName={entityName}
                setSearchTerm={setSearchTerm}
                modalComponent={headerModalComponent}
            />
            {menuItems.length > 0 && (
                <>
                    <Menu pointing secondary>
                        {menuItems.map(item => (
                            <MenuItem
                                key={item}
                                name={item}
                                onClick={handleItemClick}
                                active={activeItem === item}
                                content={findTranslation(item, language)}
                            />
                        ))}
                    </Menu>
                </>
            )}
            <TableComponent
                list={list}
                columns={columns}
                entityList={entityList}
                searchTerm={searchTerm}
                renderCell={renderCell}
                deleteEntity={deleteEntity}
                handleEditClick={handleEditClick}
                confirmationModalComponent={confirmationModalComponent}
            />
        </>
    );
};

export default observer(GenericTableComponent);