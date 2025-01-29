import { observer } from 'mobx-react-lite';
import React, { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Header, Image, Segment } from "semantic-ui-react";
import { findTranslation } from "../../app/common/language/translations";
import { Film } from '../../app/model/Film';
import { useStore } from "../../app/store/store";

interface FilmCarouselPageProps {
    films: Film[];
    category: string;
    continueWatching?: boolean;
}

const FilmCarouselPage: React.FC<FilmCarouselPageProps> = ({ films, category, continueWatching }) => {
    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);
    const { commonStore: { language }, carrousselFilmStore, playerStore: { loadProgress, getFilmDuration, isWatching } } = useStore();

    const handleFilmClick = (film: Film) => {
        navigate(`/film/${film.id}`);
    };

    return (
        <Segment className="film-carousel-segment">
            <Header className="film-category" content={findTranslation(category, language)} />
            {films && films.length > 0 ? (
                <div
                    className="film-carousel"
                    ref={carouselRef}
                    onMouseDown={(e) => carrousselFilmStore.handleMouseDown(e, carouselRef)}
                    onMouseMove={(e) => carrousselFilmStore.handleMouseMove(e, carouselRef)}
                    onMouseUp={() => carrousselFilmStore.handleMouseUp(carouselRef)}
                    onMouseLeave={() => carrousselFilmStore.handleMouseLeave(carouselRef)}
                    style={{ cursor: 'grab', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
                >
                    {films.map((film: Film, index: number) => (
                        <Segment
                            key={index}
                            className="film-card"
                            onClick={() => handleFilmClick(film)}
                        >
                            <Image
                                className="film-image"
                                src={`data:image/jpeg;base64,${film.image}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease', zIndex: 1, }}
                            />

                            <div className="film-hover-container">
                                <div className='film-hover-content'>
                                    <Image
                                        className="film-hover-image"
                                        src={`data:image/jpeg;base64,${film.background}`}
                                    />
                                    <div className="film-hover-title">{film.title}</div>
                                    <div className="film-hover-age">
                                        <Image className='film-age-hover' src={`/image/age/${film.age}.png`} alt={`Age restriction ${film.age}`} />
                                        <p className="film-hover-imdb">IMDb {film.imdb}</p>
                                        <p className="film-hover-duration">{film.duration}</p>
                                        <p className="film-hover-year">{film.year}</p>
                                    </div>
                                    <div className="film-hover-desc">
                                        {film.description.length > 180 ? `${film.description.substring(0, 180)}...` : film.description}
                                    </div>
                                </div>
                            </div>

                            {isWatching(film.title) && continueWatching && (
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${(loadProgress(film.title) / getFilmDuration(film.title)) * 100}%` }} />
                                </div>
                            )}
                        </Segment>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </Segment>
    );
};

export default observer(FilmCarouselPage);