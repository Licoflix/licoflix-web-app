import {observer} from "mobx-react-lite";
import React, {Key} from "react";
import {Segment} from "semantic-ui-react";
import {Film} from "../../../app/model/Film.ts";
import FilmCarouselPage from "../FilmCarouselPage.tsx";
import {useStore} from "../../../app/store/store.tsx";

const SagaPage: React.FC = () => {
    const {filmStore: {groupedSagaFilms}} = useStore();

    return (
        <Segment className="home-page" id="home" style={{marginTop: '11vh'}}>
            {groupedSagaFilms && groupedSagaFilms.map((group: {
                films: Film[];
                category: string;
            }, index: Key | null | undefined) => (
                <Segment className="film-carousels-segment">
                    <div key={index}>
                        <FilmCarouselPage
                            films={group.films}
                            category={group.category}
                        />
                    </div>
                </Segment>
            ))}
        </Segment>
    );
};

export default observer(SagaPage);