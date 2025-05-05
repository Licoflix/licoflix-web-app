import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Header, Icon, Image, Segment } from "semantic-ui-react";
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
    const { commonStore: { language }, playerStore: { loadProgress, getFilmDuration, isWatching }, filmStore: { loadMoreFilmsByCategory } } = useStore();

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleFilmClick = (film: Film) => {
        navigate(`/film/${film.id}`);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const filmCard = e.currentTarget as HTMLElement;
            const filmCardRect = filmCard.getBoundingClientRect();
            const carouselRect = carousel.getBoundingClientRect();

            const rightEdge = carouselRect.right;
            const cardRight = filmCardRect.right;

            if (cardRight > rightEdge - 50) {
                const scrollDistance = cardRight - rightEdge + 50;
                carousel.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            }
        }
    };

    const checkArrowsVisibility = () => {
        if (carouselRef.current) {
            const carousel = carouselRef.current;
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

            setShowLeftArrow(carousel.scrollLeft > 0);
            setShowRightArrow(carousel.scrollLeft < maxScrollLeft);
        }
    };

    const smoothScrollBy = (element: HTMLElement, distance: number, duration: number) => {
        const start = element.scrollLeft;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            element.scrollLeft = start + distance * progress;
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };


    useEffect(() => {
        checkArrowsVisibility();
    }, [films]);

    return (
        <Segment className="film-carousel-segment">
            {films && films.length > 0 ? (
                <div className="film-carousel-container" style={{ position: 'relative', overflow: 'hidden' }}>
                    <Header className="film-category" content={findTranslation(category, language)} />
                    <div
                        ref={carouselRef}
                        className="film-carousel"
                        onScroll={checkArrowsVisibility}
                        style={{
                            cursor: 'grab',
                            display: 'flex',
                            overflow: 'hidden',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        {films.map((film: Film, index: number) => (
                            <Segment
                                key={index}
                                className="film-card"
                                onClick={() => handleFilmClick(film)}
                                onMouseEnter={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleMouseEnter(e)}
                            >
                                <Image
                                    className="film-image"
                                    src={`data:image/jpeg;base64,${film.image}`}
                                    style={{
                                        zIndex: 1,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'opacity 0.3s ease',
                                    }}
                                />
                                <div className="film-hover-container">
                                    <div className="film-hover-content">
                                        <Image
                                            className="film-hover-image"
                                            src={`data:image/jpeg;base64,${film.background}`}
                                        />
                                        <div className="film-hover-title">{film.title}</div>
                                        <div className="film-hover-age">
                                            <Image className="film-age-hover" src={`/image/age/${film.age}.png`} alt={`Age restriction ${film.age}`} />
                                            <p className="film-hover-imdb">IMDb {String(film.imdb).includes('.') ? film.imdb : `${film.imdb}.0`}</p>
                                            <p className="film-hover-duration">{film.duration}</p>
                                            <p className="film-hover-year">{film.year}</p>
                                        </div>
                                        <div className="film-hover-desc">
                                            {film.description.length > 180 ? `${film.description.substring(0, 200)}...` : film.description}
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
                    {showLeftArrow && (
                        <div
                            className="carousel-arrow-left show"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (carouselRef.current) {
                                    smoothScrollBy(carouselRef.current, -400, 400);
                                }
                            }}
                        >
                            <Icon name="chevron left" size="large" color="brown" />
                        </div>
                    )}
                    {showRightArrow && (
                        <div
                            className="carousel-arrow-right show"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (carouselRef.current) {
                                    smoothScrollBy(carouselRef.current, 400, 400);
                                    loadMoreFilmsByCategory(category);
                                }
                            }}
                        >
                            <Icon name="chevron right" size="large" color="brown" />
                        </div>
                    )}
                </div>
            ) : (
                <></>
            )}
        </Segment>
    );
};

export default observer(FilmCarouselPage);