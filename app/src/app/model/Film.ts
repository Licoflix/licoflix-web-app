import { BaseEntity } from "./BaseEntity";

export interface Film extends BaseEntity {
    id: number;
    age: number;
    year: number;
    imdb: string;
    saga: string;
    path: string;
    cast: string;
    title: string;
    image: string;
    oscars: number;
    language: string;
    duration: string;
    directors: string;
    producers: string;
    background: string;
    description: string;
    baftaAwards: number;
    goldenGlobes: number;
    categories: string[];
    originalTitle: string;
}

export interface FilmCategoryGroup {
    category: string;
    films: Film[];
}

export interface FilmRequest {
    saga: string;
    cast: string;
    title: string;
    language: string;
    duration: string;
    imdb: number | 0;
    directors: string;
    producers: string;
    oscars: number | 0;
    id?: number | null;
    age: number | null;
    year: number | null;
    description: string;
    categories: string[];
    subtitle: File | null;
    originalTitle: string;
    subtitleEn: File | null;
    baftaAwards: number | 0;
    goldenGlobes: number | 0;
    film: File | null | undefined;
    image: File | null | undefined;
    background: File | null | undefined;
}