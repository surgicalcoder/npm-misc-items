import { Observable } from "rxjs";
import { Http, Response } from '@angular/http';

export interface PagedResponse<T> {
    Page: number;
    Total: number;
    Data: T[];
}

export interface Ref<T> {
    Id: string;
    Item: T;
}

export function toItem<T>(r: any): T {
    return Object.assign(<T>{}, r);
}