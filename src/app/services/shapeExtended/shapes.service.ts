import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Layer, LeafletMouseEvent } from 'leaflet';

import { IStyle } from '../../models/interfaces/style.interface';

import { SimpleShapeService } from '../shapeSimple/simple-shape.service';

import { StorageService } from '../storage/storage.service';
import { IsElemInArrayService } from '../utils/isElemInArray/is-elem-in-array.service';
import { RepositoryService } from '../../models/repository/repository.service';
import { InfoPanelService } from '../infoPanel/info-panel.service';

import { Observable, of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

@Injectable()
export class ShapesService extends SimpleShapeService {
  private clickedLayer: Layer;
  private regions: Layer;
  private readonly regionsGeoJSONList: string;

  constructor(
    private storage: StorageService,
    private isElemInArray: IsElemInArrayService,
    private repo: RepositoryService,
    protected infoPan: InfoPanelService
  ) {
    super(infoPan);
    this.regionsGeoJSONList = '../../assets/constituentEntities/regionsAZRF.json';
  }

  /**
   *
   * Метод для инициализации слоя с данными из geoJSON с обработчиками событий
   *
   * @param shape - данные в формате geoJSON
   * @param myMap - карта, куда нужно добавить слой
   * @param constituentEntities - массив с субъектами РФ для стилизации
   *
   * @return - стилизованый слой, с обработкой событий, готовый для добавления на карту
   *
   */
  public initClickableShapes(shape, myMap, constituentEntities: string[]): Layer {
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
            if (isPresent) {
              myMap.fitBounds(e.target.getBounds()); // Отображаем элемент с макс зумом

              /**
               * Получаю данные о регионах "кликнутого" субъекта
               * Если есть url, передаю в запрос на получение geoJSON
               */
              const result: Observable<any> = this.repo.getDataResult(this.regionsGeoJSONList, 'РегионыАЗРФ');
              result.pipe(
                map(val => {
                  /**
                   * Сохраняем данные локально (в будущем сэкономит трафик и увеличит скорость(не будет сетевых запросов)
                   */
                  this.storage.saveToStorage('РегионыАЗРФ', val);

                  return val.regions?.filter(item => item.title === feature.properties.NAME);
                }),
                map(item => {
                  const val: object | undefined = item?.pop();
                  // @ts-ignore
                  const url: string = !val?.url ? '' : val.url;
                  // @ts-ignore
                  const label: string = val?.title;
                  return { url, label };
                }),
                exhaustMap(({ url, label }) => {
                  return url.length ? this.repo.getDataResult(url, label) : of([]);
                })
              ).subscribe({
                next: value => {
                  /**
                   * Сохраняем данные локально (в будущем сэкономит трафик и увеличит скорость(не будет сетевых запросов)
                   */
                  this.storage.saveToStorage(value.name, value);

                  // @ts-ignore
                  // tslint:disable-next-line:no-unused-expression
                  this.regions?.options ? this.regions.remove() : ''; // Удаляем границы регионов показанные ранее (если таковы есть)
                  /**
                   * Если клик по субъекту АЗРФ, то стираем границы субъекта и рисуем регионы внутри него
                   */
                  if (feature.properties.NAME === value.name) {
                    this.regions = this.initShapes(value, feature.properties.NAME);
                    myMap.addLayer(this.regions);
                  }
                  // @ts-ignore
                  // tslint:disable-next-line:no-unused-expression
                  this.clickedLayer?.feature ? myMap.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион (если такой есть)
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
