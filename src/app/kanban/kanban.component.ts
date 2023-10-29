import { Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  todoList: Task[];
  inProgList: Task[];
  doneList: Task[];
  tasks: Task[];

  constructor(private taskService: TaskService, private cdRef: ChangeDetectorRef, private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.updateLists();
  }

  updateLists() {
    this.tasks = this.taskService.getTasks();

    /*     this.todoList = this.tasks.filter(task => task.status === 'To Do');

        this.inProgList = this.tasks.filter(task => task.status === 'In Progress');

        this.doneList = this.tasks.filter(task => task.status === 'Complete'); */
  }



}
