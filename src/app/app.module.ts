import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TaskListComponent } from './task-list/task-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogOverviewExampleDialog } from './dialog-overview-example-dialog/dialog-overview-example-dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { KanbanComponent } from './kanban/kanban.component';
import { FilterPipe } from './filter.pipe';
import { TaskService } from './task.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppSignupFormComponent } from './app-signup-form/app-signup-form.component';
import { AppLoginFormComponent } from './app-login-form/app-login-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptorService } from './auth-interceptor.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TaskListComponent,
    DialogOverviewExampleDialog,
    KanbanComponent,
    FilterPipe,
    LandingPageComponent,
    AppSignupFormComponent,
    AppLoginFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  providers: [TaskService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
