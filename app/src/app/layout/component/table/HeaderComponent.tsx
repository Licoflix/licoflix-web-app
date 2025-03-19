import { observer } from "mobx-react-lite";
import React, { ReactNode, useReducer } from "react";
import { Button, Header, Icon, Input } from "semantic-ui-react";
import { findTranslation } from "../../../common/language/translations";
import { useStore } from "../../../store/store";

type Action = { type: 'OPEN_MODAL', dimmer: any } | { type: 'CLOSE_MODAL' };

const reducer = (_state: any, action: Action) => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { open: true, dimmer: action.dimmer };
        case 'CLOSE_MODAL':
            return { open: false };
        default:
            throw new Error("Unexpected action type");
    }
};

export interface TableHeaderProps {
    list: any;
    xls?: () => void;
    setSearchTerm: any;
    modalComponent?: ReactNode;
    searchTerm: string | null;
    entityName: string | null;
}

const HeaderComponent: React.FC<TableHeaderProps> = ({ xls, list, setSearchTerm, searchTerm, entityName, modalComponent }) => {
    const { commonStore: { language } } = useStore();
    const [modalState, modalDispatch] = useReducer(reducer, { open: false });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            list(1, 10, searchTerm, true);
        }
    };

    return (
        <div className="header-component-header">
            <Header>
                <span style={{ fontWeight: '800' }}>{entityName}</span>
            </Header>
            <div className="search-container">
                <div>
                    <Input
                        value={searchTerm || ''}
                        style={{ width: '25vw' }}
                        onKeyPress={handleKeyPress}
                        onChange={handleSearchChange}
                        icon={<Icon name='search' link />}
                        placeholder={`${findTranslation('Search', language)}...`}
                    />
                </div>
                <div>
                    {modalComponent && <Button style={{ marginRight: 12 }} icon='plus' content={`${findTranslation('Add', language)}`} color="vk" onClick={() => modalDispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })} />}
                    {xls && <Button onClick={xls} icon='file excel' content='xls' color="green" />}
                </div>
            </div>

            {modalComponent && React.cloneElement(modalComponent as React.ReactElement<any>, {
                open: modalState.open,
                dimmer: modalState.dimmer,
                closeModal: () => modalDispatch({ type: 'CLOSE_MODAL' })
            })}
        </div>
    )
}

export default observer(HeaderComponent);