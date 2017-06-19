var Main = (function(){
	function Main(){
		this.init();
	}

	Laya.class(Main, "Main");
	var _proto_ = Main.prototype;

	_proto_.start = function(){
		App.SceneManager.runScene(SceneConst.HOME);
	}

	_proto_.init = function(){
		App.StageUtils.init();

		//注册场景
		App.SceneManager.register(SceneConst.HOME, new HomeScene());
	}

	return Main;
}());

var main = new Main();
main.start();