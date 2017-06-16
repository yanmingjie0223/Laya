/*
* name;
*/
var BaseSprite = (function () {

    function BaseSprite() {
        BaseSprite.__super.call(this);
    }

    Laya.class(BaseSprite, "BaseSprite", Laya.Sprite);

    /**
     * 获取单例
     */
    BaseEventDispatcher.getInstance = function () {
        var args = arguments;
        var Class = this;
        if (!Class._instance) {
            var argsLen = args.length;
            switch(argsLen){
                case 0:
                    Class._instance = new Class();
                    break;
                case 1:
                    Class._instance = new Class(args[0]);
                    break;
                case 2:
                    Class._instance = new Class(args[0], args[1]);
                    break;
                case 3:
                    Class._instance = new Class(args[0], args[1], args[2]);
                    break;
                case 4:
                    Class._instance = new Class(args[0], args[1], args[2], args[3]);
                    break;
                case 5:
                    Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
                    break;
                case 6:
                    Class._instance = new Class(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
            }
        }
        return Class._instance;
    }

    return BaseSprite;
}());