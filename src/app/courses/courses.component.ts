import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Course } from '../models/course';
import { CourseService } from '../services/course.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  @ViewChild('content')
  content: TemplateRef<any>;

  courses: Course[];

  constructor(private courseService: CourseService,
    private modal: NgbModal,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getCourses();
  }

  getCourses(): void {
    this.courseService.getCourses().subscribe(courses => this.courses = courses);
  }

  addCourse(): void {
    this.modal.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveButtonClick(title: string, description: string): void {
    this.messageService.add(title);
    var course = new Course();
    course.title = title;
    course.description = description;
    this.courseService.addCourse(course).subscribe();
    this.getCourses();
  }

}
