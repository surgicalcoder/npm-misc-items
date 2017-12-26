import { Observable } from "rxjs";
import { Http, Response } from '@angular/http';

export interface PagedResponse<T> {
    Page: number;
    Total: number;
    Data: T[];
}

export interface MongoRef<T> {
    ReferenceId: string;
    Reference: T;
}

export function mapPaged<T>(response: Response): PagedResponse<T> {
    let r$ = response.json();
    let pr = <PagedResponse<T>>({
        Page: r$.Page,
        Total: r$.Total,
        Data: r$.Data
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
    return Object.assign(<T>{}, r);
}