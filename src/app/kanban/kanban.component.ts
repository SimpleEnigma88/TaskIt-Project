import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {
  taskList: Task[];
  private taskSub: Subscription;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.getTasksFromAPI();
    this.taskSub = this.taskService.taskSubscription.subscribe((tasks: Task[]) => {
      this.taskList = tasks;
    });
  }

  ngOnDestroy(): void {
    /* if (this.taskService.taskSubscription && !this.taskService.taskSubscription.closed) {
      this.taskSub.unsubscribe();
    } */
  }
}
