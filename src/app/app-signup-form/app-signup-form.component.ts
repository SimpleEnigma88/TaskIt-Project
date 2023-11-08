import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './app-signup-form.component.html',
  styleUrls: ['./app-signup-form.component.css']
})
export class AppSignupFormComponent {

  constructor(private authService: AuthService) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    console.log(email);

    const password = form.value.password;

    this.authService.signup(email, password).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
    form.reset();
  }

  goBack(): void {
    window.history.back();
  }
}
