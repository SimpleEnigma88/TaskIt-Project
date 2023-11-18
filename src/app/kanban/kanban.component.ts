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
  draggedTask: Task;

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

  dragOver(event: DragEvent) {
    event.preventDefault();
  }

  dragStart(event: DragEvent, task: Task) {
    this.draggedTask = task;
    event.dataTransfer.setData('text/plain', task.id);
  }

  dragEnd(event: DragEvent) {
    this.draggedTask = null;
  }

  drop(event: DragEvent, status: string) {
    event.preventDefault();
    if (this.draggedTask) {
      this.draggedTask.status = status;
      this.taskService.updateTask(this.draggedTask);
    }
  }
  onTaskStatusChange(task: Task): void {
    console.log(`Status of task ${task.id} changed to ${task.status}`);
    this.taskService.updateTask(task);
  }
}
