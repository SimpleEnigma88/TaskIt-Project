import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  taskList: Task[];
  isAuthenticated = false;
  firstName: string = 'TaskIt User';
  email: string = 'email@email.com';
  profilePicture: 'spy-7.png';
  isLoading = true;
  storageSubscription: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      this.updateProfileData();
    });

    this.taskService.taskSubscription.subscribe(tasks => {
      this.taskList = tasks;
    });

    this.storageSubscription = window.addEventListener('storage', (event) => {
      if (event.key === 'profileData') {
        this.updateProfileData();
      }
    });
  };

  updateProfileData() {
    if (localStorage.getItem('profileData')) {
      const profileData = JSON.parse(localStorage.getItem('profileData'));
      this.firstName = profileData.firstName;
      this.email = profileData.email;
      this.profilePicture = profileData.profilePicture;
      this.isLoading = false;
    }
  }

  onTaskListClick() {
    this.router.navigate(['task-list'], { relativeTo: this.route });
  }

  onKanbanClick() {
    this.router.navigate(['kanban'], { relativeTo: this.route });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageSubscription);
  }
}
