import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { Observable } from 'rxjs';

export interface UserData {
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbUrl: string;
  private userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;

  constructor(private http: HttpClient,
    private authService: AuthService,
  ) { }

  saveUserData(profileData: any): void {
    this.authService.user.subscribe(user => {
      if (user) {
        localStorage.setItem('profileData', JSON.stringify(profileData));
        this.userId = user.id;
        this.dbUrl = `https://taskit-a5bca-default-rtdb.firebaseio.com/${this.userId}/userData`;

        this.http.put(`${this.dbUrl}.json`, profileData).subscribe({
          next: response => {
          },
          error: error => {
            console.error('Error saving user data', error);
          },
          complete: () => {
          }
        });
      }
    });
  }

  getUserData(): Observable<UserData> {
    return new Observable(observer => {
      this.authService.user.subscribe(user => {
        if (user) {
          this.userId = user.id;
          this.dbUrl = `https://taskit-a5bca-default-rtdb.firebaseio.com/${this.userId}/userData`;

          this.http.get<UserData>(`${this.dbUrl}.json`).subscribe({
            next: (userData: UserData) => {
              if (userData) {
                this.firstName = userData.firstName;
                this.lastName = userData.lastName;
                this.profilePicture = userData.profilePicture;
                this.email = userData.email;
                observer.next(userData);
              }
            },
            error: error => {
              console.error('Error retrieving user data', error);
              observer.error(error);
            },
            complete: () => {
              observer.complete();
            }
          });
        }
      });
    });
  }
}
