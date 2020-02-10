import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Control } from 'leaflet';

@Injectable()
export class InfoPanelService {

  constructor() {
  }

  /**
   *
   * Создание панели с информацией о названии региона, по наведению мыши. Расположен в правом верхнем углу карты
   *
   * @param map - карта
   *
   * @return infoPanel - объект с HTML для вставки в угол карты
   *
   */
  public initInfoPanel(div): object {
    // @ts-ignore
    const info: Control = L.control();
    info.onAdd = () => div;
    return info;
  }

}
