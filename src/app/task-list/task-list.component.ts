import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog';

import { Task } from '../task.model';
import { DialogData } from './task.model';
import { TaskService } from '../task.service';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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
  page = 1;
  pageSize = 10;
  isTitleSorted = false;
  isPrioritySorted = false;
  isStatusSorted = false;
  isDateSorted = false;
  isDueDateAscending = false;
  isPriorityAscending = false;
  isStatusAscending = false;
  isNameAscending = false;

  onSortChange(sortType: string) {
    switch (sortType) {
      case 'name':
        console.log('Title');
        this.isTitleSorted = true;
        this.isPrioritySorted = false;
        this.isStatusSorted = false;
        this.isDateSorted = false;
        break;
      case 'priority':
        console.log('Priority');
        this.isTitleSorted = false;
        this.isPrioritySorted = true;
        this.isStatusSorted = false;
        this.isDateSorted = false;
        break;
      case 'status':
        console.log('Status');
        this.isTitleSorted = false;
        this.isPrioritySorted = false;
        this.isStatusSorted = true;
        this.isDateSorted = false;
        break;
      default: // 'Date'
        console.log('Date');
        this.isTitleSorted = false;
        this.isPrioritySorted = false;
        this.isStatusSorted = false;
        this.isDateSorted = true;
        break;
    }
  }


  constructor(public dialog: MatDialog,
    private taskService: TaskService,
    private changeDetect: ChangeDetectorRef) { }


  onPageChange(event: PageEvent) {
    console.log(event);
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  isOverdue(task: Task): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
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
        this.taskService.deleteTask(this.taskList[index]);
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

  sortOrder: { [key: string]: boolean } = {};

  sortTasks(key: string) {
    const order = this.sortOrder[key] || false;
    this.taskList.sort((a, b) => {
      if (a[key] < b[key]) {
        return order ? 1 : -1;
      } else if (a[key] > b[key]) {
        return order ? -1 : 1;
      } else {
        return 0;
      }
    });
    this.sortOrder[key] = !order;
    this.switchAscendingSort(key);
    this.onSortChange(key);
  }

  /**
   * Switches the ascending sort order for the specified key.
   *
   * @param key - The key to determine which sort order to switch.
   */
  switchAscendingSort(key: string) {
    switch (key) {
      case 'name':
        this.isNameAscending = !this.isNameAscending;
        break;
      case 'priority':
        this.isPriorityAscending = !this.isPriorityAscending;
        break;
      case 'status':
        this.isStatusAscending = !this.isStatusAscending;
        break;
      default: // 'dueDate'
        this.isDueDateAscending = !this.isDueDateAscending;
        break;
    }
  }

  ngOnInit() {
    this.updateLists();

    this.taskSubscription = this.taskService.taskSubscription.subscribe((tasks: Task[]) => {
      this.taskList = tasks;
    });

    this.taskList.forEach(task => {
    });
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }


}
