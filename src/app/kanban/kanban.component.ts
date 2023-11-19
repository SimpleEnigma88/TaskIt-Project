import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  taskList: Task[];
  private taskSub: Subscription;
  draggedTask: Task;
  pageSize = 4;
  toDoPage = 1;
  inProgressPage = 1;
  completePage = 1;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskList = this.taskService.getTasks();
    this.taskSub = this.taskService.taskSubscription.subscribe({
      next: (tasks) => {
        this.taskList = tasks;
      },
      error: error => {
        console.error('Error subscribing to tasks', error);
      },
      complete: () => {
      }
    });
  }

  countKanbanTasks(status: string): number {
    return this.taskList.filter(task => task.status === status).length;
  }

  onToDoPageChange(event: PageEvent) {
    console.log(event);
    this.toDoPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
  onInProgressPageChange(event: PageEvent) {
    console.log(event);
    this.inProgressPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
  onCompletePageChange(event: PageEvent) {
    console.log(event);
    this.completePage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
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
    this.taskService.updateTask(task);
  }
}
