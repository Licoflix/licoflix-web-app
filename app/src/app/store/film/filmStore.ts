import JSZip from 'jszip';
import {makeAutoObservable, runInAction} from "mobx";
import {Category} from "../../model/Category";
import {DataListResponse} from "../../model/DataListResponse";
import {Film, FilmCategoryGroup} from "../../model/Film";
import service from "../../service/service";
import {IBaseStore} from "../IBaseStore";
import {findTranslation} from "../../common/language/translations.ts";
import {store} from "../store.tsx";

export default class FilmStore implements IBaseStore<Film> {
    searchTerm: any;
    film: Film | any;
    userFilmList: Film[] = [];
    categories: Category[] = [];
    continueWatchingList: Film[] = [];
    autoCarrousselfilms: Film[] = [];
    groupedFilms: FilmCategoryGroup[] | null = null;
    userListChanging: { [filmId: number]: boolean } = {};
    entityList: DataListResponse<Film> = {data: [], totalElements: 0, totalPages: 0,};
    filteredFilms: DataListResponse<Film> = {data: [], totalElements: 0, totalPages: 0,};

    constructor() {
        makeAutoObservable(this);
    }

    getFilmCategories = async () => {
        if (this.categories.length === 0) {
            const response = await service.category.list();
            runInAction(() => {
                this.categories = response.data;
            });
        }
    };

    listGroupedFilms = async (page: number, force?: boolean) => {
        if ((this.groupedFilms === null || force) && page) {
            await this.getFilmCategories();
            const categoryPromises = this.categories.map(async (category) => {
                const response = await service.film.listGrouped(page, 10, category.name);
                return response && response.data ? {
                    category: category.name,
                    films: response.data.map((item) => item.films).flat()
                } : null;
            });

            const groupedFilmsResult = await Promise.all(categoryPromises);
            const newGroupedFilms = groupedFilmsResult.filter((group) => group !== null) as FilmCategoryGroup[];
            newGroupedFilms.sort((a, b) => findTranslation(a.category, store.commonStore.language)
                .localeCompare(findTranslation(b.category, store.commonStore.language)));

            runInAction(() => {
                this.groupedFilms = page === 1 ? newGroupedFilms : [...(this.groupedFilms || []), ...newGroupedFilms];
            });
        }
    };

    loadMoreFilmsByCategory = async (category: string) => {
        if (!this.groupedFilms) return;

        const categoryGroup = this.groupedFilms.find(group => group.category === category);
        if (!categoryGroup) return;

        const currentPage = Math.ceil(categoryGroup.films.length / 10);
        const nextPage = currentPage + 1;

        if (nextPage > currentPage) {
            const response = await service.film.listGrouped(nextPage, 10, category);
            if (response.data && response.totalElements > 0) {
                runInAction(() => {
                    const newCategoryGroup = response.data.find(group => group.category === category);

                    if (newCategoryGroup) {
                        this.groupedFilms = this.groupedFilms?.map(group => {
                            if (group.category === category) {
                                return {...group, films: [...group.films, ...newCategoryGroup.films]};
                            }
                            return group;
                        }) || [];
                    }
                });
            }
        }
    };

    list = async (page?: any, pageSize?: any, search?: any, searchTable?: boolean | null) => {
        if (!this.entityList || searchTable) {
            const response = await service.film.list(page, pageSize, search);
            runInAction(() => {
                this.entityList = response;
            });
        }
    };

    listFiltredFilms = async (page?: any, pageSize?: any, search?: any, orderBy?: any, direction?: any) => {
        const response = await service.film.list(page, pageSize, search, orderBy, direction);
        await new Promise(resolve => setTimeout(resolve, 1500));
        runInAction(() => {
            if (page === 1) {
                this.filteredFilms = response;
            } else {
                const existingIds = new Set(this.filteredFilms.data.map(film => film.id));
                const newFilms = response.data.filter(film => !existingIds.has(film.id));
                this.filteredFilms.data = [...this.filteredFilms.data, ...newFilms];
                this.filteredFilms.totalPages = response.totalPages;
                this.filteredFilms.totalElements = response.totalElements;
            }
        });
    };

    getFilm = async (long: string): Promise<void> => {
        const response = await service.film.get(long);
        runInAction(() => {
            this.film = response.data;
        });
    };

    setFilm = (film: any) => {
        this.film = film;
    }

    deleteEntity = async (id: any) => {
        await service.film.delete(id);
        await runInAction(async () => {
            await this.list(1, 10, undefined, true);
        });
    }

    xls = async () => {
        const response = await service.film.xls("Film");
        const zip = await JSZip.loadAsync(response);
        const fileName = Object.keys(zip.files)[0];
        const xlsxFile = zip.files[fileName];

        const xlsxBlob = await xlsxFile.async('blob');
        const xlsxUrl = window.URL.createObjectURL(xlsxBlob);

        const link = document.createElement('a');
        link.href = xlsxUrl;
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(xlsxUrl);
    };


    setSearchTerm = (search: any) => {
        this.searchTerm = search;
    }

    setFilteredFilms = (films: any) => {
        this.filteredFilms = films;
    }

    addFilmInUserList = async (film: number) => {
        this.userListChanging[film] = true;
        await service.filmList.add(film).finally(async () => {
            await this.listUserFilmList(true);
            this.userListChanging[film] = false;
        });
    }

    removeFilmInUserList = async (film: number) => {
        this.userListChanging[film] = true;
        await service.filmList.remove(film).finally(async () => {
            await this.listUserFilmList(true);
            this.userListChanging[film] = false;
        })
    }

    listAutoCarrousselFilms = async (page: any, pageSize: any, searchTable?: boolean) => {
        if (this.autoCarrousselfilms.length === 0 || searchTable) {
            const response = await service.film.list(page, pageSize);
            runInAction(() => {
                this.autoCarrousselfilms = response.data;
            });
        }

    };

    listUserFilmList = async (force?: boolean) => {
        if (this.userFilmList.length === 0 || force) {
            const response = await service.filmList.list();
            runInAction(() => {
                this.userFilmList = response.data;
            });

        }
    }
}