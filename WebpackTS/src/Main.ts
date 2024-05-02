import { Point, Greeter } from "./DecoratorTest";

export default class Main {

    constructor() {
        this.initStage();
    }

    private initStage() {
        Laya.init(600, 400);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;

        this.greeterTest();
    }

    private greeterTest(): void {
        const greeter: Greeter = new Greeter("haha");
        console.log(greeter.greet("dar", 22), greeter.point = new Point(2, 3));
    }

}