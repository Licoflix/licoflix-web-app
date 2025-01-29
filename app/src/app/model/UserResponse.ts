import { BaseEntity } from "./BaseEntity";

export interface UserResponse extends BaseEntity {
    name: string;
    email: string;
    token: string;
    admin: boolean;
    nickname: string;
    avatar: string | null;
}

export interface UserFormValues {
    name: string;
    email: string;
    nickname: string;
    password: string;
    avatar: string | ArrayBuffer | null;
}