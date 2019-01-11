import { Injectable } from '@angular/core';

@Injectable()
export class StateService {
    private static instance: StateService = null;

    public static getInstance(): StateService {
        if (StateService.instance === null) {
            StateService.instance = new StateService();
        }
        return StateService.instance;
    }

    public settings: { [key: string]: any; } = {};

    public SaveSettings(page: string, setting: string, value: any) {
        let key = `${page}-${setting}`;

        if (this.settings[key]) {
            delete this.settings[key];
        }

        this.settings[key] = value;
    }

    public GetSettings(page: string, setting: string): any {
        let key = `${page}-${setting}`;
        return this.settings[key];
    }
    constructor() { }
}
