import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  taskList: Task[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.tasksChanged.subscribe(tasks => {
      this.taskList = tasks;
    });
  }

  onTaskListClick() {
    this.router.navigate(['task-list'], { relativeTo: this.route });
  }

  onKanbanClick() {
    this.router.navigate(['kanban'], { relativeTo: this.route });
  }

}
