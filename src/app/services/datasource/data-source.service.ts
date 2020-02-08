import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataSourceService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_2.geojson';
  }

  public getShape(url: string = this.url): Observable<any> {
    return this.http.get(url);
  }

  public saveShapeToSS(params: Object): void {
    window.sessionStorage.setItem('checkedShape', JSON.stringify(params));
  }
  public getShapeFromSS(): object {
    return JSON.parse(window.sessionStorage.getItem('checkedShape'));
  }
}
