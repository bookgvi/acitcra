import { Injectable } from '@angular/core';

@Injectable()
export class IsElemInArrayService {

  constructor() { }
  /**
   *
   * Метод поиска элемента в массиве
   *
   * @param item - элемент, который ищется
   * @param list - Массив, в котором идет поиск
   *
   * @return - возвращает true, если элемент найден в массиве, иначе false
   *
   */
  public check(item: string, list: string[]): boolean {
    return list.indexOf(item) !== -1 ? true : false;
  }

}
