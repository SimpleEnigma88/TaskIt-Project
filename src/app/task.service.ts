import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
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
          this.getTasksFromDB(); // add task to local array only after successful POST
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateTask(updatedTask: Task): void {
    let taskID: string = updatedTask.id;
    delete updatedTask.id; // remove id property from task object to prevent it from being sent to the DB
    this.http.put(`${this.dbUrl}/data/${taskID}.json`, updatedTask)

      .pipe(takeUntil(this.unsubscribe)) // Same pipe method as above

      .subscribe({
        next: () => {

          this.taskSubscription.next(this.taskList.slice());
        },
        error: error => {
          console.error('PUT request failed', error);
        },
        complete: () => {

        }
      });
  }



  deleteTask(taskToDelete: Task): void {
    this.getTasksFromDB();
    const actualIndex = this.taskList.findIndex(task => task.id === taskToDelete.id);

    const taskKey = taskToDelete.id;

    if (taskKey) {
      this.http.delete(`${this.dbUrl}/data/${taskKey}.json`)

        .pipe(takeUntil(this.unsubscribe)) // Same pipe method as above

        .subscribe({
          next: (res) => {
            if (actualIndex !== -1) {
              this.taskList.splice(actualIndex, 1);
              this.taskSubscription.next(this.taskList.slice());

            }
          },
          error: error => {
          },
          complete: () => {

          }
        });
    } else {
      console.error('Task not found');
    }
  }

  getRandomTask() {
    return this.http.get('https://dummyjson.com/todos/random').subscribe({
      next: (res) => {
        const priorities = ['Low', 'Medium', 'High'];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        const randomDate = new Date(today.getTime() + Math.random() * (nextMonth.getTime() - today.getTime()));

        const taskToSend = {
          name: res['todo'], // todo is the key in the dummyjson response
          dueDate: randomDate,
          priority: randomPriority,
          status: 'To Do',
        };

        this.http.post(`${this.dbUrl}/data.json`, taskToSend).subscribe({
          next: () => {
            this.getTasksFromDB(); // add task to local array only after successful POST
            this.taskSubscription.next(this.taskList.slice());
          },
          error: error => {
            console.error('POST request failed', error);
          },
          complete: () => {
          }
        });
      },
      error: error => {
        console.error('Random task subscription failed', error);
      },
      complete: () => {
      }
    });
  }

  getTasksFromDB(): void {
    this.http.get(`${this.dbUrl}/data.json`)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (tasks) => {
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

      tasks = tasks.filter(task => task[filterType] === filterValue);
    }
    return tasks;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(); // Subject emits a value, which triggers the takeUntil operator to unsubscribe from all observables the pipe method is applied to.
    this.unsubscribe.complete(); // Subject completes, ending it's own sub.
  }
}
