import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class InfoPanelService {

  constructor() {
  }

  /**
   *
   * Создание панели с информацией о названии региона, по наведению мыши. Расположен в правом верхнем углу карты
   *
   * @param MAP
   *
   * @return infoPanel - объект с HTML для вставки в угол карты
   *
   */
  public initInfoPanel(_div): object {
    const info = L.control();
    info.onAdd = () => _div;
    return info;
  }

}
