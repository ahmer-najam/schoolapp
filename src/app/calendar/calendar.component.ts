import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  addHours,
  isSameMonth,
  isSameDay,
  differenceInMinutes
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { MessageService } from '../services/message.service';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';
import { Role } from '../models/role'
import { AuthenticationService } from '../services/authentication.service';
import { Course } from '../models/course';
import { ModalContent } from './modal-content';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  lessons: Lesson[];

  view: string = 'week';

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ lesson: Lesson }>>>;

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  currentUser: User;

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

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private lessonService: LessonService,
    private modal: NgbModal,
    public autenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.autenticationService.user;
    this.fetchEvents();
  }

  fetchEvents(): void {
    var resizable = false;
    var draggable = false;
    if (this.currentUser.role == Role.Admin) {
      resizable = true;
      draggable = true;
    }
    this.events$ = this.lessonService.getLessonsByUser(this.currentUser).pipe(map(
      res => {
        return res.map(lesson => {
          return {
            title: lesson.student.firstName + ' ' + lesson.student.lastName + ' - '
              + lesson.course.title + ' - ' + lesson.teacher.firstName + ' ' + lesson.teacher.lastName,
            start: new Date(lesson.startDate),
            end: new Date(lesson.endDate),
            color: colors.yellow,
            resizable: {
              beforeStart: resizable,
              afterEnd: resizable
            },
            draggable: draggable,
            meta: {
              lesson
            }
          };
        })
      }
    ));
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ lesson: Lesson }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  checkIfAdmin(): boolean {
    if (this.currentUser.role == Role.Admin)
      return true;
    return false;
  }


  eventClicked(event: CalendarEvent<{ lesson: Lesson }>): void {
    if (this.currentUser.role != Role.Admin)
      return

    this.modalData = {
      event: event,
      newStart: event.start,
      newEnd: event.end,
      length: differenceInMinutes(event.end, event.start),
      student: event.meta.lesson.student,
      teacher: event.meta.lesson.teacher,
      course: event.meta.lesson.course,
      repeatUntil: null,
      newLesson: false,
      title: 'Edit lesson'
    }
    this.messageService.add(event.meta.lesson.startDate.toString());

    const modalRef = this.modal.open(ModalContent);
    modalRef.componentInstance.modalData = this.modalData;
    modalRef.componentInstance.clickevent.subscribe(($e) => {
      this.messageService.add($e);
      this.refresh.next();
    })
  }

  addNewEventButtonClick(): void {
    var date = new Date();
    this.modalData = {
      event: null,
      newStart: date,
      newEnd: addHours(date, 1),
      length: 60,
      student: null,
      teacher: null,
      course: null,
      repeatUntil: null,
      newLesson: true,
      title: 'Add new lesson'
    }

    const modalRef = this.modal.open(ModalContent);
    modalRef.componentInstance.modalData = this.modalData;
    modalRef.componentInstance.clickevent.subscribe(($e) => {
      this.messageService.add($e);
      this.fetchEvents();
      this.refresh.next();
    })
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    let lesson: Lesson = event.meta.lesson;
    lesson.startDate = newStart;
    lesson.endDate = newEnd;
    this.lessonService.updateLesson(lesson).subscribe();
    this.refresh.next();
  }
}