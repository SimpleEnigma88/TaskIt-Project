import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './task.model';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(tasks: Task[], filterName: string, value: string): Task[] {
    if (!tasks || !filterName || !value) {
      return tasks;
    }

    if (filterName === 'status') return tasks.filter(task => task.status === value);
    if (filterName === 'priority') return tasks.filter(task => task.priority === value);
  }

}
