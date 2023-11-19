import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  APIKey = environment.API_KEY;
  user = new BehaviorSubject<User>(null);
  signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.APIKey}`;
  logInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.APIKey}`;


  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.signUpUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        }),
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.logInUrl,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'That account has been disabled.';
        break;
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        errorMessage = 'Password must be at least 6 characters.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login credentials. Please try again.';
        break;
    }
    if (errorRes.error && errorRes.error.error) this.snackBar.open(errorMessage, 'Close', {
      duration: 3500,
    });
    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const lsUser = new User(email, userId, token, expirationDate);

    localStorage.setItem('userData', JSON.stringify(lsUser));

    this.user.next(new User(
      email,
      userId,
      token,
      expirationDate,
    ));
  };

  autoLogin() {

    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {

      return;
    }


    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );


    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.router.navigate(['/task-list']);
    }

  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('profileData');
    this.router.navigate(['/landing-page']);
  }
}
