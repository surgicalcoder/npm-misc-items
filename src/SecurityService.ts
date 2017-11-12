import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class SecurityService {

	private _isAuthorized: boolean;
	public HasAdminRole: boolean;
	public UserData: any;

	private actionUrl: string;
	private headers: Headers;
	private storage: any;

	constructor(private _http: Http, private _router: Router) {

		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');
		this.storage = sessionStorage;

		if (this.retrieve('_isAuthorized') !== '') {
			this.HasAdminRole = this.retrieve('HasAdminRole');
			this._isAuthorized = this.retrieve('_isAuthorized');
		}
	}

	public IsAuthorized(): boolean {
		if (this._isAuthorized) {
			if (this.isTokenExpired('authorizationDataIdToken')) {
				console.log('IsAuthorized: isTokenExpired');
				this.ResetAuthorizationData();
				return false;
			}

			return true;
		}

		return false;
	}

	public GetToken(): any {
		return this.retrieve('authorizationData');
	}

	public ResetAuthorizationData() {
		this.store('authorizationData', '');
		this.store('authorizationDataIdToken', '');

		this._isAuthorized = false;
		this.HasAdminRole = false;
		this.store('HasAdminRole', false);
		this.store('_isAuthorized', false);
	}

	public SetAuthorizationData(token: any, id_token: any) {
		if (this.retrieve('authorizationData') !== '') {
			this.store('authorizationData', '');
		}

		this.store('authorizationData', token);
		this.store('authorizationDataIdToken', id_token);
		this._isAuthorized = true;
		this.store('_isAuthorized', true);
	}

	public Authorize() {
		this.ResetAuthorizationData();

		console.log('BEGIN Authorize, no auth data');

		let authorizationUrl = '/connect/authorize';
		let client_id = 'angular2client';
		let redirect_uri = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`;
		let response_type = 'id_token token';
		let scope = 'openid';
		let nonce = 'N' + Math.random() + '' + Date.now();
		let state = Date.now() + '' + Math.random();

		this.store('authStateControl', state);
		this.store('authNonce', nonce);
		console.log('AuthorizedController created. adding myautostate: ' + this.retrieve('authStateControl'));

		let url =
			authorizationUrl + '?' +
			'response_type=' + encodeURI(response_type) + '&' +
			'client_id=' + encodeURI(client_id) + '&' +
			'redirect_uri=' + encodeURI(redirect_uri) + '&' +
			'scope=' + encodeURI(scope) + '&' +
			'nonce=' + encodeURI(nonce) + '&' +
			'state=' + encodeURI(state);

		window.location.href = url;
	}

	public AuthorizedCallback() {
		this.ResetAuthorizationData();

		let hash = window.location.hash.substr(1);

		let result: any = hash.split('&').reduce(function (result: any, item: string) {
			let parts = item.split('=');
			result[parts[0]] = parts[1];
			return result;
		}, {});

		let token = '';
		let id_token = '';
		let authResponseIsValid = false;
		if (!result.error) {

			if (result.state !== this.retrieve('authStateControl')) {
			} else {

				token = result.access_token;
				id_token = result.id_token;

				let dataIdToken: any = this.getDataFromToken(id_token);

				// validate nonce
				if (dataIdToken.nonce !== this.retrieve('authNonce')) {
				} else {
					this.store('authNonce', '');
					this.store('authStateControl', '');

					authResponseIsValid = true;
				}
			}
		}

		if (authResponseIsValid) {
			this.SetAuthorizationData(token, id_token);
		} else {
			this.ResetAuthorizationData();
			this._router.navigate(['/Unauthorized']);
		}
	}

	public Logoff() {
		console.log('BEGIN Authorize, no auth data');

		let authorizationUrl = '/connect/endsession';

		let id_token_hint = this.retrieve('authorizationDataIdToken');
		let post_logout_redirect_uri = '/Unauthorized';

		let url =
			authorizationUrl + '?' +
			'id_token_hint=' + encodeURI(id_token_hint) + '&' +
			'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

		this.ResetAuthorizationData();

		window.location.href = url;
	}

	public HandleError(error: any) {
		console.log(error);
		if (error.status == 403) {
			this._router.navigate(['/Forbidden']);
		} else if (error.status == 401) {
			this.ResetAuthorizationData();
			this._router.navigate(['/Unauthorized']);
		}
	}

	private isTokenExpired(token: string, offsetSeconds?: number): boolean {
		let tokenExpirationDate = this.getTokenExpirationDate(token);
		offsetSeconds = offsetSeconds || 0;

		if (tokenExpirationDate == null) {
			return false;
		}

		// Token expired?
		return !(tokenExpirationDate.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
	}

	private getTokenExpirationDate(token: string): Date {
		let decoded: any;
		decoded = this.getDataFromToken(this.retrieve(token));

		if (!decoded.hasOwnProperty('exp')) {
			return new Date(0);
		}

		let date = new Date(0); // The 0 here is the key, which sets the date to the epoch
		date.setUTCSeconds(decoded.exp);

		return date;
	}

	private urlBase64Decode(str: string) {
		let output = str.replace('-', '+').replace('_', '/');
		switch (output.length % 4) {
			case 0:
				break;
			case 2:
				output += '==';
				break;
			case 3:
				output += '=';
				break;
			default:
				throw 'Illegal base64url string!';
		}

		return window.atob(output);
	}

	private getDataFromToken(token: any) {
		let data = {};
		if (typeof token !== 'undefined') {
			let encoded = token.split('.')[1];
			data = JSON.parse(this.urlBase64Decode(encoded));
		}

		return data;
	}

	private retrieve(key: string): any {
		let item = this.storage.getItem(key);

		if (item && item !== 'undefined') {
			return JSON.parse(this.storage.getItem(key));
		}

		return;
	}

	private store(key: string, value: any) {
		this.storage.setItem(key, JSON.stringify(value));
	}

	private getUserData = (): Observable<string[]> => {
		this.setHeaders();
		return this._http.get('/connect/userinfo', {
			headers: this.headers,
			body: ''
		}).map(res => res.json());
	}

	public getHeaders(): Headers {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');

		let token = this.GetToken();
		if (token !== '') {
			headers.append('Authorization', 'Bearer ' + token);
		}
		return headers;
	}

	public setHeaders() {
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');

		let token = this.GetToken();

		if (token !== '') {
			this.headers.append('Authorization', 'Bearer ' + token);
		}
	}
}