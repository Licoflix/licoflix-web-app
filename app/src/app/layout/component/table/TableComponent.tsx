import { observer } from "mobx-react-lite";
import React, { useReducer, useState } from "react";
import { Icon, Pagination, Table, TableFooter, TableHeaderCell } from "semantic-ui-react";
import { findTranslation } from "../../../common/language/translations";
import { BaseEntity } from "../../../model/BaseEntity";
import { DataListResponse } from "../../../model/DataListResponse";
import { useStore } from "../../../store/store";
import CellContent from "./CellContent";

interface ModalState {
    dimmer: any;
    openFormModal: boolean;
    openConfirmationModal: boolean;
}

type Action =
    | { type: 'OPEN_CONFIRMATION_MODAL'; dimmer: any }
    | { type: 'CLOSE_CONFIRMATION_MODAL' }
    | { type: 'OPEN_FORM_MODAL'; dimmer: any }
    | { type: 'CLOSE_FORM_MODAL' };

const reducer = (state: ModalState, action: Action): ModalState => {
    switch (action.type) {
        case 'OPEN_CONFIRMATION_MODAL':
            return { ...state, openConfirmationModal: true, dimmer: action.dimmer };
        case 'CLOSE_CONFIRMATION_MODAL':
            return { ...state, openConfirmationModal: false };
        case 'OPEN_FORM_MODAL':
            return { ...state, openFormModal: true, dimmer: action.dimmer };
        case 'CLOSE_FORM_MODAL':
            return { ...state, openFormModal: false };
        default:
            throw new Error();
    }
};

interface TableProps<T extends BaseEntity> {
    list: any;
    columns: string[];
    deleteEntity: any;
    handleEditClick?: any;
    searchTerm: string | null;
    entityList: DataListResponse<T> | null;
    confirmationModalComponent?: React.ReactElement<any>;
    renderCell?: (entity: T, column: string) => React.ReactNode;
}

const TableComponent = <T extends BaseEntity>({ entityList, deleteEntity, list, searchTerm, columns, renderCell, confirmationModalComponent, handleEditClick }: TableProps<T>) => {
    const [activePage, setActivePage] = useState(1);
    const { commonStore: { language } } = useStore();

    const pages = entityList && entityList.totalPages ? entityList.totalPages : 1;
    const totalData = entityList && entityList.totalElements ? entityList.totalElements : 0;

    const [modalState, modalDispatch] = useReducer(reducer, {
        openConfirmationModal: false,
        openFormModal: false,
        dimmer: undefined,
    });

    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

    const handlePaginationChange = (_e: React.MouseEvent, { activePage }: any) => {
        setActivePage(activePage);
        list(activePage, 10, searchTerm, true);
    };

    const handleDeleteClick = (entityId: any) => {
        setSelectedEntityId(entityId);
        modalDispatch({ type: 'OPEN_CONFIRMATION_MODAL', dimmer: modalState.dimmer });
    };

    const handleModalResult = (result: boolean) => {
        try {
            if (result) {
                deleteEntity(selectedEntityId!);
            }
        } finally {
            setSelectedEntityId(null);
            modalDispatch({ type: 'CLOSE_CONFIRMATION_MODAL' });
        }
    };

    return (
        <>
            <Table className="entity-table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        {columns.map((column, index) => (
                            <Table.HeaderCell key={index}>{column}</Table.HeaderCell>
                        ))}
                        <Table.HeaderCell>{findTranslation("CreatedIn", language)}</Table.HeaderCell>
                        <Table.HeaderCell>{findTranslation("ChangedIn", language)}</Table.HeaderCell>
                        <Table.HeaderCell>{findTranslation("Actions", language)}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {entityList && entityList.data && entityList.data.length > 0 ? (
                        entityList.data.map((entity, rowIndex) => (
                            <Table.Row key={rowIndex}>
                                <Table.Cell></Table.Cell>
                                {columns.map((column, columnIndex) => {
                                    return (
                                        <Table.Cell key={columnIndex} warning={renderCell && renderCell(entity, column) === ""}>
                                            {renderCell ? (
                                                (() => {
                                                    const renderCellValue = renderCell(entity, column);
                                                    return <CellContent value={renderCellValue} language={language} />;
                                                })()
                                            ) : null}
                                        </Table.Cell>
                                    );
                                })}
                                <Table.Cell>{entity.createdIn}</Table.Cell>
                                <Table.Cell warning={entity.changedIn == null}>{entity.changedIn}</Table.Cell>
                                <Table.Cell>
                                    <Icon
                                        color="red"
                                        title="Delete"
                                        name='trash alternate'
                                        onClick={() => handleDeleteClick(entity.id)}
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                    />
                                    {handleEditClick &&
                                        <Icon
                                            color="blue"
                                            title="Edit"
                                            name='edit outline'
                                            onClick={() => handleEditClick(entity)}
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                        />
                                    }
                                </Table.Cell>
                            </Table.Row>

                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={columns.length + 6} textAlign="center">
                                {findTranslation("NoData", language)}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <TableFooter>
                    <Table.Row>
                        <TableHeaderCell colSpan={columns.length + 6}>
                            <span className="table-footer-text">{findTranslation("recordsFound", language) + totalData}</span>
                            <Pagination
                                size='tiny'
                                floated='right'
                                lastItem={null}
                                firstItem={null}
                                siblingRange={1}
                                boundaryRange={0}
                                totalPages={pages}
                                prevItem={undefined}
                                nextItem={undefined}
                                activePage={activePage}
                                ellipsisItem={undefined}
                                onPageChange={handlePaginationChange}
                            />
                        </TableHeaderCell>
                    </Table.Row>
                </TableFooter>
            </Table>

            <>
                {confirmationModalComponent && React.cloneElement(confirmationModalComponent, {
                    dimmer: modalState.dimmer,
                    onResult: handleModalResult,
                    open: modalState.openConfirmationModal,
                    closeModal: () => modalDispatch({ type: 'CLOSE_CONFIRMATION_MODAL' })
                })}
            </>
        </>
    );
};

export default observer(TableComponent);