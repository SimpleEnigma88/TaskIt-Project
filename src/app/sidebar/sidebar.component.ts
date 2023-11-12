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
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    if (this.isAuthenticated) {
      this.taskService.taskSubscription.subscribe(tasks => {
        this.taskList = tasks;
      });
    };
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
    this.userSub.unsubscribe();
  }
}
