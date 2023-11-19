import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './app-login-form.component.html',
  styleUrls: ['./app-login-form.component.css']
})

export class AppLoginFormComponent {

  constructor(private authService: AuthService,
    private router: Router,
    private userService: UserService) { }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password).subscribe({
      next: resData => {
        this.userService.getUserData().subscribe({
          next: (profileData) => {
            localStorage.setItem('profileData', JSON.stringify(profileData));
          },
          error: (error) => {
            console.error('Error retrieving user data', error);
          }
        });

        this.router.navigate(['/task-list']);
      },
      error: errorMessage => {
        console.error(errorMessage);
      },
      complete: () => {
      }
    });

    form.reset();
  };

  goBack(): void {
    window.history.back();
  }
}


