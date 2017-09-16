/*
* name;
*/
class StageUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 初始化舞台
     * @param isWebGL {boolean}
     * @param isDebug {boolean}
     * @param width   {number}
     * @param height  {number}
     * @param color   {string}
     */
    init(isWebGL = true, isDebug = App.DebugUtils.isDebug, width = 1334, height = 750, color = "#808080"){
        //游戏舞台初始化渲染方式：WebGL和canvas（默认canvas）
        if (isWebGL) {
            Laya.init(width, height, Laya.WebGL);
        }else {
            Laya.init(width, height);
        }
        //debug显示
        ( isDebug ) && ( Laya.Stat.show() );
        //自动计算计算量较大，对性能有一定影响,默认为false
        Laya.stage.autoSize = false;
        //帧率类型，支持三种模式：fast-60帧(默认)，slow-30帧，mouse-30帧，但鼠标活动后会自动加速到60，鼠标不动2秒后降低为30帧，以节省消耗
        Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
        //游戏舞台区域对齐方式
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        //"none"：不更改屏幕  "horizontal"：自动横屏  "vertical"：自动竖屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        //游戏舞台颜色
        Laya.stage.bgColor = color;
        //适配方式，完美适配(支持版本1.7.5)
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
    }

    /**
     * get stage
     */
    get stage() {
        return Laya.stage;
    }

    /**
     * get stage width
     */
    get stageW() {
        return Laya.stage.width;
    }

    /**
     * get stage height
     */
    get stageH() {
        return Laya.stage.height;
    }

}