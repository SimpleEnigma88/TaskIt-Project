import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class KanbanComponent implements OnInit, OnDestroy {
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
  selectCount = 0;

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

  ngOnDestroy(): void {
    this.taskSub.unsubscribe();
  }

  selectTask(task: Task) {
    if (this.selectedTask === null || this.selectedTask.id !== task.id) {
      this.selectedTask = null;
      this.selectedTask = task;
      this.onTaskSelect();
      return;
    }
    this.selectedTask = null;
  }

  onTaskSelect() {
    // Assuming selectCount is a property of the class
    this.selectCount++;
    if (this.selectCount <= 2) {
      const editIcon = document.querySelector('.edit-icon');
      const trashIcon = document.querySelector('.trash-icon');
      editIcon.classList.add('shake-icon');
      trashIcon.classList.add('shake-icon');
      setTimeout(() => {
        editIcon.classList.remove('shake-icon');
        trashIcon.classList.remove('shake-icon');
      }, 1000);
    }
  }

  deleteSelectedTask() {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask);
      this.selectedTask = null;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: "Add Task", name: this.name, dueDate: this.dueDate, priority: this.priority, status: this.status },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.validateData(result)) {
          this.taskService.addTask(result);
        } else {
          alert("Please fill in all fields");
        }
      }
    });
  }

  editDialog(index: number): void {
    if (this.selectedTask !== null) {
      const editTask = this.taskList[index];

      if (editTask) {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          data: { name: editTask.name, dueDate: editTask.dueDate, priority: editTask.priority, status: editTask.status },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && this.validateData(result)) {
            this.editTask(index, result);
          }
        });
      } else {
        console.error(`No task at index ${index}`);
      }
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
    this.toDoPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
  onInProgressPageChange(event: PageEvent) {
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
    console.log('Drag Task ID', task.id);
  }

  drop(event: DragEvent, status: string) {
    event.preventDefault();
    const task = this.draggedTask;
    if (task) {
      console.log('Drop Task ID', task.id);
      if (status === 'delete') {
        this.taskService.deleteTask(task);
      } else {
        task.status = status;
        this.taskService.updateTask(task);
        this.draggedTask = null;
        this.taskService.taskSubscription.next(this.taskList.slice());
      }
    }
  }

  onTaskStatusChange(task: Task): void {
    this.taskService.updateTask(task);
  }


}

