import "reflect-metadata";

export class Point {
    private _x: number;
    private _y: number;

    public constructor(_x?: number, _y?: number) {
        this.x = _x;
        this.y = _y;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }
    public get y(): number {
        return this._y;
    }

}

@classDecorator
export class Greeter {
    @format()
    private greeting: string;
    private _x: number;
    private _y: number;
    private _point: Point;

    public constructor(message: string) {
        this.greeting = message;
    }

    @register(false)
    public greet(@required name: string, age: number): string {
        return "Hello, " + this.greeting;
    }

    @configurable()
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }

    @configurable()
    public set y(value: number) {
        this._y = value;
    }
    public get y(): number {
        return this._y;
    }

    @validate
    @Reflect.metadata("design:type", Point)
    public set point(value: Point) {
        this._point = value;
    }
    public get point(): Point {
        return this._point;
    }
}

/**
 * 方法装饰器
 */
function register(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const ret = method.apply(this, args);
            this["name"] = "lll";
            return ret;
        };
    };
}

/**
 * 访问器装饰器
 */
function configurable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    }
}

/**
 * 属性装饰器
 * 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。属性描述符只能用来监视类中是否声明了某个名字的属性，
 */
function format() {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = "66666";
    }
}

/**
 * 类装饰器
 */
function classDecorator<T extends {new(...args:any[]): {}}>(constructor: T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

/**
 * 参数装饰器
 */
function required(target: any, propertyKey: string, parameterIndex: number) {

}

/**
 * 元数据
 */
function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let set = descriptor.set;
    descriptor.set = function (value: T) {
        let type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError("Invalid type.");
        }
        set.call(this, value);
    }
}