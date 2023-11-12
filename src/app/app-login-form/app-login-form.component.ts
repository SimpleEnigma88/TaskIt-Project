import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, AuthResponseData } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './app-login-form.component.html',
  styleUrls: ['./app-login-form.component.css']
})

export class AppLoginFormComponent {

  constructor(private authService: AuthService, private router: Router) { }


  onSubmit(form: NgForm) {
    let authObs: Observable<AuthResponseData>;
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    authObs = this.authService.login(email, password);

    authObs.subscribe(
      resData => {
        this.router.navigate(['/task-list']);
      },
      errorMessage => {
        console.log(errorMessage);
      }
    );

    form.reset();
  };

  goBack(): void {
    window.history.back();
  }
}
