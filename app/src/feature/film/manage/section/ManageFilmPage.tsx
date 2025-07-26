import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { findTranslation } from "../../../../app/common/language/translations";
import GenericTableComponent from "../../../../app/layout/component/table/GenericTableComponent";
import { ConfirmationModal } from "../../../../app/layout/modal/ConfirmationModal";
import { Film } from "../../../../app/model/Film";
import { useStore } from "../../../../app/store/store";

const ManageFilmPage: React.FC = () => {
    const { filmStore, commonStore: { language }, filmFormStore: { handleEditClick } } = useStore();

    const columns = [
        findTranslation('Title', language),
        findTranslation('Oscars', language),
        findTranslation('BaftaAwards', language),
        findTranslation('GoldenGlobes', language),
        findTranslation('imdb', language),
        findTranslation('Year', language),
        findTranslation('Directors', language),
    ];


    const renderCell = (entity: Film, column: string) => {
        switch (column) {
            case columns[0]:
                return entity.title;
            case columns[1]:
                return entity.oscars === 0 ? "" : entity.oscars;
            case columns[2]:
                return entity.baftaAwards === 0 ? "" : entity.baftaAwards;
            case columns[3]:
                return entity.goldenGlobes === 0 ? "" : entity.goldenGlobes;
            case columns[4]:
                return entity.imdb;
            case columns[5]:
                return entity.year;
            case columns[6]:
                return entity.directors;
            default:
                return null;
        }
    };

    useEffect(() => {
        filmStore.list(1, 10, undefined, true).then();
    }, []);

    return (
        <Segment className="create-film-segment" id='manage' style={{ margin: 'auto', marginTop: '11vh' }}>
            <GenericTableComponent<Film>
                store={filmStore}
                renderCell={renderCell}
                entityColumns={columns}
                handleEditClick={handleEditClick}
                entityName={findTranslation('Film', language)}
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

export default observer(ManageFilmPage);