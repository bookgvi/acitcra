import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataSourceService {
  private url: string;

  constructor(private http: HttpClient) {
  }

  /**
   *
   * Метод для получения данных в формате geoJSON. Используется HTTP метод GET
   *
   * @param url -  адрес содержащий нужные данные
   *
   * @return - Observable
   *
   */
  public getData(url: string): Observable<any> {
    return this.http.get(url);
  }

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
