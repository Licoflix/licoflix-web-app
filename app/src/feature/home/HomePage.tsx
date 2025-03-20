import { observer } from "mobx-react-lite";
import { Key } from "react";
import { Segment } from "semantic-ui-react";
import { Film } from "../../app/model/Film";
import { useStore } from "../../app/store/store";
import FilmAutoCarouselPage from "../film/FilmAutoCarouselPage";
import FilmCarouselPage from "../film/FilmCarouselPage";

const HomePage: React.FC = () => {
    const { filmStore: { autoCarrousselfilms, groupedFilms, userFilmList, continueWathingList, newFilmsList } } = useStore();

    return (
        <Segment className="home-page" id="home">
            {autoCarrousselfilms && autoCarrousselfilms.length > 0 && <FilmAutoCarouselPage films={autoCarrousselfilms} />}

            {continueWathingList && continueWathingList.length > 0 &&
                <Segment className="film-carousels-segment">
                    <div>
                        <FilmCarouselPage
                            continueWatching={true}
                            films={continueWathingList}
                            category={"Continue Watching"}
                        />
                    </div>
                </Segment>
            }

            {newFilmsList && newFilmsList.totalElements > 0 &&
                <Segment className="film-carousels-segment">
                    <div>
                        <FilmCarouselPage
                            category={"New Films"}
                            continueWatching={false}
                            films={newFilmsList.data}
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

            {groupedFilms && groupedFilms.map((group: { films: Film[]; category: string; }, index: Key | null | undefined) => (
                <Segment className="film-carousels-segment">
                    <div key={index}>
                        <FilmCarouselPage
                            films={group.films}
                            category={group.category}
                        />
                    </div>
                </Segment>
            ))}
        </Segment >
    );
};

export default observer(HomePage);