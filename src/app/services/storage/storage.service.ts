import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  /**
   *
   * Сохранение информации в sessionStorage
   *
   * @param keyName - имя поля в сторадже
   * @param params - объект с данными для сохранения
   *
   */
  public saveToStorage(keyName: string, params: object): void {
    // tslint:disable-next-line:no-unused-expression
    if (!this.getFromStorage(keyName)) {
      try {
        window.sessionStorage.setItem(keyName, JSON.stringify(params));
      } catch (err) {
        console.warn('...Catched storage error', err.message);
      }
    }
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
