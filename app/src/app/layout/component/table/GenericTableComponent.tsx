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

    return (
        <>
            <HeaderComponent
                entityName={entityName}
                xls={currentStore?.xls}
                list={currentStore?.list}
                modalComponent={headerModalComponent}
                setSearchTerm={currentStore?.setSearchTerm}
                searchTerm={currentStore?.searchTerm || null}
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
                columns={columns}
                renderCell={renderCell}
                list={currentStore?.list}
                handleEditClick={handleEditClick}
                deleteEntity={currentStore?.deleteEntity}
                entityList={currentStore?.entityList || null}
                searchTerm={currentStore?.searchTerm || null}
                confirmationModalComponent={confirmationModalComponent}
            />
        </>
    );
};

export default observer(GenericTableComponent);