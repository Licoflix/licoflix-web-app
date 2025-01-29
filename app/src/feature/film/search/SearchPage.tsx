import { observer } from 'mobx-react-lite';
import { useEffect } from "react";
import { Icon, Image, Input, Segment } from "semantic-ui-react";
import { findTranslation } from '../../../app/common/language/translations';
import { Film } from '../../../app/model/Film';
import { useStore } from '../../../app/store/store';
import { useNavigate } from 'react-router-dom';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { commonStore: { language } } = useStore();
    const { filmStore: { list, filteredFilms, searchTerm, setSearchTerm, setFilteredFilms } } = useStore();


    const handleFilmClick = (film: Film) => {
        navigate(`/film/${film.id}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search: string = e.target.value
        setSearchTerm(search);
        if (search && search.trim() !== '')
            list(1, null, (search), true);
        else
            setFilteredFilms(null)
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (searchTerm != '')
                list(1, null, searchTerm);
        }
    };

    useEffect(() => {
        setSearchTerm(null)
        setFilteredFilms(null)
    }, []);

    return (
        <Segment className="home-page" id="home">
            <Input
                size="large"
                value={searchTerm || ''}
                className='search-input'
                style={{ width: '25vw' }}
                onKeyPress={handleKeyPress}
                onChange={handleSearchChange}
                placeholder={`${findTranslation('Search', language)}...`}
                icon={<Icon name='search' link onClick={() => { list(1, null, searchTerm) }} />}
            />

            <div>
                {filteredFilms && filteredFilms.length > 0 ? (
                    <div className='search-page-segment'>
                        {filteredFilms.map((film: Film, index: number) => (
                            <div className='search-card-film-container' key={index}>
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
                                </Segment>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                    </>
                )}
            </div>
        </Segment>
    );
};

export default observer(SearchPage);