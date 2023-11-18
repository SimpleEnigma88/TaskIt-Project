import { NgModule, OnInit } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './kanban/kanban.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth-guard.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'app', component: AppComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'task-list', component: TaskListComponent, canActivate: [AuthGuardService] },
  { path: 'kanban', component: KanbanComponent, canActivate: [AuthGuardService] },
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
