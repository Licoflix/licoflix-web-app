import {observer} from 'mobx-react-lite';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Header, Icon, Image, Segment} from 'semantic-ui-react';
import {findTranslation} from '../../../app/common/language/translations';
import {Film} from '../../../app/model/Film';
import {useStore} from '../../../app/store/store';

interface Props {
    film: Film;
}

const FilmDetailsContent: React.FC<Props> = ({film}) => {
    const navigate = useNavigate();
    const {commonStore: {language}, filmStore, playerStore: {isWatching, resetFilmProgress}} = useStore();

    const handleWathNowClick = (film: Film) => {
        navigate(`/film/watch/${film.title}`);
    };

    const handleAddFilmClick = (film: Film) => {
        filmStore.addFilmInUserList(film.id).then();
    };

    const handleRemoveFilmClick = (film: Film) => {
        filmStore.removeFilmInUserList(film.id).then();
    };

    const someIncluded = (film: Film) => filmStore.userFilmList.some((userFilm) => userFilm.id === film.id);

    return (
        <>
            {film && (
                <div>
                    <Image
                        className="film-component-background"
                        style={{
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `url(${film.background ? `data:image/jpeg;base64,${film.background}` : ""})`,
                        }}
                    />
                    <div className="film-component-content">
                        <Segment className="film-component-segment">
                            <Segment className="film-component-description-container">
                                <div className="film-titles-container">
                                    <Header className="film-component-header">{film.title.replace(/\(\d{4}\)/g, "").trim()}</Header>
                                    <Header className="film-component-original-title">({film.originalTitle})</Header>
                                </div>
                                {(film.oscars > 0 || film.baftaAwards > 0 || film.goldenGlobes > 0) && (() => {
                                    const awards = [
                                        {label: "OSCARS®", count: film.oscars},
                                        {label: "BAFTA Awards®", count: film.baftaAwards},
                                        {label: "Golden Globe®", count: film.goldenGlobes},
                                    ];

                                    return (
                                        <p className="film-component-oscar-text">
                                            {awards
                                                .filter(award => award.count > 0)
                                                .map(award => `${award.label} ${award.count}x ${findTranslation("winner", language)}`)
                                                .join(" & ")}
                                        </p>
                                    );
                                })()}
                                <p className="film-component-description-text">{film.description}</p>
                                <Header className="film-component-header-info">
                                    <p className="film-imdb">
                                        IMDb {String(film.imdb).includes('.') ? film.imdb : `${film.imdb}.0`}
                                    </p>
                                    <p className="film-duration">{film.duration}</p>
                                    <Image
                                        className="film-age"
                                        src={`/image/age/${film.age}.png`}
                                        alt={`Age restriction ${film.age}`}
                                    />
                                    <p className="film-year">{film.year}</p>
                                </Header>
                                {film.categories && film.categories.length > 0 && (
                                    <Header className="film-component-category">
                                        {film.categories
                                            .map((category, index) => (
                                                <>
                                                    {index > 0 && <span className="bullet">•</span>}
                                                    {findTranslation(category, language)}
                                                </>
                                            ))}
                                    </Header>
                                )}

                                <div className="film-component-buttons">
                                    <Button
                                        size="big"
                                        color="purple"
                                        className="film-component-button"
                                        onClick={() => handleWathNowClick(film)}
                                    >
                                        <Icon className="plus-icon" name="play"/>
                                        {!isWatching(film.title)
                                            ? findTranslation('watchNow', language)
                                            : findTranslation('continueWatch', language)
                                        }
                                    </Button>

                                    {isWatching(film.title) &&
                                        <Button
                                            size="big"
                                            color="purple"
                                            className="film-component-button-restart"
                                            onClick={async () => {
                                                await resetFilmProgress(film.title);
                                                await new Promise(resolve => setTimeout(resolve, 100));
                                                handleWathNowClick(film);
                                            }}
                                        >
                                            <Icon className="undo-icon" name="undo alternate"/>
                                        </Button>
                                    }

                                    <Button size="big" color="grey" className="film-component-button" loading={filmStore.userListChanging[film.id]}
                                            onClick={() =>
                                                filmStore.userFilmList.length > 0 && someIncluded(film)
                                                    ? handleRemoveFilmClick(film)
                                                    : handleAddFilmClick(film)
                                            }
                                    >
                                        <Icon className={filmStore.userFilmList.length > 0 && someIncluded(film) ? 'remove' : 'add circle'}/>
                                        {filmStore.userFilmList.length > 0 && someIncluded(film) ? findTranslation('removeList', language) : findTranslation('addList', language)}
                                    </Button>
                                </div>
                            </Segment>
                            <p className='film-details-title'>{findTranslation("details", language)}</p>
                            <div className='film-details-divider'/>
                            <Segment className="film-component-info-container">
                                <p className='film-details-info-title'>{findTranslation('ratingInfo', language)}</p>
                                <p className='film-details-info-desc' style={{display: 'inline-flex', alignItems: 'center'}}>
                                    <Image className="film-age-desc" src={`/image/age/${film.age}.png`} alt={`Age restriction ${film.age}`}/>
                                    {film.age === 0 && findTranslation('0', language)}
                                    {film.age === 10 && findTranslation('10', language)}
                                    {film.age === 12 && findTranslation('12', language)}
                                    {film.age === 14 && findTranslation('14', language)}
                                    {film.age === 16 && findTranslation('16', language)}
                                    {film.age === 18 && findTranslation('18', language)}
                                </p>

                                <p className='film-details-info-title'>{findTranslation('subtitleLanguages', language)}</p>
                                <p className='film-details-info-desc'>{findTranslation("english", language)}, {findTranslation("portugueseBrazil", language)}</p>

                                <p className='film-details-info-title'>{findTranslation('audioLanguages', language)}</p>
                                <p className='film-details-info-desc'>{findTranslation(film.language, language)} - Original</p>

                                <p className='film-details-info-title'>{findTranslation('directors', language)}</p>
                                <p className='film-details-info-desc'>
                                    {film.directors.split(',').map((director, index) => (
                                        <React.Fragment key={index}>
                                              <span style={{cursor: 'pointer', textDecoration: 'underline'}}
                                                    onClick={() => filmStore.doSearch(director.trim())}>
                                                {director.trim()}
                                              </span>
                                            {index < film.directors.split(',').length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <p className='film-details-info-title'>{findTranslation('producers', language)}</p>
                                <p className='film-details-info-desc'>
                                    {film.producers.split(',').map((producer, index) => (
                                        <React.Fragment key={index}>
                                              <span style={{cursor: 'pointer', textDecoration: 'underline'}}
                                                    onClick={() => filmStore.doSearch(producer.trim())}>
                                                {producer.trim()}
                                              </span>
                                            {index < film.producers.split(',').length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <p className='film-details-info-title'>{findTranslation('cast', language)}</p>
                                <p className='film-details-info-desc'>
                                    {film.cast.split(',').map((actor, index) => (
                                        <React.Fragment key={index}>
                                              <span style={{cursor: 'pointer', textDecoration: 'underline'}}
                                                    onClick={() => filmStore.doSearch(actor.trim())}>
                                                {actor.trim()}
                                              </span>
                                            {index < film.cast.split(',').length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </Segment>
                        </Segment>
                    </div>
                </div>
            )}
        </>
    );
};

export default observer(FilmDetailsContent);