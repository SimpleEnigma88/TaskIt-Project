import { NgModule, OnInit } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './kanban/kanban.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'task-list', component: TaskListComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: '**', redirectTo: 'landing-page' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule implements OnInit {
  ngOnInit() {

  }
}
