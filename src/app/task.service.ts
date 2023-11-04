import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from './task.model';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksChanged = new Subject<Task[]>();
  private taskList: Task[];


  constructor(private localStorageService: LocalStorageService) {
    this.taskList = this.localStorageService.getTasks();

    // If there are no tasks in local storage, add some default tasks
    if (!this.taskList.length) {
      this.taskList = [{
        name: "Get Angular Project Started",
        dueDate: new Date('10/31/2023'),
        priority: 'High',
        status: 'In Progress'
      }, {
        name: "Clean Carport",
        dueDate: new Date('11/1/2023'),
        priority: 'Low',
        status: 'To Do'
      }, {
        name: "Get Reckt",
        dueDate: new Date('12/1/2023'),
        priority: 'High',
        status: 'To Do'
      }, {
        name: "Buy Groceries",
        dueDate: new Date('10/1/2023'),
        priority: 'Low',
        status: 'Complete'
      }, {
        name: "Get Oil Changed",
        dueDate: new Date('7/1/2024'),
        priority: 'High',
        status: 'Complete'
      }];
      // Save the default tasks to local storage
      this.localStorageService.saveTaskList(this.taskList);
    }

    // Log a message to the console
    console.log('Emitting tasksChanged event');

    // Broadcast the new task list
    this.tasksChanged.next(this.taskList.slice());
  }




  getTasks(filterType?: string, filterValue?: string): Task[] {
    let tasks = this.taskList.slice();
    if (filterType && filterValue) {
      tasks = tasks.filter(task => task[filterType] === filterValue);
    }
    return tasks;
  }

  addTask(task: Task): void {
    this.taskList.push(task);
    this.localStorageService.saveTask(task);
    this.tasksChanged.next(this.taskList.slice());
  }

  updateTask(updatedTask: Task): void {
    const index = this.taskList.findIndex(task => task.name === updatedTask.name);
    if (index !== -1) {
      this.taskList[index] = updatedTask;
      this.localStorageService.updateTask(updatedTask);
      this.tasksChanged.next(this.taskList.slice());
    }
  }

  deleteTask(taskName: string): void {
    this.taskList = this.taskList.filter(task => task.name !== taskName);
    this.localStorageService.deleteTask(taskName);
    this.tasksChanged.next(this.taskList.slice());
  }

  clearAllTasks(): void {
    this.taskList = [];
    this.localStorageService.clearAllTasks();
    this.tasksChanged.next(this.taskList.slice());
  }


}
// Path: src/app/task-list/task-list.component.ts
