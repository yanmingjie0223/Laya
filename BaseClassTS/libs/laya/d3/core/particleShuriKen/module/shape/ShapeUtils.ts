import { Rand } from "../../../../math/Rand"
import { Vector2 } from "../../../../math/Vector2"
import { Vector3 } from "../../../../math/Vector3"

/**
 * @internal
 * @author ...
 */
export class ShapeUtils {
	static _randomPointUnitArcCircle(arc: number, out: Vector2, rand: Rand = null): void {
		var angle: number;
		if (rand)
			angle = rand.getFloat() * arc;
		else
			angle = Math.random() * arc;
		out.x = Math.cos(angle);
		out.y = Math.sin(angle);
	}

	static _randomPointInsideUnitArcCircle(arc: number, out: Vector2, rand: Rand = null): void {
		ShapeUtils._randomPointUnitArcCircle(arc, out, rand);
		var range: number;
		if (rand)
			range = Math.pow(rand.getFloat(), 1.0 / 2.0);
		else
			range = Math.pow(Math.random(), 1.0 / 2.0);
		out.x = out.x * range;
		out.y = out.y * range;
	}

	static _randomPointUnitCircle(out: Vector2, rand: Rand = null): void {
		var angle: number;
		if (rand)
			angle = rand.getFloat() * Math.PI * 2;
		else
			angle = Math.random() * Math.PI * 2;
		out.x = Math.cos(angle);
		out.y = Math.sin(angle);
	}

	static _randomPointInsideUnitCircle(out: Vector2, rand: Rand = null): void {
		ShapeUtils._randomPointUnitCircle(out);
		var range: number;
		if (rand)
			range = Math.pow(rand.getFloat(), 1.0 / 2.0);
		else
			range = Math.pow(Math.random(), 1.0 / 2.0);
		out.x = out.x * range;
		out.y = out.y * range;
	}

	static _randomPointUnitSphere(out: Vector3, rand: Rand = null): void {
		var z: number;
		var a: number;
		if (rand) {
			z = out.z = rand.getFloat() * 2 - 1.0;
			a = rand.getFloat() * Math.PI * 2;
		} else {
			z = out.z = Math.random() * 2 - 1.0;
			a = Math.random() * Math.PI * 2;
		}

		var r: number = Math.sqrt(1.0 - z * z);

		out.x = r * Math.cos(a);
		out.y = r * Math.sin(a);
	}

	static _randomPointInsideUnitSphere(out: Vector3, rand: Rand = null): void {
		;
		ShapeUtils._randomPointUnitSphere(out);
		var range: number;
		if (rand)
			range = Math.pow(rand.getFloat(), 1.0 / 3.0);
		else
			range = Math.pow(Math.random(), 1.0 / 3.0);
		out.x = out.x * range;
		out.y = out.y * range;
		out.z = out.z * range;
	}

	static _randomPointInsideHalfUnitBox(out: Vector3, rand: Rand = null): void {
		if (rand) {
			out.x = (rand.getFloat() - 0.5);
			out.y = (rand.getFloat() - 0.5);
			out.z = (rand.getFloat() - 0.5);
		} else {
			out.x = (Math.random() - 0.5);
			out.y = (Math.random() - 0.5);
			out.z = (Math.random() - 0.5);
		}
	}

	constructor() {
	}

}


