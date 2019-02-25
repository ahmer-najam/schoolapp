import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Role } from '../models/role';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'api/users';

  constructor(private http: HttpClient) { }

  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }

  getUsersByRole(role: Role): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(map(users => users.filter(user => user.role == role)));
  }

  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions);
  }

  searchUsersShowAll(term: string, searchBy: string, role: Role): Observable<User[]> {
    if (!term.trim()) {
      return this.http.get<User[]>(this.usersUrl).pipe(map(users => users.filter(user => user.role == role)));
    }
    return this.http.get<User[]>(`${this.usersUrl}/?${searchBy}=${term}`).pipe(map(users => users.filter(user => user.role == role)));
  }

  searchUsers(term: string, searchBy: string, role: Role): Observable<User[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?${searchBy}=${term}`).pipe(map(users => users.filter(user => user.role == role)));
  }
}
