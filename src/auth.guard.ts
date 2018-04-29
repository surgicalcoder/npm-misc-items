import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public router: Router, public securityService: OAuthService) {}
    canActivate() {
        if (this.securityService.hasValidIdToken()) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
