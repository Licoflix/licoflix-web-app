import { makeAutoObservable } from "mobx";
import { UserFormValues } from "../../model/UserResponse";
import service from "../../service/service";
import { store } from "../store";

export default class ProfileStore {
    isImageEdited: boolean = false;
    isNameDisabled: boolean = true;
    isEmailDisabled: boolean = true;
    isPasswordDisabled: boolean = true;
    isNicknameDisabled: boolean = true;

    name: string = "";
    email: string = "";
    password: string = "";
    nickname: string = "";
    avatar: string | null = null;
    showPassword: boolean = false;
    oldAvatar: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAllDisabled = (isCancel?: boolean) => {
        this.isImageEdited = false;
        this.isEmailDisabled = true;
        this.isPasswordDisabled = true;
        this.isNicknameDisabled = true;

        if (isCancel) {
            this.avatar = this.oldAvatar;
        }
    };

    toggleShowPassword = () => {
        this.showPassword = !this.showPassword;
    };

    enableImageEdit = () => {
        this.isImageEdited = true;
    };

    enableNameEdit = () => {
        this.isNameDisabled = false;
    };

    enableEmailEdit = () => {
        this.isEmailDisabled = false;
    };

    enablePasswordEdit = () => {
        this.isPasswordDisabled = false;
    };

    enableNicknameEdit = () => {
        this.isNicknameDisabled = false;
    };

    enableActionButtons = () => {
        return (
            !this.isEmailDisabled ||
            !this.isNicknameDisabled ||
            !this.isPasswordDisabled ||
            !this.isNameDisabled ||
            this.isImageEdited
        );
    };

    setEmail = (email: string) => {
        this.email = email;
    };

    setName = (name: string) => {
        this.name = name;
    };

    setPassword = (password: string) => {
        this.password = password;
    };

    setNickname = (nickname: string) => {
        this.nickname = nickname;
    };

    setAvatar = (newAvatar: string | null) => {
        this.avatar = newAvatar;
    };

    setOldAvatar = (newAvatar: string | null) => {
        this.oldAvatar = newAvatar;
    };

    handleSave = () => {
        const updatedProfile: UserFormValues = {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            nickname: this.nickname,
            password: this.password,
        };

        service.auth.edit(updatedProfile).then((response) => {
            if (response.data?.token) {
                store.commonStore.setToken(response.data.token);
                store.userStore.setUserAvatar(response.data.avatar);
            }
        }).finally(() => {
            this.setAllDisabled(false);
            this.setOldAvatar(this.avatar);
        });
    };
}
