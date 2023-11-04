import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  saveTaskList(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  updateTask(updatedTask: Task): void {
    let tasks = this.getTasks();
    const index = tasks.findIndex(task => task.name === updatedTask.name);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  deleteTask(taskName: string): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  clearAllTasks(): void {
    localStorage.removeItem('tasks');
  }

  getTasks(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
}
