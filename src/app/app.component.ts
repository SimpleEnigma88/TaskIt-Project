import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLandingPage = false;
  profileAvailable = false;

  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService) {
    this.router.events.subscribe({
      next: (event) => {
        this.isLandingPage = this.router.url === '/landing-page';
      }
    })

    this.authService.user.subscribe(user => {
      if (user) {
        this.userService.getUserData().subscribe({
          next: userData => {
            if (userData) {
              this.profileAvailable = true;
            }
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
