import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  taskList: Task[];
  private taskSub: Subscription;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    console.log("Before: ", this.taskList);
    this.taskList = this.taskService.getTasks();
    this.taskSub = this.taskService.taskSubscription.subscribe({
      next: (tasks) => {
        this.taskList = tasks;
        console.log("During: ", this.taskList);
      },
      error: error => {
        console.error('Error subscribing to tasks', error);
      },
      complete: () => {
        console.log('Task subscription complete');
      }
    });
  }

  onTaskStatusChange(task: Task): void {
    console.log(`Status of task ${task.id} changed to ${task.status}`);
    this.taskService.updateTask(task);
  }
}
