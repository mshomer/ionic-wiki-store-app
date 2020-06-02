import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'limitTo' })
export class LimitToPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!limit || value.length < limit) {
      return value;
    }

    return value.slice(0, limit) + '...';
  }
}
