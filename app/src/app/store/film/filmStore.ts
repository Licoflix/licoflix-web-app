import JSZip from 'jszip';
import { makeAutoObservable, runInAction } from "mobx";
import { Category } from "../../model/Category";
import { DataListResponse } from "../../model/DataListResponse";
import { Film, FilmCategoryGroup } from "../../model/Film";
import service from "../../service/service";
import { IBaseStore } from "../IBaseStore";

export default class FilmStore implements IBaseStore<Film> {
    searchTerm: any;
    film: Film | any;
    userFilmList: Film[] = [];
    categories: Category[] = [];
    continueWathingList: Film[] = [];
    autoCarrousselfilms: Film[] = [];
    groupedFilms: FilmCategoryGroup[] | null = null;
    userListChanging: { [filmId: number]: boolean } = {};
    allFilms: DataListResponse<Film> = { data: [], totalElements: 0, totalPages: 0, };
    entityList: DataListResponse<Film> = { data: [], totalElements: 0, totalPages: 0, };
    newFilmsList: DataListResponse<Film> = { data: [], totalElements: 0, totalPages: 0, };
    filteredFilms: DataListResponse<Film> = { data: [], totalElements: 0, totalPages: 0, };

    constructor() {
        makeAutoObservable(this);
    }

    getFilmCategories = async (): Promise<void> => {
        if (this.categories.length === 0) {
            const response = await service.category.list();
            runInAction(() => {
                this.categories = response.data;
            });
        }
    };

    listGroupedFilms = async (force?: boolean) => {
        if (this.groupedFilms === null || force) {
            const response = await service.film.listGrouped();
            runInAction(() => {
                this.groupedFilms = response.data;
            });
        }
    };

    list = async (page?: any, pageSize?: any, search?: any, searchTable?: boolean | null) => {
        if (!this.entityList || this.entityList.data.length === 0 || searchTable) {
            const response = await service.film.list(page, pageSize, search);
            runInAction(() => {
                this.entityList = response;
            });
        }
    };

    listNewFilms = async () => {
        const response = await service.film.list(1, 15);
        runInAction(() => {
            this.newFilmsList = response;
        });
    };

    listFiltredFilms = async (page?: any, pageSize?: any, search?: any) => {
        const response = await service.film.list(page, pageSize, search);
        runInAction(() => {
            if (page === 1 || !this.filteredFilms) {
                this.filteredFilms = response;
            } else {
                this.filteredFilms.data = [...this.filteredFilms.data, ...response.data];
                this.filteredFilms.totalPages = response.totalPages;
                this.filteredFilms.totalElements = response.totalElements;
            }
        });
    };

    listContinueWathingFilms = async (force?: boolean) => {
        if (this.allFilms.totalElements === 0 || force) {
            const response = await service.film.list();
            runInAction(() => {
                this.allFilms = response;
            });
            await this.getWatchingFilmsList(force);
        } else
            return
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
            await this.listGroupedFilms(true);
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

    getWatchingFilmsList = (force?: boolean) => {
        if (this.allFilms.totalElements > 0 || force) {
            this.continueWathingList = this.allFilms.data.filter((film) => {
                return localStorage.getItem("film-duration-" + film.title);
            });
        }
    }
}