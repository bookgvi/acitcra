import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataSourceService } from '../dataSource/data-source.service';

@Injectable()
export class RepositoryService {

  constructor(private ds: DataSourceService) { }

  /**
   * Поредварительная обработка данных загруженных методом this.ds.requestData
   *
   * @param url - url запроса
   * @return - Observable для работы с загруженными данными
   *
   */
  public getDataResult(url: string): Observable<any> {
    return this.ds.requestData(url).pipe(
      retry(3),
      catchError(err => {
          console.warn('...Error catcher: ', err.statusText);
          return of([]);
        }
      )
    );
  }
}
