import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { CoursesComponent } from './courses/courses.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { Role } from './models/role';
import { HomeComponent } from './home/home.component';
import { DiagramsComponent } from './diagrams/diagrams.component';

const routes: Routes = [
  { path: 'students', component: StudentsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: 'courses', component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: 'calendar', component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Student, Role.Teacher] }
  },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'diagrams', component: DiagramsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  { path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
