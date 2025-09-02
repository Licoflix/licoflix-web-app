import JSZip from 'jszip';
import {makeAutoObservable, runInAction} from "mobx";
import {Category} from "../../model/Category";
import {DataListResponse} from "../../model/DataListResponse";
import {Film, FilmCategoryGroup} from "../../model/Film";
import service from "../../service/service";
import {IBaseStore} from "../IBaseStore";
import {findTranslation} from "../../common/language/translations.ts";
import {store} from "../store.tsx";
import {router} from "../../router/Route.tsx";
import {debounce} from "lodash";

export default class FilmStore implements IBaseStore<Film> {
    searchTerm: any;
    film: Film | any;
    newFilms: Film[] = [];
    userFilmList: Film[] = [];
    categories: Category[] = [];
    continueWatchingList: Film[] = [];
    groupedFilms: FilmCategoryGroup[] | null = null;
    groupedSagaFilms: FilmCategoryGroup[] | null = null;
    userListChanging: { [filmId: number]: boolean } = {};
    entityList: DataListResponse<Film> = {data: [], totalElements: 0, totalPages: 0,};
    filteredFilms: DataListResponse<Film> = {data: [], totalElements: 0, totalPages: 0,};
    loadingPages: Map<string, boolean> = new Map();
    noMorePages: Map<string, boolean> = new Map();

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
            if (!this.categories || this.categories.length === 0) {
                await this.getFilmCategories();
            }

            const groupedFilmsResult = await Promise.all(
                this.categories.map(async (category) => {
                    const response = await service.film.listGrouped(page, 10, category.name);
                    if (!response?.data) return null;

                    const seen = new Set<number>();
                    const films = response.data
                        .map((item) => item.films)
                        .flat()
                        .filter((film) => !seen.has(film.id) && seen.add(film.id));

                    return {category: category.name, films};
                })
            );

            const newGroupedFilms = (groupedFilmsResult.filter(Boolean) as FilmCategoryGroup[])
                .sort((a, b) =>
                    findTranslation(a.category, store.commonStore.language)
                        .localeCompare(findTranslation(b.category, store.commonStore.language))
                );

            runInAction(() => {
                const existing = this.groupedFilms || [];
                const merged = page === 1 ? [] : [...existing];

                newGroupedFilms.forEach((group) => {
                    const existingGroup = merged.find((g) => g.category === group.category);
                    if (existingGroup) {
                        const seen = new Set(existingGroup.films.map((f) => f.id));
                        existingGroup.films.push(
                            ...group.films.filter((f) => !seen.has(f.id) && seen.add(f.id))
                        );
                    } else {
                        merged.push(group);
                    }
                });

                this.groupedFilms = merged;
            });
        }
    };

    listGroupedSagaFilms = async () => {
        if (this.groupedSagaFilms === null) {
            const response = await service.film.listGroupedSagaFilms();

            const grouped = response.data
                .map((group) => {
                    const translatedCategory = findTranslation(group.category, store.commonStore.language);
                    const translatedFilms = group.films.map((film) => ({
                        ...film,
                        category: translatedCategory,
                    }));
                    return {
                        category: translatedCategory,
                        films: translatedFilms,
                    };
                })
                .sort((a, b) => a.category.localeCompare(b.category));

            runInAction(() => {
                this.groupedSagaFilms = grouped;
            });
        }
    };

    loadMoreFilmsByCategory = debounce(async (category: string) => {
        if (!this.groupedFilms) return;

        if (this.noMorePages.get(category)) return;

        if (this.loadingPages.get(category)) return;
        this.loadingPages.set(category, true);

        try {
            const categoryGroup = this.groupedFilms.find(group => group.category === category);
            if (!categoryGroup) return;

            const currentPage = Math.ceil(categoryGroup.films.length / 10);
            const nextPage = currentPage + 1;

            const response = await service.film.listGrouped(nextPage, 10, category);

            if (!response?.data || response.data.length === 0) {
                this.noMorePages.set(category, true);
                return;
            }

            runInAction(() => {
                const filmsResponse = Array.isArray(response.data)
                    ? response.data.flatMap(item => item.films || [])
                    : [];

                const existingIds = new Set(categoryGroup.films.map(f => f.id));
                const uniqueFilms = filmsResponse.filter(f => !existingIds.has(f.id) && existingIds.add(f.id));

                if (uniqueFilms.length > 0) {
                    this.groupedFilms = this.groupedFilms!.map(group =>
                        group.category === category
                            ? {...group, films: [...group.films, ...uniqueFilms]}
                            : group
                    );
                } else {
                    this.noMorePages.set(category, true);
                }
            });
        } finally {
            this.loadingPages.set(category, false);
        }
    }, 500);

    list = async (page?: any, pageSize?: any, search?: any, searchTable?: boolean | null, orderBy?: any, direction?: any) => {
        if (!this.entityList || searchTable) {
            const response = await service.film.list(page, pageSize, search, orderBy, direction);
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

    listNewFilms = async (page: any, pageSize: any, searchTable?: boolean) => {
        if (this.newFilms.length === 0 || searchTable) {
            const response = await service.film.list(page, pageSize, '', 'id', 'DESC',);
            runInAction(() => {
                this.newFilms = response.data;
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

    doSearch(director: any) {
        this.setSearchTerm(director);
        this.listFiltredFilms(1, 10, director, '', 'DESC').then(() => router.navigate("/search"));
    }
}