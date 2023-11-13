import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AuthResponseData, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskSubscription = new Subject<Task[]>();
  taskList: Task[] = [];

  userId: string = null;

  dbUrl = `https://taskit-a5bca-default-rtdb.firebaseio.com/${this.userId}`;

  private unsubscribe = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user.subscribe({
      next: user => {
        if (user) {
          this.userId = user.id;
          this.dbUrl = `https://taskit-a5bca-default-rtdb.firebaseio.com/${this.userId}`;
          this.getTasksFromDB();
        }
      },
      error: error => {
        console.error('Error subscribing to user', error);
      },
      complete: () => {
        console.log('User subscription complete');
      }
    });
  }

  addTask(task: Task) {
    const taskToSend = {
      id: task.id,
      name: task.name,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status
    };

    this.taskList.push(taskToSend); // add task to local array

    this.http.post(`${this.dbUrl}/data.json`, taskToSend)

      .pipe(takeUntil(this.unsubscribe)) // takeUntil -- Use unsubscribe Subject to unsubscribe from multiple observables using the same pipe method. Gets the value of the Subject and unsubscribes from all observables when the Subject emits a value in ngOnDestroy().

      .subscribe({
        next: () => this.taskSubscription.next(this.taskList.slice()), // emit new array of tasks
        error: error => {
          console.error('POST request failed', error);
        },
        complete: () => {
          console.log('POST request successful');
        }
      });
  }


  getTasksFromDB(): void {
    this.http.get(`${this.dbUrl}/data.json`)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (tasks) => {
          console.log("FromDB: ", tasks);
          this.taskList = [];
          for (const key in tasks) {
            if (tasks.hasOwnProperty(key)) {
              const task = tasks[key];
              task.id = key;
              this.taskList.push(task);
            }
          }
          // this.taskList = Array.isArray(tasks) ? tasks : [];
          this.taskSubscription.next(this.taskList.slice());
        },
        error: error => {
          console.error('GET request failed', error);
        },
        complete: () => {
          console.log('GET request successful');
        }
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
    this.http.put(`${this.dbUrl}/data/${updatedTask.id}.json`, updatedTask)

      .pipe(takeUntil(this.unsubscribe)) // Same pipe method as above

      .subscribe(() => {
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
      this.http.delete(`${this.dbUrl}/data/${taskKey}.json`)

        .pipe(takeUntil(this.unsubscribe)) // Same pipe method as above

        .subscribe(() => {
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

  ngOnDestroy(): void {
    this.unsubscribe.next(); // Subject emits a value, which triggers the takeUntil operator to unsubscribe from all observables the pipe method is applied to.
    this.unsubscribe.complete(); // Subject completes, ending it's own sub.
  }
}
// Path: src/app/task-list/task-list.component.ts
