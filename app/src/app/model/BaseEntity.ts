export interface BaseEntity {
    id: string | any;
    createdIn: string;
    createdBy: string;
    changedIn: string;
    changedBy: string;
    deleted: boolean;
    [key: string]: any;
}