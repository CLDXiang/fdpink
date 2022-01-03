import { Instructor } from 'src/entities/instructor';
import { Connection, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('instructor.id', 'id')
      .addSelect('instructor.department', 'department')
      .addSelect('instructor.name', 'name')
      .from(Instructor, 'instructor'),
})
export class InstructorView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  department: string;

  @ViewColumn()
  name: string;
}
