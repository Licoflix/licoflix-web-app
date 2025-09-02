import {observer} from 'mobx-react-lite';
import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Dropdown, Icon, Image, Input, Loader, Segment} from "semantic-ui-react";
import {findTranslation} from '../../../app/common/language/translations';
import {Film} from '../../../app/model/Film';
import {useStore} from '../../../app/store/store';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {commonStore: {language}} = useStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [orderBy, setOrderBy] = useState<string>("id");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const {filmStore: {listFiltredFilms, filteredFilms, searchTerm, setSearchTerm, setFilteredFilms}} = useStore();

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
        await listFiltredFilms(1, 10, searchTerm, orderBy, orderDirection);
        setLoading(false);
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await handleSearch();
        }
    };

    const loadNextPage = async () => {
        setLoading(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);

        await listFiltredFilms(nextPage, 10, searchTerm, orderBy, orderDirection);
        setLoading(false);
    };

    const handleScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;
        const bottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (bottom) {
            await loadNextPage();
        }
    };

    const handleOrderByChange = async (value: string) => {
        setLoading(true);
        setOrderBy(value);
        setCurrentPage(1);
        setFilteredFilms(null);
        await listFiltredFilms(1, 10, searchTerm, value, orderDirection);
        setLoading(false);
    };

    const toggleOrderDirection = async () => {
        const newDirection = orderDirection === "asc" ? "desc" : "asc";
        setOrderDirection(newDirection);

        setCurrentPage(1);
        await listFiltredFilms(1, 10, searchTerm, orderBy, newDirection);
    };

    const orderOptions = [
        {key: 'year', text: findTranslation('Year', language), value: 'year'},
        {key: 'imdb', text: findTranslation('IMDb', language), value: 'imdb'}
    ];

    return (
        <Segment className="home-page" id="home" style={{overflowY: 'auto'}} onScroll={handleScroll}>
            <div className='search-header'>
                <Input
                    size="large"
                    className='search-input'
                    value={searchTerm || ''}
                    onKeyPress={handleKeyPress}
                    onChange={handleSearchChange}
                    placeholder={`${findTranslation('Search', language)}...`}
                    icon={<Icon name='search' link onClick={handleSearch}/>}
                    style={{flex: 1, marginRight: '10px'}}
                />

                <div className='order-by-container'>
                    <Dropdown
                        compact
                        selection
                        icon={null}
                        value={orderBy}
                        options={orderOptions}
                        className='order-by-dropdown'
                        placeholder={findTranslation('OrderBy', language)}
                        onChange={(_e, data) => handleOrderByChange(data.value as string)}
                    />
                    <Icon
                        link
                        className='order-icon'
                        onClick={toggleOrderDirection}
                        name={orderDirection === "asc" ? "sort amount up" : "sort amount down"}
                    />
                </div>
            </div>

            <div>
                {loading && currentPage === 1 ? (
                    <Loader className='loader-search-films' active size='huge' inline='centered'/>
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
                                            style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease', zIndex: 1}}
                                        />

                                        <div className="film-hover-container">
                                            <div className='film-hover-content'>
                                                <Image
                                                    className="film-hover-image"
                                                    src={`data:image/jpeg;base64,${film.background}`}
                                                />
                                                <div className="film-hover-title">{film.title.replace(/\(\d{4}\)/g, "").trim()}</div>
                                                <div className="film-hover-age">
                                                    <Image className='film-age-hover' src={`/image/age/${film.age}.png`} alt={`Age restriction ${film.age}`}/>
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
                <div className="dots-loader-container">
                    <div className="dots-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </Segment>
    );
};

export default observer(SearchPage);