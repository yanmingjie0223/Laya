/*
* name;
*/
var BaseModel = (function () {

    /**
     * 构造函数
     * @param controller 所属模块
     */
    function BaseModel(controller) {
        this._controller = controller;
        this._controller.setModel(this);
    }

    Laya.class(BaseModel, "BaseModel");

    return BaseModel;
}());