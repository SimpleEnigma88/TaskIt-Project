import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from './task.model';



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksChanged = new Subject<Task[]>();

  private taskList: Task[] = [{
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

  getTasks(filterType?: string, filterValue?: string) {
    let filteredTasks = this.taskList.slice();
    if (filterType && filterValue) {
      filteredTasks = filteredTasks.filter(task => task[filterType] === filterValue);
    }
    return filteredTasks;
  }

  updateTask(task: Task) {
    const index = this.taskList.findIndex(t => t.name === task.name);
    this.taskList[index] = task;
    this.tasksChanged.next(this.taskList.slice());
  }
}
// Path: src/app/task-list/task-list.component.ts
