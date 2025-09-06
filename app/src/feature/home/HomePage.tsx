import {observer} from "mobx-react-lite";
import React, {Key} from "react";
import {Segment} from "semantic-ui-react";
import {Film} from "../../app/model/Film";
import {useStore} from "../../app/store/store";
import FilmAutoCarouselPage from "../film/FilmAutoCarouselPage";
import FilmCarouselPage from "../film/FilmCarouselPage";

const HomePage: React.FC = () => {
    const {filmStore: {newFilms, groupedFilms, userFilmList, continueWatchingList}} = useStore();

    return (
        <Segment className="home-page" id="home">
            {newFilms && newFilms.length > 0 &&
                <FilmAutoCarouselPage films={newFilms}/>
            }

            {continueWatchingList && continueWatchingList.length > 0 &&
                <Segment className="film-carousels-segment">
                    <div>
                        <FilmCarouselPage
                            continueWatching={true}
                            films={continueWatchingList}
                            category={"Continue Watching"}
                        />
                    </div>
                </Segment>
            }

            {userFilmList && userFilmList.length > 0 &&
                <Segment className="film-carousels-segment">
                    <div>
                        <FilmCarouselPage
                            films={userFilmList}
                            category={"My List"}
                        />
                    </div>
                </Segment>
            }

            {newFilms && newFilms.length > 0 &&
                <Segment className="film-carousels-segment">
                    <div>
                        <FilmCarouselPage
                            films={newFilms}
                            category={"New Films"}
                        />
                    </div>
                </Segment>
            }

            {groupedFilms && groupedFilms.map((group: {
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

export default observer(HomePage);