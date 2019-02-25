import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Role } from '../models/role';
import { MessageService } from '../services/message.service';
import { CourseService } from '../services/course.service';
import { combineLatest } from 'rxjs';
import { Course } from '../models/course';
import { differenceInMinutes } from 'date-fns';

@Component({
  selector: 'app-diagrams',
  styleUrls: ['./diagrams.component.css'],
  templateUrl: './diagrams.component.html'
})

export class DiagramsComponent implements OnInit {

  constructor(private lessonService: LessonService,
    private userService: UserService,
    private courseService: CourseService
    ) { }

  lessons: Lesson[];
  teachers: User[];
  courses: Course[];

  ngOnInit() {
    let t = this.userService.getUsersByRole(Role.Teacher);
    let l = this.lessonService.getLessons();
    let c = this.courseService.getCourses();

  combineLatest(t,l,c).subscribe(([teachers,lessons,courses]) => {
    this.teachers = teachers;
    this.lessons = lessons;
    this.courses = courses;
    this.createTeachersLessonsChart();
    this.createCoursesLessonsChart();
    this.createLessonsLengthIncomeChart();
  })
  }

  createTeachersLessonsChart(): void {
    let teachersLessonsData = [];
    this.teachers.forEach(teacher => {
      let a = 0;
      this.lessons.forEach(lesson => {
        if(lesson.teacher.id == teacher.id)
          a++;
      });
      teachersLessonsData.push({y: a, name: teacher.firstName + ' ' + teacher.lastName});
    });
    this.renderChart("Lessons number of each teacher", teachersLessonsData,"chartContainer");
  }

  createCoursesLessonsChart(): void {
    let coursesLessonsData = [];
    this.courses.forEach(course => {
      let a = 0;
      this.lessons.forEach(lesson => {
        if(lesson.course.id == course.id)
          a++;
      });
      coursesLessonsData.push({y: a, name: course.title});
    });
    this.renderChart("Lessons number of each course", coursesLessonsData,"chartContainer2");
  }

  createLessonsLengthIncomeChart(): void {
    let lessonsLengthIncome = [];
    let a = 0;
    let b = 0;
    let c = 0;
    this.lessons.forEach(lesson => {
      let length = differenceInMinutes(lesson.endDate, lesson.startDate);
      switch(length) {
        case 60:
          a += 82;
          break;
        case 45:
          b += 67;
          break;
        case 30:
          c += 47;
          break;
      } 
    });
    lessonsLengthIncome.push({y: a, name: '60 minutes'})
    lessonsLengthIncome.push({y: b, name: '45 minutes'})
    lessonsLengthIncome.push({y: c, name: '30 minutes'})
    this.renderChart("Lessons income for each lessons length", lessonsLengthIncome,"chartContainer3");
  }


  renderChart(title: string, data: any, containerName: string): void {
    let chart = new CanvasJS.Chart(containerName, {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: title
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: lessons: {y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: data
      }]
    });
    chart.render();
  }

}
