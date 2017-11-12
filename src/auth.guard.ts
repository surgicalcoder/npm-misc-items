import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SecurityService } from "./SecurityService";


@Injectable()
export class AuthGuard implements CanActivate {
    private secService: SecurityService;

    constructor(private router: Router, private securityService: SecurityService) {
        this.secService = securityService;
    }

    canActivate() {
        if (this.secService.IsAuthorized()) {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
}
