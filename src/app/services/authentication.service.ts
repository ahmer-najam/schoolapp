import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { User } from '../models/user';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService
  ) { 
    //TODO: check if user from localStorage exists in database
      this.user = JSON.parse(localStorage.getItem('currentUser'));

  }

  user: User;
  users: User[];

  //TODO: Authorization with JWT
  login(username: string, password: string) {
    return this.http.get<User[]>('api/users')
            .pipe(map(users => { 
                this.users = users;
                this.user = this.users.find(x => x.username == username && x.password == password);
                localStorage.setItem('currentUser', JSON.stringify(this.user));
                return this.user;
            }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.user = null;
  }
}
