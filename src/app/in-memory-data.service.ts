import { Injectable } from '@angular/core';
import { Course } from './models/course';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './models/user';
import { Role } from './models/role';
import { Lesson } from './models/lesson';
import {
  startOfDay,
  addHours,
  addMinutes
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let users: User[];
    users = [
      { id: 11, username: 'admin', password: 'admin', firstName: 'John', lastName: 'Smith', role: Role.Admin, email: null, phoneNumber: null },
      { id: 12, username: 'username2', password: 'password2', firstName: 'James', lastName: 'Brown', role: Role.Teacher, email: null, phoneNumber: null },
      { id: 13, username: 'username3', password: 'password3', firstName: 'Olivier', lastName: 'Johnson', role: Role.Student, email: null, phoneNumber: null },
      { id: 14, username: 'username4', password: 'password4', firstName: 'Jack', lastName: 'Wiliams', role: Role.Student, email: null, phoneNumber: null },
      { id: 15, username: 'username5', password: 'password5', firstName: 'Charlie', lastName: 'Brown', role: Role.Student, email: null, phoneNumber: null },
      { id: 16, username: 'student', password: 'student', firstName: 'Olivia', lastName: 'Davis', role: Role.Student, email: null, phoneNumber: null },
      { id: 17, username: 'username7', password: 'password7', firstName: 'Mia', lastName: 'Miller', role: Role.Student, email: null, phoneNumber: null },
      { id: 18, username: 'username8', password: 'password8', firstName: 'Emily', lastName: 'Wilson', role: Role.Student, email: null, phoneNumber: null },
      { id: 19, username: 'teacher', password: 'teacher', firstName: 'Michael', lastName: 'Cage', role: Role.Teacher, email: null, phoneNumber: null },
    ]
    const courses = [
      { id: 11, title: 'Elementary spanish', description: 'Elementary spanish classes' },
      { id: 12, title: 'Advanced english', description: 'Advanced english course' },
      { id: 13, title: 'Piano', description: 'Piano lessons' }
    ]
    const lessons = [
      {
        id: 11, course: courses[0], startDate: addHours(startOfDay(new Date()), 10),
        endDate: addHours(startOfDay(new Date()), 11), student: users[4], teacher: users[1]
      },

      {
        id: 12, course: courses[1], startDate: addHours(startOfDay(new Date()), 12),
        endDate: addMinutes(startOfDay(new Date()), 12 * 60 + 45), student: users[5], teacher: users[1]
      },

      {
        id: 13, course: courses[2], startDate: addHours(startOfDay(new Date()), 15.5),
        endDate: addHours(startOfDay(new Date()), 16), student: users[7], teacher: users[8]
      }
    ]
    for(var i = 0; i < 15; i++) {
      lessons.push({
        id: 14 + i, course: courses[2], startDate: addHours(startOfDay(new Date()), 11 + 24 * 7 * i),
        endDate: addHours(startOfDay(new Date()), 12 + 24 * 7 * i), student: users[3], teacher: users[8]
      });
    }
    for(let user of users) {
      user.email = user.lastName.toLowerCase() + "@domain.com";
      user.phoneNumber = (Math.floor(Math.random() * 900000000) + 222222222).toString();
    }

    return { courses, users, lessons }
  }

  genId<T extends Lesson | User | Course>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}
