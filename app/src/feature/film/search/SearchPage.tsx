import { observer } from 'mobx-react-lite';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon, Image, Input, Loader, Segment } from "semantic-ui-react";
import { findTranslation } from '../../../app/common/language/translations';
import { Film } from '../../../app/model/Film';
import { useStore } from '../../../app/store/store';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { commonStore: { language } } = useStore();
    const { filmStore: { listFiltredFilms, filteredFilms, searchTerm, setSearchTerm, setFilteredFilms } } = useStore();

    const handleFilmClick = (film: Film) => {
        navigate(`/film/${film.id}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search: string = e.target.value;
        setSearchTerm(search);
    };

    const handleSearch = async () => {
        setCurrentPage(1);
        setFilteredFilms(null);
        setLoading(true);
        await listFiltredFilms(1, 10, searchTerm);
        setLoading(false);
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await handleSearch();
        }
    };

    const loadNextPage = async () => {
        if (loading || !filteredFilms || currentPage >= filteredFilms.totalPages) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        await listFiltredFilms(nextPage, 10, searchTerm);
        setLoading(false);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const bottom = e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
        if (bottom) {
            loadNextPage();
        }
    };

    useEffect(() => {
        setSearchTerm(null);
        setFilteredFilms(null);
    }, [setSearchTerm, setFilteredFilms]);

    return (
        <Segment className="home-page" id="home" style={{ overflowY: 'auto' }} onScroll={handleScroll}>
            <Input
                size="large"
                className='search-input'
                value={searchTerm || ''}
                onKeyPress={handleKeyPress}
                onChange={handleSearchChange}
                placeholder={`${findTranslation('Search', language)}...`}
                icon={<Icon name='search' link onClick={handleSearch} />}
            />

            <div>
                {loading && currentPage === 1 ? (
                    <Loader className='loader-search-films' active size='huge' inline='centered' />
                ) : (
                    filteredFilms && filteredFilms.totalElements > 0 ? (
                        <div className='search-page-segment'>
                            {filteredFilms.data.map((film: Film, index: number) => (
                                <div className='search-card-film-container' key={index}>
                                    <Segment
                                        key={index}
                                        className="film-card"
                                        onClick={() => handleFilmClick(film)}
                                    >
                                        <Image
                                            className="film-image"
                                            src={`data:image/jpeg;base64,${film.image}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease', zIndex: 1 }}
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
                        <></>
                    )
                )}
            </div>

            {loading && currentPage > 1 && (
                <Loader style={{marginTop: '3vh', marginBottom:"3vh"}} active size='huge' inline='centered' />
            )}
        </Segment>
    );
};

export default observer(SearchPage);