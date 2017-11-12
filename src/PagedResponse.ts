import { Observable } from "rxjs";
import { Http, Response } from '@angular/http';

export interface PagedResponse<T> {
    page: number;
    total: number;
    data: T[];
}

export interface MongoRef<T> {
    ReferenceId: string;
    Reference: T;
}

export function mapPaged<T>(response: Response): PagedResponse<T> {
    let r$ = response.json();
    let pr = <PagedResponse<T>>({
        page: r$.Page,
        total: r$.Total,
        data: r$.Data
    });
    return pr;
}

export function mapItem<T>(response: Response): T {
    return toItem<T>(response.json());
}

export function mapItems<T>(response: Response): T[] {
    return response.json().map(toItem);
}

export function toItem<T>(r: any): T {
    return Object.assign({} as T, r);
}