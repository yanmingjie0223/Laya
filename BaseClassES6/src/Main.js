
class Main {

	constructor(){
		this.init();
	}

	start() {
		App.SceneManager.runScene(SceneConst.HOME);
	}

	init() {
		App.DebugUtils.isDebug = true;
		App.StageUtils.init();

		//注册场景
		App.SceneManager.register(SceneConst.HOME, new HomeScene());
	}

}

let main = new Main();
main.start();