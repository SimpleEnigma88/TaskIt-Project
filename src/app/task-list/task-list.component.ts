import { Component, OnInit } from '@angular/core';

import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { LocalStorageService } from '../localStorage.service';

import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog';
import { DialogData } from './task.model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  name: string;
  dueDate: Date;
  priority: string;
  status: string;
  isEdit: boolean = false;
  appTask: string = "Edit Task";
  taskList: Task[];
  tasksChangedSubscription: Subscription;

  selectedFilter: string;

  constructor(public dialog: MatDialog,
    private taskService: TaskService, private localStorage: LocalStorageService) { }


  validateData(result: { name: any; dueDate: any; priority: any; status: any; }) {
    if (result.name && result.dueDate && result.priority && result.status) {
      return true;
    } else {
      return false;
    }
  }

  addTask(task: Task) {
    this.localStorage.saveTask(task);
  }

  editTask(index: number, result: DialogData) {
    const task = this.taskList[index];
    if (task) {
      task.name = result.name;
      task.dueDate = new Date(result.dueDate);
      task.status = result.status;
      task.priority = result.priority;
    }
    this.localStorage.updateTask(task);
  }

  deleteTask(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.localStorage.deleteTask(this.taskList[index].name);
        Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
      }
    });
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
    this.isEdit = true;
    const editTask = this.taskList[index];


    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: 'Edit Task', name: editTask.name, dueDate: editTask.dueDate, priority: editTask.priority, status: editTask.status },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.validateData(result)) {
        this.editTask(index, result);
      }
      else {
        alert("Please fill in all fields");
      }
    });
  }

  onFilterChange(filterType: string, filterName: string) {
    this.selectedFilter = filterName;
    this.taskService.getTasks(filterType, filterName);
  }


  ngOnInit() {
    this.updateLists();
    this.tasksChangedSubscription = this.taskService.tasksChanged.subscribe(
      (tasks: Task[]) => {
        this.taskList = tasks;
      }
    );
    console.log(this.taskList);
  }

  updateLists() {
    this.taskList = this.taskService.getTasks();
  }

  ngOnDestroy() {
    this.tasksChangedSubscription.unsubscribe();
  }
}
