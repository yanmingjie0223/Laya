/*
* name;
*/
class SceneManager extends BaseClass {

    constructor() {
        super();
        //所有注册场景
        this._scenes = {};
        //当前显示场景
        this._currScene = null;
    }

    /**
     * 清空处理
     * @param {any} key Scene唯一标识
     */
    clear(key) {
        let scene = this._scenes[key];
        if (scene) {
            if (scene == this._currScene) {
                scene.onExit();
                this._currScene = null;
            }
            delete this._scenes[key];
        }
    }

    /**
     * 清理所有
     */
    clearAll() {
        if (this._currScene) {
            this._currScene.onExit();
            this._currScene = null;
        }
        this._scenes = {};
    }

    /**
     * 注册Scene
     * @param {any} key Scene唯一标识
     * @param {BaseScene} scene Scene对象
     */
    register(key, scene) {
        this._scenes[key] = scene;
    }

    /**
     * 注销Scene
     * @param {any} key Scene唯一标识
     */
    unregister(key) {
        if(this._scenes && this._scenes[key]){
            delete this._scenes[key];
        }
    }

    /**
     * 切换场景
     * @param {any} key 场景唯一标识
     */
    runScene(key) {
        let nowScene = this._scenes[key];
        if (!nowScene) {
            Logger.trace("场景" + key + "不存在");
            return;
        }

        if (this._currScene) {
            this._currScene.onExit();
        }

        nowScene.onEnter();
        this._currScene = nowScene;
    }

    /**
     * 获取当前Scene
     * @returns {any}
     */
    getCurrScene() {
        return this._currScene;
    }

    /**
     * 获取scene
     * @param key 场景唯一标识
     */
    getScene(key){
        let scene = this._scenes[key];
        if (scene) {
            return scene;
        }
        Logger.log(key + "场景不存在！");
        return null;
    }

}