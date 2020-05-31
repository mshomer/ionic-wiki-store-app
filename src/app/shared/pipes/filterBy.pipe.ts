import { Pipe, PipeTransform } from '@angular/core';
import { filter, includes } from 'lodash';

@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
  transform(array: any[], obj: {}): any[] {
    if (obj === null) {
      return null;
    }
    if (!array || obj === undefined) {
      return array;
    } // no array
    if (array.length <= 1) {
      return array;
    } // array with only one item

    if (Array.isArray(obj)) {
      return (obj as []).reduce((filteredArray: [], currentObject: {}) => {
        return filteredArray.concat(this.prediction(array, currentObject));
      }, []);
    }

    return this.prediction(array, obj);
  }

  prediction(array, obj) {
    const keys = Object.keys(obj);
    if (keys.length > 0) {
      const key = keys[0];
      return filter(array, (item) => {
        const value = obj[key];
        if (typeof item[key] === 'number') {
          if (typeof value !== 'number') {
            return item[key] >= value.lower && item[key] <= value.upper;
          }

          return item[key] >= value && item[key] <= value;
        } else if (typeof value === 'string') {
          return includes(item[key].toLowerCase(), obj[key].toLowerCase());
        } else {
          return item[key] === obj[key];
        }
      });
    }
    return array;
  }
}
