import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog';
import { DialogData } from '../task-list/task.model';


@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  name: string;
  dueDate: Date;
  priority: string;
  status: string;
  taskList: Task[];
  private taskSub: Subscription;
  draggedTask: Task;
  pageSize = 4;
  toDoPage = 1;
  inProgressPage = 1;
  completePage = 1;
  selectedTask: Task = null;

  constructor(public dialog: MatDialog,
    private taskService: TaskService) { }

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

  selectTask(task: Task) {
    if (this.selectedTask === null) {
      this.selectedTask = task;
      return;
    }
    this.selectedTask = null;
  }

  deleteSelectedTask() {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask);
      this.selectedTask = null;
    }
  }

  addTask(task: Task) {
    this.taskService.addTask(task);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: "Add Task", name: this.name, dueDate: this.dueDate, priority: this.priority, status: this.status },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.validateData(result)) {
        this.addTask(result);
      }
      else {
        alert("Please fill in all fields");
      }
    });

  }

  editDialog(index: number): void {
    const editTask = this.taskList[index];

    if (editTask) {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        data: { name: editTask.name, dueDate: editTask.dueDate, priority: editTask.priority, status: editTask.status },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.validateData(result)) {
          this.editTask(index, result);
        }
        else {
          alert("Please fill in all fields");
        }
      });
    } else {
      console.error(`No task at index ${index}`);
    }
  }

  editTask(index: number, result: DialogData) {
    const task = this.taskList[index];
    if (task) {
      task.name = result.name;
      task.dueDate = new Date(result.dueDate);
      task.status = result.status;
      task.priority = result.priority;
    }
    try {
      this.taskService.updateTask(task);
    } catch (error) {
      // handle error
    }
  }

  validateData(result: { name: any; dueDate: any; priority: any; status: any; }) {
    if (result.name && result.dueDate && result.priority && result.status) {
      return true;
    } else {
      return false;
    }
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
    const id = event.dataTransfer.getData('text');
    const task = this.taskList.find(task => task.id === id);

    if (task) {
      if (status === 'delete') {
        this.taskService.deleteTask(task);
        return;
      } else {
        this.draggedTask.status = status;
        this.taskService.updateTask(task);
      }
    }
  }
  onTaskStatusChange(task: Task): void {
    this.taskService.updateTask(task);
  }
}

