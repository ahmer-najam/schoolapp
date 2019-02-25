import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  users$: Observable<User[]>;
  searchTerm = "";
  searchOptions = [
    { key: "First name", value: "firstName" },
    { key: "Last name", value: "lastName" },
    { key: "Username", value: "username" },
    { key: "Email", value: "email" },
  ]
  chosenOption;

  constructor(private userService: UserService) {
  }


  ngOnInit() {
    this.chosenOption = 'lastName';
    this.users$ = this.userService.searchUsersShowAll(this.searchTerm, this.chosenOption, Role.Student);
  }

  search(term: string): void {
    this.searchTerm = term;
    this.users$ = this.userService.searchUsersShowAll(this.searchTerm, this.chosenOption, Role.Student);
  }

}
