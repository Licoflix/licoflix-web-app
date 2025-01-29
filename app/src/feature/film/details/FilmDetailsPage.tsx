import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../app/store/store';
import FilmDetailsContent from './FilmDetailsContent';

const FilmDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { filmStore: { film, getFilm, setFilm } } = useStore();

    useEffect(() => {
        if (id) {
            setFilm(null);
            getFilm(id);
        }
    }, [id]);

    return (
        <div className="film-page">
            <FilmDetailsContent key={id} film={film} />
        </div>
    );
};

export default observer(FilmDetailsPage);