import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  formToShow: 'signup' | 'login' | 'none' = 'none';

  showSignupForm(): void {
    this.formToShow = 'signup';
  }

  showLoginForm(): void {
    this.formToShow = 'login';
  }

  goBack(): void {
    this.formToShow = 'none';
  }
}
