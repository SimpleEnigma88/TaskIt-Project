import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  taskList = [{
    title: "Get Angular Project Started",
    dueDate: '10/1/2023',
    priority: 'High',
    status: 'In Progress'
  },{
    title: "Clean Carport",
    dueDate: '10/15/2023',
    priority: 'Low',
    status: 'Not Started'
  },{
    title: "Get Oil Changed",
    dueDate: '10/25/2023',
    priority: 'High',
    status: 'Completed'
  }];



}
