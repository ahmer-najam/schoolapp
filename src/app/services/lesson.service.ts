import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Lesson } from '../models/lesson';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Role } from '../models/role';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private lessonsUrl = 'api/lessons';

  constructor(private messageService: MessageService,
    private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.messageService.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.lessonsUrl)
  }

  getLessonsByUser(user: User): Observable<Lesson[]> {
    this.messageService.add("getting lessons by user");
    if(user.role == Role.Admin)
      return this.http.get<Lesson[]>(this.lessonsUrl);
    if(user.role == Role.Student) {
      this.messageService.add("role == student" + user.lastName); 
      return this.http.get<Lesson[]>(this.lessonsUrl).pipe(map(lessons => lessons.filter(lesson => lesson.student.id == user.id)));
    }
    if(user.role == Role.Teacher) {
      this.messageService.add("role == teacher"  + user.lastName); 
      return this.http.get<Lesson[]>(this.lessonsUrl).pipe(map(lessons => lessons.filter(lesson => lesson.teacher.id == user.id)));
    }
  }

  addLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.lessonsUrl, lesson, httpOptions).pipe(
      tap((lesson: Lesson) => this.messageService.add(`added lesson w/ id=${lesson.id}`)),
      catchError(this.handleError<Lesson>('addLesson'))
    );
  }

  updateLesson(lesson: Lesson): Observable<any> {
    return this.http.put(this.lessonsUrl, lesson, httpOptions).pipe(
      tap(_ => this.messageService.add(`updated lesson id=${lesson.id}` + ' ' + lesson.startDate.toString())),
      catchError(this.handleError<any>('updateLesson'))
    );
  }
}
