import { Component, Input, Output, ViewChild, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';
import { Course } from '../models/course';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { addDays, addMinutes, compareDesc } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { Role } from '../models/role';
import { LessonService } from '../services/lesson.service';

@Component({
    selector: 'modal-content',
    templateUrl: './modal-content.html',
    styleUrls: ['./calendar.component.css']
})

export class ModalContent implements AfterViewInit {
    @ViewChild('searchBoxStudent') 
    searchBoxStudent: ElementRef;

    @ViewChild('searchBoxTeacher') 
    searchBoxTeacher: ElementRef;

    @ViewChild('searchBoxCourse') 
    searchBoxCourse: ElementRef;

    @Output() clickevent = new EventEmitter<string>();

    @Input()
    modalData: {
        event: CalendarEvent<{ lesson: Lesson }>;
        newStart: Date;
        newEnd: Date;
        length: any;
        student: User;
        teacher: User;
        course: Course;
        repeatUntil: Date;
        newLesson: boolean;
        title: string;
    };

    constructor(public activeModal: NgbActiveModal,
        private courseService: CourseService,
        private userService: UserService,
        private lessonService: LessonService,
        ) { }

    ngAfterViewInit() {
        this.fetchData();
        if(!this.modalData.newLesson) {
            this.searchBoxStudent.nativeElement.value = this.modalData.student.firstName + ' ' + this.modalData.student.lastName;
            this.searchBoxTeacher.nativeElement.value = this.modalData.teacher.firstName + ' ' + this.modalData.teacher.lastName;
            this.searchBoxCourse.nativeElement.value = this.modalData.course.title;
        }
    }

    saveButtonClick(): void {
        if (this.modalData.newLesson)
            this.modalNewLessonSave();
        else
            this.modalSave();
    }

    modalSave(): void {
        var lesson = this.modalData.event.meta.lesson;
        this.modalData.event.start = new Date(this.modalData.newStart);
        this.modalData.event.end = addMinutes(new Date(this.modalData.newStart), this.modalData.length);
        this.modalData.event.meta.lesson.student = this.modalData.student;
        this.modalData.event.meta.lesson.teacher = this.modalData.teacher;
        this.modalData.event.meta.lesson.course = this.modalData.course;
        this.modalData.event.title = this.modalData.student.firstName + ' ' + this.modalData.student.lastName + ' - '
            + this.modalData.course.title + ' - ' + this.modalData.teacher.firstName + ' ' + this.modalData.teacher.lastName;

        lesson.startDate = this.modalData.event.start;
        lesson.endDate = this.modalData.event.end;
        lesson.student = this.modalData.student;
        lesson.teacher = this.modalData.teacher;
        lesson.course = this.modalData.course;
        this.lessonService.updateLesson(lesson).subscribe();
        this.clickevent.emit("saved lesson");
    }

    modalNewLessonSave(): void {
        var lesson = new Lesson();
        lesson.course = this.modalData.course;
        lesson.student = this.modalData.student;
        lesson.teacher = this.modalData.teacher;
        lesson.startDate = this.modalData.newStart;
        lesson.endDate = addMinutes(this.modalData.newStart, this.modalData.length);
        this.lessonService.addLesson(lesson).subscribe(() => {
            this.clickevent.emit("added new lesson");
        });
        if (this.modalData.repeatUntil) {
            while (compareDesc(addDays(lesson.startDate, 7), this.modalData.repeatUntil) == 1) {
                lesson.startDate = addDays(lesson.startDate, 7);
                lesson.endDate = addMinutes(lesson.startDate, this.modalData.length);
                this.lessonService.addLesson(lesson).subscribe(() => {
                    this.clickevent.emit("added new lesson");
                });
            }
        }
    }

    isDisabled(): boolean {
        if(this.modalData.newStart == null || this.modalData.student == null ||
            this.modalData.course == null || this.modalData.teacher == null)
            return true;
        else return false;
    }


    students$: Observable<User[]>;
    teachers$: Observable<User[]>;
    courses$: Observable<Course[]>;
    private searchTermsStudent = new Subject<string>();
    private searchTermsTeacher = new Subject<string>();
    private searchTermsCourses = new Subject<string>();


    selectStudent(user: User): void {
        this.modalData.student = user;
        this.searchStudents('');
    }

    selectTeacher(user: User): void {
        this.modalData.teacher = user;
        this.searchTeachers('');
    }

    selectCourse(course: Course): void {
        this.modalData.course = course;
        this.searchCourses('');
    }

    searchStudents(term: string): void {
        this.searchTermsStudent.next(term);
    }
    searchTeachers(term: string): void {
        this.searchTermsTeacher.next(term);
    }

    searchCourses(term: string): void {
        this.searchTermsCourses.next(term);
    }

    fetchData(): void {
        this.students$ = this.searchTermsStudent.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => this.userService.searchUsers(term, "lastName", Role.Student),
            ),
        );

        this.teachers$ = this.searchTermsTeacher.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => this.userService.searchUsers(term, "lastName", Role.Teacher),
            ),
        );

        this.courses$ = this.searchTermsCourses.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => this.courseService.searchCourses(term),
            ),
        );
    }
}