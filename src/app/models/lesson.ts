import { Course } from './course';
import { User } from './user';

export class Lesson {
    id: number;
    student: User;
    teacher: User;
    course: Course;
    startDate: Date;
    endDate: Date;
}