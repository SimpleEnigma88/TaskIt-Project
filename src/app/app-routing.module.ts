import { NgModule, OnInit } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './kanban/kanban.component';

const appRoutes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'task-list', component: TaskListComponent },
  { path: 'kanban', component: KanbanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]

})
export class AppRoutingModule implements OnInit {
  ngOnInit() {

  }
}
