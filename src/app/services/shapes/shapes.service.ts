import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ShapesService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_7_modif.json';
  }
  getShape(): Observable<any> {
    return this.http.get(this.url);
  }
}
