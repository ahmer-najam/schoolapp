import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesUrl = 'api/courses';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl)
  }

  searchCourses(term: string): Observable<Course[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Course[]>(`${this.coursesUrl}/?title=${term}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.coursesUrl, course, httpOptions);
  }
}
