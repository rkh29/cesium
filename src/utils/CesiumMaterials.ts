import * as Cesium from "cesium";

export class PolylineTrailLinkMaterialProperty {
  _definitionChanged: any;
  _color: any;
  _colorSubscription: any;
  _time: number;
  duration: number;

  constructor(color = Cesium.Color.CYAN, duration = 3000) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = new Date().getTime();
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  // @ts-ignore
  getType(time: any) {
    return "PolylineTrailLink";
  }

  getValue(time: any, result: any) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    // @ts-ignore
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color,
    );
    // 计算 0-1 的时间因子
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result;
  }

  equals(other: any) {
    return (
      this === other ||
      (other instanceof PolylineTrailLinkMaterialProperty &&
        // @ts-ignore
        Cesium.Property.equals(this._color, other._color))
    );
  }

  get color() {
    return this._color;
  }

  set color(value) {
    const oldValue = this._color;
    if (oldValue !== value) {
      this._color = new Cesium.ConstantProperty(value);
      this._definitionChanged.raiseEvent(this, "color", value, oldValue);
    }
  }
}

// 注册材质
export function registerCesiumMaterials() {
  // @ts-ignore
  if (Cesium.Material._materialCache._materials["PolylineTrailLink"]) return;

  const type = "PolylineTrailLink";

  const source = `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;

            float t = fract(time);
            float pct = st.s - t;

            if (pct < 0.0) pct += 1.0;

            float alpha = pow(1.0 - pct, 10.0);

            if (pct < 0.05) alpha += 0.5;

            material.diffuse = color.rgb;
            material.alpha = color.a * alpha;

            material.emission = material.diffuse * 2.0;

            return material;
        }
    `;

  // @ts-ignore
  Cesium.Material._materialCache.addMaterial(type, {
    fabric: {
      type: type,
      uniforms: {
        color: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
        time: 0.0,
      },
      source: source,
    },
    // @ts-ignore
    translucent: function (material: any) {
      return true;
    },
  });
}
