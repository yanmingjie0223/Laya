/*
* name;
*/
class App {

    constructor() {}

    /**
     * 生成获取类
     */
    static get ClassManager() {
        return ClassManager.getInstance();
    }

    /**
     * font字体注册
     */
    static get FontManager() {
        return FontManager.getInstance();
    }

    /**
     * view控制
     */
    static get ViewManager() {
        return ViewManager.getInstance();
    }

    /**
     * 场景控制
     */
    static get SceneManager() {
        return SceneManager.getInstance();
    }

    /**
     * 消息控制中心
     */
    static get MessageCenter() {
        return MessageCenter.getInstance();
    }

    /**
     * 游戏socket
     */
    static get Socket() {
        return GameSocket.getInstance(gameSocketConfig);
    }

    /**
     * 单例音乐控制类型
     */
    static get AudioManager() {
        return AudioManager.getInstance();
    }

    /**
     * 单例获取控制类
     */
    static get ControllerManager() {
        return ControllerManager.getInstance();
    }

    /**
     * 单例获取protobuf控制类
     */
    static get ProtobufManager() {
        return ProtobufManager.getInstance();
    }

    /**
     * 单例获取公共加载旋转界面类
     */
    static get EasyLoading() {
        return EasyLoading.getInstance();
    }

    /**
     * 单例获取数组工具类
     */
    static get ArrayUtils() {
        return ArrayUtils.getInstance();
    }

    /**
     * 单例获取其他工具类
     */
    static get CommonUtils() {
        return CommonUtils.getInstance();
    }

     /**
     * 单例获取时间工具类
     */
    static get DateUtils() {
        return DateUtils.getInstance();
    }

    /**
     * 单例获取调试工具类
     */
    static get DebugUtils() {
        return DebugUtils.getInstance();
    }

    /**
     * 单例获取显示容器工具类
     */
    static get DisplayUtils() {
        return DisplayUtils.getInstance();
    }

    /**
     * 单例获取特效工具类
     */
    static get EffectUtils() {
        return EffectUtils.getInstance();
    }

    /**
     * 单例获取number处理工具类
     */
    static get MathUtils() {
        return MathUtils.getInstance();
    }

    /**
     * 单例获取随机工具类
     */
    static get RandomUtils() {
        return RandomUtils.getInstance();
    }

    /**
     * 单例获取加载工具类，注：所有加载都通过这个加载
     */
    static get ResourceUtils() {
        return ResourceUtils.getInstance();
    }

    /**
     * 单例获取舞台工具类（包含：舞台初始化、舞台宽高获取等）
     */
    static get StageUtils() {
        return StageUtils.getInstance();
    }

    /**
     * 单例获取字符串工具类
     */
    static get StringUtils() {
        return StringUtils.getInstance();
    }

    /**
     * 单例获取md5加密工具类
     */
    static get MD5() {
        return MD5.getInstance();
    }

    /**
     * 单例获取sha1加密工具类
     */
    static get SHA1() {
        return SHA1.getInstance();
    }

}