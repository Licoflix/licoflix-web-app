import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Icon, Image, Segment} from "semantic-ui-react";
import {findTranslation} from "../../app/common/language/translations";
import {Film} from "../../app/model/Film";
import {useStore} from "../../app/store/store";

interface FilmAutoCarouselPageProps {
    films: Film[] | null;
}

const FilmAutoCarouselPage: React.FC<FilmAutoCarouselPageProps> = ({films}) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const {commonStore: {language}, filmStore} = useStore();

    const handleFilmClick = (film: Film) => {
        navigate(`/film/${film.id}`);
    };

    const handleAddFilmClick = (film: Film) => {
        filmStore.addFilmInUserList(film.id);
    };

    const handleRemoveFilmClick = (film: Film) => {
        filmStore.removeFilmInUserList(film.id);
    };

    const someIncluded = (film: Film) => filmStore.userFilmList.some((userFilm) => userFilm.id === film.id);

    useEffect(() => {
        if (films && films.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % films.length);
            }, 8000);

            return () => clearInterval(interval);
        }
    }, [films]);

    return (
        <Segment className="film-auto-carousel">
            <div className="carousel-container" style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                {films?.map((film, index) => (
                    <div key={index} className="carousel-item">
                        <div
                            className="auto-image"
                            style={{
                                backgroundImage: `url(data:image/jpeg;base64,${film.background})`
                            }}
                        />
                        <div className="overlay-content">
                            <p className='overlay-title'>
                                {film.title.replace(/\(\d{4}\)/g, "")}
                            </p>
                            <p className='overlay-category'>
                                {film.categories.map((category) => findTranslation(category, language)).join(', ')}
                            </p>
                            <div className='overlay-inline-content'>
                                <Image className="film-age-overlay" src={`/image/age/${film.age}.png`}/>
                                <p className="overlay-inline-text" style={{marginRight: '15px', marginLeft: '15px'}}>
                                    {film.duration}
                                </p>
                                <p className="overlay-inline-text">{film.year}</p>
                            </div>
                            <div className="film-overlay-buttons">
                                <Button onClick={() => handleFilmClick(film)} size='big' className="film-overlay-button" color='purple'>
                                    <Icon className='plus-icon' name="eye"/>
                                    {findTranslation('details', language)}
                                </Button>
                                <Button size="big" color="grey" className="add-list-button-overlay" loading={filmStore.userListChanging[film.id] || false}
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
                        </div>
                    </div>
                ))}
            </div>
        </Segment>

    );
};

export default observer(FilmAutoCarouselPage);