import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskSubscription = new Subject<Task[]>();
  taskList: Task[] = [];
  dbUrl = 'https://taskit-a5bca-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {
    this.getTasksFromDB();
  }

  addTask(task: Task): void {
    const taskToSend = { id: task.id, name: task.name, dueDate: task.dueDate, priority: task.priority, status: task.status };
    this.taskList.push(taskToSend);
    this.http.post(`${this.dbUrl}/data.json`, taskToSend).subscribe(response => {
      console.log("addTask log: ", response);
      if (!this.taskSubscription.closed) {
        this.taskSubscription.next(this.taskList.slice());
      }
    }, error => {
      console.error(error);
    });
  }

  getTasksFromDB(): void {
    this.http.get(`${this.dbUrl}/data.json`).subscribe((tasks) => {
      console.log('getTasksFromAPI subscribe log: ', tasks);
      this.taskList = [];
      for (const key in tasks) {
        if (tasks.hasOwnProperty(key)) {
          const task = tasks[key];
          task.id = key;
          this.taskList.push(task);
        }
      }
      if (!this.taskSubscription.closed) {
        this.taskSubscription.next(this.taskList.slice());
      }
    }, error => {
      console.error(error);
    });
  }

  getTasks(filterType?: string, filterValue?: string): Task[] {
    let tasks = this.taskList.slice() ? this.taskList.slice() : [];
    if (filterType && filterValue) {
      tasks = tasks.filter(task => task[filterType] === filterValue);
    }
    return tasks;
  }


  updateTask(updatedTask: Task): void {
    this.http.put(`${this.dbUrl}/data/${updatedTask.id}.json`, updatedTask).subscribe(() => {
      const index = this.taskList.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.taskList[index] = updatedTask;
        this.taskSubscription.next(this.taskList.slice());
      }
    }, error => {
      console.error('PUT request failed', error);
    });
  }

  deleteTask(taskToDelete: Task): void {
    const taskKey = taskToDelete.id;
    if (taskKey) {
      this.http.delete(`${this.dbUrl}/data/${taskKey}.json`).subscribe(() => {
        const index = this.taskList.findIndex(task => task.id === taskToDelete.id);
        if (index !== -1) {
          this.taskList.splice(index, 1);
          this.taskSubscription.next(this.taskList.slice());
        }
      }, error => {
        console.error('DELETE request failed', error);
      });
    } else {
      console.error('Task not found');
    }
  }

}
// Path: src/app/task-list/task-list.component.ts
