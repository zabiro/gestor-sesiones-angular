import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], field: keyof T, value: string): T[] {
    if (!items || !value) {
      return items;
    }
    return items.filter(item => {
      const itemValue = String(item[field]).toLowerCase();
      return itemValue.includes(value.toLowerCase());
    });
  }
}
