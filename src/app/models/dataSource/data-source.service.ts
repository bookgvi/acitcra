import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataSourceService {

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
  public requestData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
