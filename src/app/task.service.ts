import { Injectable } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

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

  addTask(task: Task): Promise<any> {
    const taskToSend = {
      id: task.id,
      name: task.name,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status
    };
    return new Promise((resolve, reject) => {
      this.http.post(`${this.dbUrl}/data.json`, taskToSend)
        .toPromise()
        .then(response => {
          this.taskList.push(taskToSend); // add task to local array only after successful POST
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getRandomTask() {
    return this.http.get('https://dummyjson.com/todos/random').subscribe({
      next: (res) => {
        const taskToSend = {
          id: res['id'],
          name: res['todo'],
          dueDate: new Date(),
          priority: 'Low',
          status: 'To Do',
        };
        this.taskList.push(taskToSend);
        this.http.post(`${this.dbUrl}/data.json`, taskToSend).subscribe({
          next: () => this.taskSubscription.next(this.taskList.slice()),
          error: error => {
            console.error('POST request failed', error);
          },
          complete: () => {
            console.log('POST request successful');
          }
        });
      },
      error: error => {
        console.error('Random task subscription failed', error);
      },
      complete: () => {
        console.log('Random task subscription complete');
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

  sortTasksByDate(order: string): Task[] {
    let tasks = [...this.taskList];
    tasks.sort((a, b) => {
      if (order === 'Newest') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });
    return tasks;
  }

  sortTasksByPriority(order: string): Task[] {
    let tasks = [...this.taskList];
    tasks.sort((a, b) => {
      const priorityOrder = ['Low', 'Medium', 'High'];
      if (order === 'High') {
        return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
      } else {
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      }
    });
    return tasks;
  }

  getTasks(filterType?: string, filterValue?: string): Task[] {
    let tasks = this.taskList.slice() ? this.taskList.slice() : [];
    if (filterType && filterValue) {
      console.log("Filter type: ", filterType);
      console.log("Filter value: ", filterValue);

      tasks = tasks.filter(task => task[filterType] === filterValue);
      console.log("Filtered tasks: ", tasks);
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

  deleteTask(task: Task): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.dbUrl}/data.json/${task.id}`)
        .toPromise()
        .then(response => {
          const index = this.taskList.indexOf(task);
          if (index > -1) {
            this.taskList.splice(index, 1); // remove task from local array only after successful DELETE
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(); // Subject emits a value, which triggers the takeUntil operator to unsubscribe from all observables the pipe method is applied to.
    this.unsubscribe.complete(); // Subject completes, ending it's own sub.
  }
}
// Path: src/app/task-list/task-list.component.ts
