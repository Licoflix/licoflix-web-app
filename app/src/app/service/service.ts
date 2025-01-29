import axios, { AxiosError, AxiosResponse } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Category } from '../model/Category';
import { DataListResponse } from '../model/DataListResponse';
import { DataResponse } from '../model/DataResponse';
import { Film, FilmCategoryGroup } from '../model/Film';
import { UserFormValues, UserResponse } from '../model/UserResponse';
import { store } from '../store/store';
import ErrorHandler from './error-handler';

const filmModule = '/film';
const authModule = '/auth';
const userModule = '/auth/user';
const userFilmListModule = '/film/user/list';

const BASE_URL_AUTH_USER = 'http://26.128.44.247:8081';
const BASE_URL_FILM_CATEGORY = 'http://26.128.44.247:8080';

const response = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (config.headers) {
        if (token) {
            config.headers.Authorization = `${token}`;
        }

        if (timezone) {
            config.headers.Timezone = timezone;
        }
    }

    return config;
}, (error: any) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => {
        return response;
    },
    (error: AxiosError<any>) => {
        return ErrorHandler.handleError(error, store.commonStore.language);
    }
);

const requests = {
    get: <T>(url: string, baseURL: string = axios.defaults.baseURL ?? '') => axios.get<T>(baseURL + url).then(response),
    delete: <T>(url: string, baseURL: string = axios.defaults.baseURL ?? '') => axios.delete<T>(baseURL + url).then(response),
    put: <T>(url: string, body?: {}, baseURL: string = axios.defaults.baseURL ?? '') => axios.put<T>(baseURL + url, body).then(response),
    post: <T>(url: string, body: {}, baseURL: string = axios.defaults.baseURL ?? '') => axios.post<T>(baseURL + url, body).then(response),
    xls: (url: string, type?: string, baseURL: string = axios.defaults.baseURL ?? ''): Promise<Blob> => axios.get(`${baseURL + url}/xls${type ? `?type=${type}` : ''}`, { responseType: 'blob' }).then(response),
};

const film = {
    xls: (type: string) => requests.xls(filmModule, type, BASE_URL_FILM_CATEGORY),
    get: (id: string) => requests.get<DataResponse<Film>>(`${filmModule}/${id}`, BASE_URL_FILM_CATEGORY),
    delete: (id: any) => requests.delete<DataResponse<Film>>(filmModule + `/${id}`, BASE_URL_FILM_CATEGORY),
    create: (formData: FormData) => requests.post<DataResponse<Film>>(`${filmModule}`, formData, BASE_URL_FILM_CATEGORY),
    listGrouped: () => requests.get<DataListResponse<FilmCategoryGroup>>(`${filmModule}/grouped`, BASE_URL_FILM_CATEGORY),
    list: (page?: number, pageSize?: number, search?: string, category?: string) => requests.get<DataListResponse<Film>>(`${filmModule}?page=${page ?? 1}&pageSize=${pageSize ?? 2147483647}&search=${search ?? ''}&category=${category ?? ''}`, BASE_URL_FILM_CATEGORY),
};

const category = {
    list: () => requests.get<DataListResponse<Category>>(`${filmModule}/category`, BASE_URL_FILM_CATEGORY),
};

const auth = {
    edit: (user: UserFormValues) => requests.put<UserResponse>(authModule + '/edit', user, BASE_URL_AUTH_USER).then((response) => { return response }),
    login: (user: UserFormValues) => requests.post<UserResponse>(authModule + '/login', user, BASE_URL_AUTH_USER).then((response) => { return response }),
    register: (user: UserFormValues) => requests.post<UserResponse>(authModule + '/register', user, BASE_URL_AUTH_USER).then((response) => { return response }),
};

const user = {
    remove: (id: any) => requests.delete<void>(userModule + `/${id}`, BASE_URL_AUTH_USER),
    get: () => requests.get<DataResponse<UserResponse>>(userModule + '/get', BASE_URL_AUTH_USER),
    list: (page: number, pageSize?: number, search?: string) => requests.get<DataListResponse<UserResponse>>(`${userModule}?page=${page}&pageSize=${pageSize ?? 10}&search=${search ?? ''}`, BASE_URL_AUTH_USER),
};

const filmList = {
    add: (id: any) => requests.post<void>(userFilmListModule + `/${id}`, {}, BASE_URL_FILM_CATEGORY),
    remove: (id: any) => requests.delete<void>(userFilmListModule + `/${id}`, BASE_URL_FILM_CATEGORY),
    list: () => requests.get<DataListResponse<Film>>(`${userFilmListModule}`, BASE_URL_FILM_CATEGORY),
}

const service = { film, filmList, category, auth, user }

export default service;