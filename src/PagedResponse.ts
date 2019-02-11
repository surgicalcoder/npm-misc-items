import { Observable } from "rxjs";
import { Http, Response } from '@angular/http';

export interface PagedResponse<T> {
    Page: number;
    Total: number;
    Data: T[];
}

export interface WeakRef<T>{
    Id: string;
    Item: T;
}

export interface Ref<T> {
    Id: string;
    Item: T;
}

export function toItem<T>(r: any): T {
    return Object.assign(<T>{}, r);
}

export interface Entity{
    Id: string;
    Version: number;
}

export interface EncryptedString extends Entity {
    Decoded: String;
    Encoded: String;
    Salt: String;
    Hash: String;
}
export interface HashedString extends Entity {
    Decoded: String;
    Salt: String;
    Hash: String;
}

export interface ExternallyPopulatedEntity extends Entity{
    ExternalId: String;
    ExternalPopulator: String;
    Disabled: boolean;
}

export interface ScopedEntity<T extends Entity>{
    Scope: Ref<T>;
}

export interface Timestamp
{
    CreatedDate: Date;
    LastModifiedDate: Date;
}
