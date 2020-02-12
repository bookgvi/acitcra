import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Layer, LeafletMouseEvent } from 'leaflet';

import { IStyle } from '../../models/interfaces/style.interface';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';

import { StorageService } from '../storage/storage.service';
import { IsElemInArrayService } from '../utils/isElemInArray/is-elem-in-array.service';
import { RepositoryService } from '../../models/repository/repository.service';
import { InfoPanelService } from '../infoPanel/info-panel.service';

import { Observable, of, from } from 'rxjs';
import { catchError, filter, map, switchMap, exhaustMap } from 'rxjs/operators';

@Injectable()
export class ShapesService {
  private baseStyle: BaseFeatures;
  private highlight: BaseFeatures;
  private azrfStyle: BaseFeatures;
  private clickedLayer: Layer;
  private regions: Layer;
  private readonly regionsGeoJSONList: string;

  constructor(
    private storage: StorageService,
    private isElemInArray: IsElemInArrayService,
    private repo: RepositoryService,
    private infoPanel: InfoPanelService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
    this.regionsGeoJSONList = '../../assets/constituentEntities/regionsAZRF.json';
  }

  /**
   *
   * Метод для инициализации данных из geoJSON
   *
   * @param shape - данные в формате geoJSON
   * @param subject - Название текущего субъекта РФ, для отображения в инфопанеле
   * @return - стилизованый слой, готовый для добавления на карту
   *
   */
  private initShapes(shape, subject: string = 'Россия'): Layer {
    return L.geoJSON(shape, {
      style: (feature: any): IStyle => {
        return this.azrfStyle.style;
      },
      onEachFeature: (feature: any, layer: Layer): void => {
        layer.on({
          mouseover: (e: LeafletMouseEvent): void => {
            this.infoPanel.changeSubTitle(subject, `
            ${ feature.name }
            `);
            this.highlight.setFeature(e);
          },
          mouseout: (e: LeafletMouseEvent): void => {
            this.azrfStyle.setFeature(e);
          }
        });
      }
    });
  }

  /**
   *
   * Метод для инициализации слоя с данными из geoJSON с обработчиками событий
   *
   * @param shape - данные в формате geoJSON
   * @param mymap - карта, куда нужно добавить слой
   * @param constituentEntities - массив с субъектами РФ для стилизации
   *
   * @return - стилизованый слой, с обработкой событий, готовый для добавления на карту
   *
   */
  public initClickableShapes(shape, mymap, constituentEntities: string[]): Layer {
    return L.geoJSON(shape, {
      style: (feature: any): IStyle => {
        return this.isElemInArray.check(feature?.properties?.NAME, constituentEntities) ? this.azrfStyle.style : this.baseStyle.style;
      },
      /**
       * Методы обработки событий мыши
       */
      onEachFeature: (feature: any, layer: Layer) => {
        const isPresent: boolean = this.isElemInArray.check(feature?.properties?.NAME || feature?.name, constituentEntities);
        layer.on({
          mouseover: (e: LeafletMouseEvent): void => {
            // tslint:disable-next-line:no-unused-expression
            isPresent ? this.highlight.setFeature(e) : ''; // подсвечиваем элемент под курсором
          },
          mouseout: (e: LeafletMouseEvent): void => {
            // tslint:disable-next-line:no-unused-expression
            isPresent ? this.azrfStyle.setFeature(e) : ''; // возвращаем начальный стиль
          },
          click: (e: LeafletMouseEvent): void => {
            // console.log(JSON.stringify(feature));
            /**
             * TODO: вернуть правильную проверку!!!
             */
            if (isPresent || !isPresent) {
              // mymap.fitBounds(e.target.getBounds()); // Отображаем элемент с макс зумом

              /**
               * Получаю данные о регионах "кликнутого" субъекта
               * Если есть url, передаю в запрос на получение geoJSON
               */
              const result: Observable<any> = this.repo.getDataResult(this.regionsGeoJSONList);
              result.pipe(
                map(({ regions }) => regions.filter(item => item.title === feature.properties.NAME)),
                map(item => {
                  const val: object | undefined = item.pop();
                  // @ts-ignore
                  return !val?.url ? '' : val.url;
                }),
                exhaustMap(url => {
                  return url.length ? this.repo.getDataResult(url) : of([]);
                })
              ).subscribe({
                next: value => {
                  // @ts-ignore
                  // tslint:disable-next-line:no-unused-expression
                  this.regions?.options ? this.regions.remove() : ''; // Удаляем границы регионов показанные ранее (если таковы есть)
                  /**
                   * Если клик по субъекту АЗРФ, то стираем границы субъекта и рисуем регионы внутри него
                   */
                  if (feature.properties.NAME === value.name) {
                    this.regions = this.initShapes(value, feature.properties.NAME);
                    mymap.addLayer(this.regions);
                  }
                  // @ts-ignore
                  // tslint:disable-next-line:no-unused-expression
                  this.clickedLayer?.feature ? mymap.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион (если такой есть)
                  this.storage.saveToStorage('shape', { isClicked: true, subject: feature }); // Сохраняем на всяк случай в сторадж

                  /**
                   * Перед удалением устанавливаем основной стиль для АЗРФ, сохраняем этот элемент(layer) и удаляем его
                   */
                  this.azrfStyle.setFeature(e);
                  this.clickedLayer = layer;
                  layer.remove();
                }
              });
            }
          }
        });
      }
    });
  }
}
