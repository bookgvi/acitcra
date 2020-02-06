export class BaseFeatures {
  public style: object;

  constructor() {
    this.style = {
      weight: 2,
      opacity: 0.5,
      color: '#30363D',
      fillOpacity: 0.8,
      fillColor: '#7BC9E9'
    };
  }
  public setFeature(e)  {
    const layer = e.target;
    layer.setStyle(this.style);
  }
}
