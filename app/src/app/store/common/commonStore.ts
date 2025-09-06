import {makeAutoObservable, reaction} from "mobx";
import {Link} from "react-router-dom";
import {ErrorResponse} from "../../model/ErrorResponse";
import {store} from "../store";

export default class CommonStore {
    loading = false;
    activeItem: string | null = null;
    language: 'ptbr' | 'en' = 'ptbr';
    error: ErrorResponse | null = null;
    token: string | null = localStorage.getItem('jwt');

    constructor() {
        makeAutoObservable(this);
        this.getLanguageFromLocalStorage();

        reaction(
            () => this.token, token => {
                if (token) {
                    localStorage.setItem('jwt', token)
                } else {
                    localStorage.removeItem('jwt')
                }
            }
        )
    }

    initApp = async () => {
        if (this.token) {
            await Promise.all([
                store.filmStore.listUserFilmList(),
                store.filmStore.listGroupedFilms(1, true),
                store.playerStore.loadContinueWatchingList(),
                store.filmStore.listNewFilms(1, 10),
                store.filmStore.listGroupedSagaFilms(),
            ]);
        }
    };

    changeLanguage = (language: 'ptbr' | 'en') => {
        localStorage.setItem('language', language);
        this.getLanguageFromLocalStorage();
    }

    getLanguageFromLocalStorage() {
        const languageFromLocalStorage = localStorage.getItem('language');
        if (languageFromLocalStorage === 'ptbr' || languageFromLocalStorage === 'en') {
            this.language = languageFromLocalStorage;
        }
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setLoading = async (loading: boolean) => {
        if (!loading)
            await new Promise(resolve => setTimeout(resolve, 100));
        this.loading = loading;
    }

    generateBreadcrumb(pathnames: string[]) {
        return pathnames.map((name, index) => {
            const path = `/${pathnames.slice(0, index + 1).join('/')}`;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return {
                key: name,
                content: name,
                link: index !== pathnames.length - 1,
                as: Link,
                to: path
            };
        });
    }

    setActiveItem = (item: string | null) => {
        this.activeItem = item;
    };
}