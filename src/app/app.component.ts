import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLandingPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (event) => {
        this.isLandingPage = this.router.url === '/landing-page';
      }
    })
  }
}
