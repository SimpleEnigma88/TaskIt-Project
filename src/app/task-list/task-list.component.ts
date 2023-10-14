import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog';
import { DialogData } from './task.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent {
  name: string;
  dueDate: Date;
  priority: string;
  status: string;
  isEdit: boolean = false;
  appTask: string = "Edit Task";

  constructor(public dialog: MatDialog) { }

  validateData(result) {
    if (result.name && result.dueDate && result.priority && result.status) {
      return true;
    } else {
      return false;
    }
  }

  addTask(task) {
    this.taskList.push(task);
  }

  editTask(index: number, result: DialogData) {
    const task = this.taskList[index];
    if (task) {
      task.name = result.name;
      task.dueDate = new Date(result.dueDate);
      task.status = result.status;
      task.priority = result.priority;
    }
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
        this.taskList.splice(index, 1);
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

  taskList = [{
    name: "Get Angular Project Started",
    dueDate: new Date('10/1/2023'),
    priority: 'High',
    status: 'In Progress'
  }, {
    name: "Clean Carport",
    dueDate: new Date('10/1/2023'),
    priority: 'Low',
    status: 'To Do'
  }, {
    name: "Get Oil Changed",
    dueDate: new Date('10/1/2023'),
    priority: 'High',
    status: 'Complete'
  }];
}
