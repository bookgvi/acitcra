import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Control } from 'leaflet';

@Injectable()
export class InfoPanelService {
  private readonly div: HTMLElement;

  constructor() {
    this.div = this.createHTMLElement();
  }

  /**
   * Создание панели с информацией о названии региона, по наведению мыши. Расположен в правом верхнем углу карты
   *
   * @param div - HTML div
   *
   * @return infoPanel - объект с HTML для вставки в угол карты
   *
   */
  public initInfoPanel(): object {
    // @ts-ignore
    const info: Control = L.control();
    info.onAdd = () => this.div;
    return info;
  }

  /**
   * Создание HTML элемента
   *
   * @return - ссылка на созданный элемент
   *
   */
  private createHTMLElement(): HTMLElement {
    return L.DomUtil.create('div', 'info');
  }

  /**
   * Добавление/Смена текста внутри HTML элемента
   *
   * @param title - текст (можно использовать тэги)
   *
   */
  public changeTitle(title: string): void {
    this.div.innerHTML = title;
  }

  /**
   * Добавление подзаголовка к элементу
   *
   * @param title - заголовок, ниже которого добавить подзаголовок
   * @param subtitle - текст подзаголовка (можно использовать тэги)
   *
   */
  public changeSubTitle(title: string, subtitle: string): void {
    this.div.innerHTML = `<h4>${ title }</h4>`;
    const tag: HTMLElement = document.createElement('h5');
    const subTitle: HTMLElement = this.div.appendChild(tag);
    subTitle.innerHTML = subtitle;
  }

}
