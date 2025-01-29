import { DataListResponse } from "../model/DataListResponse";

export interface IBaseStore<T> {
    xls?: () => void;
    searchTerm?: string | null;
    entityList?: DataListResponse<T>;
    reactivate?: (id: string) => void;
    deleteEntity?: (id: string) => void;
    setSearchTerm?: (search: string) => void;
    list?: (page?: any, pageSize?: any, search?: any, searchPage?: boolean, dontNeedLoad?: boolean, searchTable?: boolean | null) => void;
}