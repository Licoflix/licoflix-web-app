import { makeAutoObservable, reaction } from "mobx";
import { Link } from "react-router-dom";
import { ErrorResponse } from "../../model/ErrorResponse";
import { store } from "../store";

export default class CommonStore {
    loading = false;
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
                store.filmStore.listNewFilms(),
                store.filmStore.listUserFilmList(),
                store.filmStore.listGroupedFilms(),
                store.filmStore.getFilmCategories(),
                store.playerStore.loadContinueWatchingList(),
                store.filmStore.listAutoCarrousselFilms(1, 5),
            ]);
        }
    };

    scrollTop = (key: string) => {
        if (key) {
            const container = document.querySelector(`#${key}`);
            if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

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
        if (loading == false)
            await new Promise(resolve => setTimeout(resolve, 100));
        this.loading = loading;
    }

    scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    generateBreadcrumb(pathnames: string[]) {
        const breadcrumb = pathnames.map((name, index) => {
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

        return breadcrumb;
    }
}