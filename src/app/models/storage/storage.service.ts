import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }
  /**
   *
   * Сохранение информации в sessionStorage
   *
   * @param params - объект с данными для сохранения
   *
   */
  public saveToStorage(keyName: string, params: Object): void {
    window.sessionStorage.setItem(keyName, JSON.stringify(params));
  }

  /**
   *
   * Метод возвращающий данные, сохраненные в sessionStorage
   *
   * @return - объект с данными
   *
   */
  public getFromStorage(keyName: string): object {
    return JSON.parse(window.sessionStorage.getItem(keyName));
  }

}
