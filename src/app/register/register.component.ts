import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Role } from '../models/role';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  users: User[];
  model = new User();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  addUser(): void {
    this.model.role = Role.Student;
    this.userService.addUser(this.model)
      .subscribe(model => {
        this.users.push(model);
      });
  }

  onSubmit() { this.submitted = true; }


}
