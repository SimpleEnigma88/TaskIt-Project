import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './app-signup-form.component.html',
  styleUrls: ['./app-signup-form.component.css']
})
export class AppSignupFormComponent {

  constructor(private authService: AuthService, private router: Router) { }

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
        this.router.navigate(['/task-list']);
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
