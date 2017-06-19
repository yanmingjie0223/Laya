/*
* name;
*/
var App = (function () {

    function App() {}

    Laya.class(App, "App");
    var _proto_ = App.prototype;
    var _getset_ = Laya.getset;

    /**
     * 场景控制
     */
    _getset_(1, App, "SceneManager",
        function(){
            return SceneManager.getInstance();
        }
    );

    /**
     * 游戏socket
     */
    _getset_(1, App, "Socket",
        function(){
            return GameSocket.getInstance(gameSocketConfig);
        }
    );

    /**
     * 消息控制中心
     */
    _getset_(1, App, "MessageCenter",
        function(){
            return MessageCenter.getInstance();
        }
    );

    /**
     * 单例音乐控制类型
     */
    _getset_(1, App, "AudioManager",
        function(){
            return AudioManager.getInstance();
        }
    );

    /**
     * 单例获取控制类
     */
    _getset_(1, App, "ControllerManager",
        function(){
            return ControllerManager.getInstance();
        }
    );

    /**
     * 单例获取公共加载旋转界面类
     */
    _getset_(1, App, "EasyLoading",
        function(){
            return EasyLoading.getInstance();
        }
    );

    /**
     * 单例获取数组工具类
     */
    _getset_(1, App, "ArrayUtils",
        function(){
            return ArrayUtils.getInstance();
        }
    );

    /**
     * 单例获取其他工具类
     */
    _getset_(1, App, "CommonUtils",
        function(){
            return CommonUtils.getInstance();
        }
    );

     /**
     * 单例获取时间工具类
     */
    _getset_(1, App, "DateUtils",
        function(){
            return DateUtils.getInstance();
        }
    );

    /**
     * 单例获取调试工具类
     */
    _getset_(1, App, "DebugUtils",
        function(){
            return DebugUtils.getInstance();
        }
    );

    /**
     * 单例获取显示容器工具类
     */
    _getset_(1, App, "DisplayUtils",
        function(){
            return DisplayUtils.getInstance();
        }
    );

    /**
     * 单例获取特效工具类
     */
    _getset_(1, App, "EffectUtils",
        function(){
            return EffectUtils.getInstance();
        }
    );

    /**
     * 单例获取number处理工具类
     */
    _getset_(1, App, "MathUtils",
        function(){
            return MathUtils.getInstance();
        }
    );

    /**
     * 单例获取随机工具类
     */
    _getset_(1, App, "RandomUtils",
        function(){
            return RandomUtils.getInstance();
        }
    );

    /**
     * 单例获取加载工具类，注：所有加载都通过这个加载
     */
    _getset_(1, App, "ResourceUtils",
        function(){
            return ResourceUtils.getInstance();
        }
    );

    /**
     * 单例获取舞台工具类（包含：舞台初始化、舞台宽高获取等）
     */
    _getset_(1, App, "StageUtils",
        function(){
            return StageUtils.getInstance();
        }
    );

    /**
     * 单例获取字符串工具类
     */
    _getset_(1, App, "StringUtils",
        function(){
            return StringUtils.getInstance();
        }
    );

    return App;
}());