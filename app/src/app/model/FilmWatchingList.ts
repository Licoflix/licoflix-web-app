import { Film } from "./Film";

export interface FilmWatchingList {
    id: number;
    film: Film;
    user: number;
    current: string;
    duration: string;
}