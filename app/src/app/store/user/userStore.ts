import { makeAutoObservable, runInAction } from "mobx";
import { DataListResponse } from "../../model/DataListResponse";
import { UserFormValues, UserResponse } from "../../model/UserResponse";
import { router } from "../../router/Route";
import service from "../../service/service";
import { IBaseStore } from "../IBaseStore";
import { store } from "../store";

export default class UserStore implements IBaseStore<UserResponse> {
    searchTerm: string | null = '';
    onlyDeletedFilter: boolean = false;
    entity: UserResponse | undefined | null = null;
    entityList: DataListResponse<UserResponse> = { data: [], totalElements: 0, totalPages: 0, };

    constructor() {
        makeAutoObservable(this);
    }

    setDeletedFilter = (bool: boolean) => {
        this.onlyDeletedFilter = bool;
    }

    setSearchTerm = (text: string) => {
        this.searchTerm = text;
    }

    login = async (creds: UserFormValues) => {
        store.commonStore.setLoading(true);
        store.commonStore.setToken(null);

        try {
            const entity = await service.auth.login(creds);
            runInAction(() => this.entity = entity.data);
            store.commonStore.setToken(entity.data.token);
            router.navigate("/films");
        } catch {
            store.commonStore.setLoading(false);
            router.navigate("/login");
        } finally {
            store.commonStore.setLoading(true);
            await store.commonStore.initApp();
            store.commonStore.setLoading(false);
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.entity = null;
        router.navigate('/login');
    }

    register = async (creds: UserFormValues, overwriteToken: boolean) => {
        try {
            store.commonStore.setLoading(true);
            if (overwriteToken)
                store.commonStore.setToken(null);
            const entity = await service.auth.register(creds);

            runInAction(() => {
                this.entity = entity.data;
                this.list(1, null);
            });

            if (overwriteToken)
                store.commonStore.setToken(entity.data.token);
            if (overwriteToken)
                router.navigate("/films");
            store.commonStore.setLoading(false);
        } catch {
            store.commonStore.setLoading(false);
            router.navigate("/register");
        }
    }

    edit = async (creds: UserFormValues) => {
        await service.auth.edit(creds);
        runInAction(() => {
            this.list(1, null);
        });
    }

    list = async (page?: any, pageSize?: any, search?: string) => {
        const response = await service.user.list(page, pageSize, search);
        runInAction(() => {
            this.entityList = response;
        });
    }

    deleteEntity = async (id: any) => {
        await service.user.remove(id);
        runInAction(() => {
            this.list(1, null)
        });
    }

    get = async () => {
        if (this.entity === null) {
            try {
                const response = await service.user.get()
                runInAction(() => {
                    this.entity = response.data;
                });
            }
            catch {
                store.commonStore.setLoading(false);
                router.navigate("/login");
            }
        }
    };

    isLoggedIn = async () => {
        if (store.commonStore.token) {
            await this.get();
        } else if (store.commonStore.token == null) {
            store.commonStore.setLoading(true);
            router.navigate("/login");
            store.commonStore.setLoading(false);
        }
    }

    setUserAvatar(avatar: any) {
        if (this.entity != null)
            this.entity.avatar = avatar;
    }
}