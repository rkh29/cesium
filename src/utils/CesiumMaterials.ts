
import * as Cesium from 'cesium'

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
        this._time = (new Date()).getTime();
    }

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    // @ts-ignore
    getType(time: any) {
        return 'PolylineTrailLink';
    }

    getValue(time: any, result: any) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        // @ts-ignore
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        // 计算 0-1 的时间因子
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;
    }

    equals(other: any) {
        return (this === other ||
            (other instanceof PolylineTrailLinkMaterialProperty &&
                // @ts-ignore
                Cesium.Property.equals(this._color, other._color)));
    }

    get color() {
        return this._color;
    }

    set color(value) {
        const oldValue = this._color;
        if (oldValue !== value) {
            this._color = new Cesium.ConstantProperty(value);
            this._definitionChanged.raiseEvent(this, 'color', value, oldValue);
        }
    }
}

// 注册材质
export function registerCesiumMaterials() {
    // @ts-ignore
    if (Cesium.Material.PolylineTrailLinkType) return;

    // @ts-ignore
    Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
    
    // @ts-ignore
    Cesium.Material.PolylineTrailLinkSource = `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            // float time = materialInput.s; // 移除这行，使用 uniform time
            
            // 获取 uniforms
            // 注意：Cesium shader 中访问 uniform 需要通过 fabric 定义的变量名
            // 但在 material source 中，uniforms 直接可用
            
            // 计算流光
            // pct 是当前像素 st.s 相对于时间 time 的位置
            // 我们希望光亮区域随 time 从 0 移动到 1
            
            // 循环效果
            float t = fract(time);
            float pct = st.s - t;
            
            // 修正负数，让它循环
            if (pct < 0.0) pct += 1.0;
            
            // pct 越小（越接近 t），越亮
            // 加上指数衰减，形成拖尾
            float alpha = pow(1.0 - pct, 10.0); // 10.0 控制拖尾长度和锐度
            
            // 头部高亮增强
            if (pct < 0.05) alpha += 0.5;
            
            material.diffuse = color.rgb; // color 是 uniform
            material.alpha = color.a * alpha;
            
            // 发光增强
            material.emission = material.diffuse * 2.0;
            
            return material;
        }
    `;
    
    // @ts-ignore
    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
        fabric: {
            // @ts-ignore
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
                time: 0.0
            },
            // @ts-ignore
            source: Cesium.Material.PolylineTrailLinkSource
        },
        // @ts-ignore
        translucent: function(material: any) {
            return true;
        }
    });
}
