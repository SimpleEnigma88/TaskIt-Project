import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-signup-form',
  templateUrl: './app-signup-form.component.html',
  styleUrls: ['./app-signup-form.component.css']
})
export class AppSignupFormComponent {

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  profilePictures = [
    'fashionista.png', 'hacker.png',
    'man-1.png', 'man-4.png',
    'man-9.png', 'man-12.png',
    'man-18.png', 'ninja-16.png', 'prisoner-15.png',
    'punk-woman-2.png', 'rapper-8.png', 'rasta-21.png',
    'spy-7.png', 'urban-woman-5.png',
    'woman-7-6.png', 'woman-10.png', 'woman-11-1.png',
    'woman-15-12.png'];

  defaultProfilePicture = 'hacker.png';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;

    const password = form.value.password;

    this.authService.signup(email, password).subscribe({
      next: response => {
        this.router.navigate(['/task-list']);
      },
      error: error => {
        console.error(error);
      }
    });

    const firstName = form.value.firstName.toLowerCase();
    const lastName = form.value.lastName.toLowerCase();
    const profilePicture = form.value.profilePicture;
    const userData = { firstName, lastName, profilePicture, email };
    this.userService.saveUserData(userData);

    form.reset();
  }

  goBack(): void {
    window.history.back();
  }
}
