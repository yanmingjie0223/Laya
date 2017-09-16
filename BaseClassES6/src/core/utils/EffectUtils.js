/*
* name;
*/
class EffectUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 类似mac上图标上下抖动的效果
     * @param obj抖动对象 {Sprite}
     * @param initY 要抖动的对象的初始Y值，原始位置 {number}
     * @param 抖动动画完成回调函数 {function}
     * @param 回调函数this对象 {any}
     */
    macIconShake(obj, initY, callback, thisObj) {
        //抖动频率[时间，移动距离]，可修改
        let arr = [
            [20, 300],
            [15, 300],
            [10, 300],
            [5, 300]
        ];

        let index = 0;
        toShake();

        function toShake(){
            if(index >= arr.length) {
                (callback) && ( callback.apply(thisObj, []) );
            }else{
                Laya.Tween.to(obj, {"y":initY-arr[index][0]}, arr[index][1], null, Laya.Handler.create(null, function(){
                    Laya.Tween.to(obj, {"y":initY}, arr[index][1], null, Laya.Handler.create(null, function(){
                        ++index;
                        toShake();
                    }));
                }));
            }
        }
    }

    /**
     * 向上移动淡出（弹出框）
     * @param 淡出对象 {Sprite}
     * @param 淡出时间 {number}
     * @param 淡出函数 {function}
     * @param 淡出完成回调函数 {function}
     * @param 回调函数this对象 {any}
     * @param 回调传参 {Array}
     */
    flowOut(obj, time = 500, ease = null, callback = null, thisObj = null, arrData = null){
        if(callback){
            Laya.Tween.to(obj, {y:obj.y-150, alpha:0}, time, ease, Laya.Handler.create(thisObj, callback, arrData));
        }else{
            Laya.Tween.to(obj, {y:obj.y-150, alpha:0}, time, ease, Laya.Handler.create(obj, obj.removeSelf, arrData));
        }
    }

    /**
     * 开始闪烁
     * @param obj {Sprite}
     * @param 闪烁频率 {number}
     */
    startFlicker(obj, alphaTime = 700) {
        obj.alpha = 1;
        Laya.Tween.to(obj, {"alpha": 0}, alphaTime, null, Laya.Handler.create(null, function(){
            Laya.Tween.to(obj, {"alpha": 1}, alphaTime, null, Laya.Handler.create(this, this.startFlicker, [obj]));
        }.bind(this)));
    }

    /**
     * 停止动画所有动画后容器位置初始化到原位，否则可能出现位置改变的bug
     * @param obj {Sprite}
     * @param xPos {number}
     * @param yPos {number}
     */
    stopEffect(obj, xPos = null, yPos = null) {
        Laya.Tween.clearAll(obj);
        if(xPos !== null && yPos !== null){
            obj.pos(xPos, yPos);
        }
    }

}