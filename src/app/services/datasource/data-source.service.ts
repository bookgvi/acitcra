import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataSourceService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_2.geojson';
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
  public getShape(url: string = this.url): Observable<any> {
    return this.http.get(url);
  }

  /**
   *
   * Сохранение информации в sessionStorage
   *
   * @param params - объект с данными для сохранения
   *
   */
  public saveShapeToSS(params: Object): void {
    window.sessionStorage.setItem('checkedShape', JSON.stringify(params));
  }

  /**
   *
   * Метод возвращающий данные, сохраненные в sessionStorage
   *
   * @return - объект с данными
   *
   */
  public getShapeFromSS(): object {
    return JSON.parse(window.sessionStorage.getItem('checkedShape'));
  }
}
