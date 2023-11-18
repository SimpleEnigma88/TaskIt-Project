import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLandingPage = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe({
      next: (event) => {
        this.isLandingPage = this.router.url === '/landing-page';
      }
    })
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
