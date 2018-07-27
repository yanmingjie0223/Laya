/*
* name;
*/
class EffectUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 类似mac上图标上下抖动的效果
     * @param {Sprite} obj 抖动对象
     * @param {number} initY 要抖动的对象的初始Y值，原始位置
     * @param {Function} callback 抖动动画完成回调函数
     * @param {any} thisObj 回调函数this对象
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
            if (index >= arr.length) {
                (callback) && ( callback.apply(thisObj, []) );
            }
            else {
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
     * @param {Sprite} obj 淡出对象
     * @param {number} time 淡出时间
     * @param {Function} ease 淡出函数
     * @param {Function} callback 淡出完成回调函数
     * @param {any} thisObj 回调函数this对象
     * @param {Array} arrData 回调传参
     */
    flowOut(obj, time = 500, ease = null, callback = null, thisObj = null, arrData = null){
        if (callback) {
            Laya.Tween.to(obj, {y:obj.y-150, alpha:0}, time, ease, Laya.Handler.create(thisObj, callback, arrData));
        }
        else {
            Laya.Tween.to(obj, {y:obj.y-150, alpha:0}, time, ease, Laya.Handler.create(obj, obj.removeSelf, arrData));
        }
    }

    /**
     * 文本数字增减效果
     * @param {number} startNum 开始数值
     * @param {number} endNum 渐变到的数值
     * @param {Function} callback 淡出完成回调函数
     * @param {any} thisObj 回调函数this对象
     */
    flowNum(startNum, endNum, callback, thisObj = null) {
        let change = Math.abs(endNum - startNum);
        if (change <= 0) return;
        let everyChange = change / (endNum - startNum);
        let currNum = startNum;
        let timer = new Laya.Timer();
        timer.loop(30, this, changeFun);

        function changeFun() {
            currNum += everyChange;
            --change;
            if (change < 0) {
                timer.clearAll(this);
                timer = null;
            }
            else {
                callback && callback.apply(thisObj, [currNum]);
            }
        }
    }

    /**
     * 开始闪烁
     * @param {Sprite} obj
     * @param {number} alphaTime 闪烁频率
     */
    startFlicker(obj, alphaTime = 700) {
        obj.alpha = 1;
        Laya.Tween.to(obj, {"alpha": 0}, alphaTime, null, Laya.Handler.create(null, function(){
            Laya.Tween.to(obj, {"alpha": 1}, alphaTime, null, Laya.Handler.create(this, this.startFlicker, [obj]));
        }.bind(this)));
    }

    /**
     * 停止动画所有动画后容器位置初始化到原位，否则可能出现位置改变的bug
     * @param {Sprite} obj
     * @param {number} xPos
     * @param {number} yPos
     */
    stopEffect(obj, xPos = null, yPos = null) {
        Laya.Tween.clearAll(obj);
        if (xPos !== null && yPos !== null) {
            obj.pos(xPos, yPos);
        }
    }

    /**
     * 点击放大缩小效果
     * @param {Laya.Sprite}
     * @param {boolean} isChangeXY 如果中心点是锚点不需要修改位置
     */
    clickEffect(sp, isChangeXY = true) {
        if (!sp) return;
        sp.off(Laya.Event.MOUSE_DOWN, this, this.cubicInOutEffect);
        sp.on(Laya.Event.MOUSE_DOWN, this, this.cubicInOutEffect, [sp, isChangeXY]);
    }
    clearClickEffect(sp) {
        if (!sp) return;
        sp.off(Laya.Event.MOUSE_DOWN, this, this.cubicInOutEffect);
    }
    cubicInOutEffect(sp, isChangeXY) {
        if (sp._aniButtonEffect) return;
        sp._aniButtonEffect = true;
        let _x = sp.x;
        let _y = sp.y;
        let _scaX = sp.scaleX;
        let _scaY = sp.scaleY;
        let _bigX, _bigY;
        if (!isChangeXY) {
            _bigX = _x - ((sp.width * 0.1) >> 1);
            _bigY = _y - ((sp.height * 0.1) >> 1);
        }
        else {
            _bigX = _x;
            _bigY = _y;
        }
        Laya.Tween.to(sp, {x: _bigX, y: _bigY, scaleX: 1.1 * _scaX, scaleY: 1.1 * _scaY}, 100, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(sp, {x: _x, y: _y, scaleX: _scaX, scaleY: _scaY}, 100, null, Laya.Handler.create(this, () => {
                if (!sp.destroyed) {
                    sp._aniButtonEffect = false;
                }
            }));
        }));
    }

}