import { observer } from "mobx-react-lite";
import { Segment } from "semantic-ui-react";
import { findTranslation } from "../../../../app/common/language/translations";
import GenericTableComponent from "../../../../app/layout/component/table/GenericTableComponent";
import { ConfirmationModal } from "../../../../app/layout/modal/ConfirmationModal";
import { UserResponse } from "../../../../app/model/UserResponse";
import { useStore } from "../../../../app/store/store";

const ManageUserPage: React.FC = () => {
    const { commonStore: { language }, userStore } = useStore();

    const columns = [
        findTranslation('Name', language),
        findTranslation('Nickname', language),
        findTranslation('Email', language),
        findTranslation('Admin', language),
        findTranslation('Deleted', language),
    ];


    const renderCell = (entity: UserResponse, column: string) => {
        switch (column) {
            case columns[0]:
                return entity.name;
            case columns[1]:
                return entity.nickname;
            case columns[2]:
                return entity.email;
            case columns[3]:
                return entity.admin;
            case columns[4]:
                return entity.deleted;
            default:
                return null;
        }
    };

    return (
        <Segment className="create-film-segment" id='manage' style={{ margin: 'auto', marginTop: '11vh' }}>
            <GenericTableComponent<UserResponse>
                store={userStore}
                renderCell={renderCell}
                entityColumns={columns}
                entityName={findTranslation('User', language)}
                confirmationModalComponent={
                    <ConfirmationModal
                        open={false}
                        onResult={() => { }}
                        closeModal={() => { }}
                        title={findTranslation('ConfirmAction', language)}
                        message={findTranslation('sureQuestion', language)}
                    />
                }
            />
        </Segment>
    );
};

export default observer(ManageUserPage);