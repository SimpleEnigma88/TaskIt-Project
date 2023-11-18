import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog';

import { Task } from '../task.model';
import { DialogData } from './task.model';
import { TaskService } from '../task.service';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit, OnDestroy {
  name: string;
  dueDate: Date;
  priority: string;
  status: string;
  isEdit: boolean = false;
  appTask: string = "Edit Task";
  taskList: Task[] = [];
  private taskSubscription: Subscription;
  selectedStatus = 'Status';
  selectedDate = 'Date';
  selectedPriority = 'Priority';

  constructor(public dialog: MatDialog,
    private taskService: TaskService,
    private changeDetect: ChangeDetectorRef) { }

  isOverdue(task: Task): boolean {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    console.log(task, '  ', dueDate < today);
    return dueDate < today;
  }

  onFilterChange(filterType: string, filterName: string) {
    switch (filterType) {
      case 'Date':
        this.selectedStatus = 'Status';
        this.selectedPriority = 'Priority';
        break;
      case 'Priority':
        this.selectedStatus = 'Status';
        this.selectedDate = 'Date';
        break;
      default: // 'Status'
        this.selectedDate = 'Date';
        this.selectedPriority = 'Priority';
        break;
    }

    if (filterType === 'Date') {
      this.taskList = this.taskService.sortTasksByDate(filterName);
    } else if (filterType === 'Priority') {
      this.taskList = this.taskService.sortTasksByPriority(filterName);
    } else {
      this.taskList = this.taskService.getTasks(filterType, filterName);
    }
    this.changeDetect.detectChanges();
  }

  clearFilters() {
    // Set select options to default values
    this.selectedStatus = 'Status';
    this.selectedDate = 'Date';
    this.selectedPriority = 'Priority';

    // Reload task list with no filters
    this.taskList = this.taskService.getTasks();
  }

  validateData(result: { name: any; dueDate: any; priority: any; status: any; }) {
    if (result.name && result.dueDate && result.priority && result.status) {
      return true;
    } else {
      return false;
    }
  }

  addTask(task: Task) {
    this.taskService.addTask(task);
  }

  // async function awaits the result of the addTask function before updating the task, to prevent duplicate tasks entries in database.
  async editTask(index: number, result: DialogData) {
    const task = this.taskList[index];
    if (task) {
      task.name = result.name;
      task.dueDate = new Date(result.dueDate);
      task.status = result.status;
      task.priority = result.priority;
    }
    try {
      await this.taskService.addTask(task); // wait for addTask to complete before updating
      this.taskService.updateTask(task);
    } catch (error) {
      // handle error
    }
  }

  async deleteTask(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.taskService.deleteTask(this.taskList[index])
            .subscribe(); // wait for deleteTask to complete before showing success message
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } catch (error) {
          // handle error
        }
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
        this.clearFilters();
      }
      else {
        alert("Please fill in all fields");
      }
    });

  }

  editDialog(index: number): void {
    this.isEdit = true;
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


  getRandomTask() {
    this.taskService.getRandomTask();
    this.clearFilters();
  }

  updateLists() {
    this.taskList = this.taskService.getTasks();
  }

  ngOnInit() {
    this.updateLists();
    console.log("OnInit: ", this.taskList);

    this.taskSubscription = this.taskService.taskSubscription.subscribe((tasks: Task[]) => {
      this.taskList = tasks;
    });
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }


}
