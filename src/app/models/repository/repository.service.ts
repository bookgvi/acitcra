import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataSourceService } from '../dataSource/data-source.service';
import { StorageService } from '../../services/storage/storage.service';

@Injectable()
export class RepositoryService {

  constructor(
    private ds: DataSourceService,
    private storage: StorageService
  ) { }

  /**
   * Поредварительная обработка данных загруженных методом this.ds.requestData
   *
   * @param url - url запроса
   * @param label - ключ, по которому данные будут сохранены в хранилище (фронт... локал сторадж, сессион сторадж, Redux и др..)
   * @return - Observable для работы с загруженными данными
   *
   */
  public getDataResult(url: string, label?: string): Observable<any> {
    // tslint:disable-next-line:no-unused-expression
    const result: {} = label ? this.storage.getFromStorage(label) : null;
    return result ? of(result) :
      this.ds.requestData(url).pipe(
        retry(3),
        catchError(err => {
            console.warn('...Error catcher: ', err.statusText);
            return of([]);
          }
        )
      );
  }
}
