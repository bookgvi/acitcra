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
   * @param div - HTML div
   *
   * @return infoPanel - объект с HTML для вставки в угол карты
   *
   */
  public initInfoPanel(div: HTMLElement): object {
    // @ts-ignore
    const info: Control = L.control();
    info.onAdd = () => div;
    return info;
  }

}
