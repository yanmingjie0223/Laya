import { DrawTrianglesCmd } from '../display/cmd/DrawTrianglesCmd';
import { Matrix } from "../maths/Matrix";
import { Utils } from '../utils/Utils';
import { SpineGLTexture } from "./SpineGLTexture";
import { SpineSkeleton } from "./SpineSkeleton";
import Skeleton = spine.Skeleton;
import Color = spine.Color;
import SkeletonClipping = spine.SkeletonClipping;
import Vector2 = spine.Vector2;
import SpineUtils = spine.Utils;
import BlendMode = spine.BlendMode;
import RegionAttachment = spine.RegionAttachment;
import MeshAttachment = spine.MeshAttachment;
import ClippingAttachment = spine.ClippingAttachment;
import ArrayLike = spine.ArrayLike;

class Renderable {
	constructor(public vertices: ArrayLike<number>, public numVertices: number, public numFloats: number) { }
};

export class SpineSkeletonRenderer {
	static QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];

	premultipliedAlpha: boolean;
	vertexEffect: spine.VertexEffect = null;
	private tempColor = new Color();
	private vertices: ArrayLike<number>;
	private vertexSize = 2 + 2 + 4;
	private renderable: Renderable = new Renderable(null, 0, 0);
	private clipper: SkeletonClipping = new SkeletonClipping();
	private temp = new Vector2();
	private temp2 = new Vector2();
	private temp3 = new Color();
	private temp4 = new Color();
	/**
	 * vertices Float32Array
	 * uvs Float32Array
	 * indices Uint16Array
	 * alpha number
	 * blendMode string|null
	 * colorNum number|null
	 */
	private _cmds: any[];

	constructor(twoColorTint: boolean = true) {
		if (twoColorTint) {
			this.vertexSize += 4;
		}
		this.vertices = SpineUtils.newFloatArray(this.vertexSize * 1024);
	}

	clear(): void {
		this._cmds = null!;
	}

	getCmds(): DrawTrianglesCmd[] {
		return this._cmds;
	}

	draw(
		skeleton: Skeleton,
		slotRangeStart: number,
		slotRangeEnd: number,
		spineSkeletonIns: SpineSkeleton,
		textureList: any,
		isDraw: boolean = true
	) {
		this._cmds = [];
		let clipper = this.clipper;
		let premultipliedAlpha = this.premultipliedAlpha;
		let twoColorTint = false;
		let blendMode: BlendMode = null;

		let tempPos = this.temp;
		let tempUv = this.temp2;
		let tempLight = this.temp3;
		let tempDark = this.temp4;

		let renderable: Renderable = this.renderable;
		let uvs: ArrayLike<number> = null;
		let triangles: Array<number> = null;
		let drawOrder = skeleton.drawOrder;
		let attachmentColor: Color = null;
		let skeletonColor = skeleton.color;
		let vertexSize = twoColorTint ? 12 : 8;
		let inRange = false;

		if (slotRangeStart == -1) inRange = true;
		for (let i = 0, n = drawOrder.length; i < n; i++) {
			let clippedVertexSize = clipper.isClipping() ? 2 : vertexSize;
			let slot = drawOrder[i];

			if (slotRangeStart >= 0 && slotRangeStart == slot.data.index) {
				inRange = true;
			}

			if (!inRange) {
				clipper.clipEndWithSlot(slot);
				continue;
			}

			if (slotRangeEnd >= 0 && slotRangeEnd == slot.data.index) {
				inRange = false;
			}

			let attachment = slot.getAttachment();
			let name: string = null;
			let texture: SpineGLTexture;
			if (attachment instanceof RegionAttachment) {
				let region = <RegionAttachment>attachment;
				renderable.vertices = this.vertices;
				renderable.numVertices = 4;
				renderable.numFloats = clippedVertexSize << 2;
				region.computeWorldVertices(slot.bone, renderable.vertices, 0, clippedVertexSize);
				triangles = SpineSkeletonRenderer.QUAD_TRIANGLES;
				uvs = region.uvs;
				name = region.region.renderObject.page.name;
				name = Utils.middlewareUseWebp(name);
				texture = textureList[name];
				attachmentColor = region.color;
			} else if (attachment instanceof MeshAttachment) {
				let mesh = <MeshAttachment>attachment;
				renderable.vertices = this.vertices;
				renderable.numVertices = (mesh.worldVerticesLength >> 1);
				renderable.numFloats = renderable.numVertices * clippedVertexSize;
				if (renderable.numFloats > renderable.vertices.length) {
					renderable.vertices = this.vertices = SpineUtils.newFloatArray(renderable.numFloats);
				}
				mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, renderable.vertices, 0, clippedVertexSize);
				triangles = mesh.triangles;
				name = mesh.region.renderObject.page.name;
				name = Utils.middlewareUseWebp(name);
				texture = textureList[name];
				uvs = mesh.uvs;
				attachmentColor = mesh.color;
			} else if (attachment instanceof ClippingAttachment) {
				let clip = <ClippingAttachment>(attachment);
				clipper.clipStart(slot, clip);
				continue;
			} else {
				clipper.clipEndWithSlot(slot);
				continue;
			}

			if (texture != null) {
				let trianglesCmd: any;
				let slotColor = slot.color;
				let finalColor = this.tempColor;
				finalColor.r = skeletonColor.r * slotColor.r * attachmentColor.r;
				finalColor.g = skeletonColor.g * slotColor.g * attachmentColor.g;
				finalColor.b = skeletonColor.b * slotColor.b * attachmentColor.b;
				finalColor.a = skeletonColor.a * slotColor.a * attachmentColor.a;
				if (premultipliedAlpha) {
					finalColor.r *= finalColor.a;
					finalColor.g *= finalColor.a;
					finalColor.b *= finalColor.a;
				}

				let slotBlendMode = slot.data.blendMode;
				if (slotBlendMode != blendMode) {
					blendMode = slotBlendMode;
				}

				if (clipper.isClipping()) {
					clipper.clipTriangles(renderable.vertices, renderable.numFloats, triangles, triangles.length, uvs, finalColor, null, twoColorTint);
					let clippedVertices = new Float32Array(clipper.clippedVertices);
					let clippedTriangles = clipper.clippedTriangles;
					let mVertices = [];
					let mUVs = [];
					let colors = [];
					if (this.vertexEffect != null) {
						let vertexEffect = this.vertexEffect;
						let verts = clippedVertices;
						if (!twoColorTint) {
							for (let v = 0, n = clippedVertices.length; v < n; v += vertexSize) {
								tempPos.x = verts[v];
								tempPos.y = verts[v + 1];
								tempLight.set(verts[v + 2], verts[v + 3], verts[v + 4], verts[v + 5]);
								tempUv.x = verts[v + 6];
								tempUv.y = verts[v + 7];
								tempDark.set(0, 0, 0, 0);
								vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
								verts[v] = tempPos.x;
								verts[v + 1] = tempPos.y;
								verts[v + 2] = tempLight.r;
								verts[v + 3] = tempLight.g;
								verts[v + 4] = tempLight.b;
								verts[v + 5] = tempLight.a;
								verts[v + 6] = tempUv.x;
								verts[v + 7] = tempUv.y

								mVertices.push(verts[v], -verts[v + 1]);
								colors.push(verts[v + 2], verts[v + 3], verts[v + 4], verts[v + 5]);
								mUVs.push(verts[v + 6], verts[v + 7]);
							}
						}
					} else {
						let vi = 0;
						while (Number.isFinite(clippedVertices[vi + 6]) && Number.isFinite(clippedVertices[vi + 7])) {
							mVertices.push(clippedVertices[vi]);
							mVertices.push(-clippedVertices[vi + 1]);
							colors.push(clippedVertices[vi + 2]);
							colors.push(clippedVertices[vi + 3]);
							colors.push(clippedVertices[vi + 4]);
							colors.push(clippedVertices[vi + 5]);
							mUVs.push(clippedVertices[vi + 6]);
							mUVs.push(clippedVertices[vi + 7]);
							vi += this.vertexSize;
						}
					}
					let colorNum = null;
					let blendMode;
					switch (slotBlendMode) {
						case 1:
							blendMode = "light";
							break;
						case 2:
							blendMode = "multiply";
							break;
						case 3:
							blendMode = "screen";
							break;
						default:
							blendMode = "normal";
					}
					colorNum = (255 << 24) + colors[0] * 255 | 0 + ((colors[1] * 255) << 8) + ((colors[2] * 255) << 16);
					trianglesCmd = this.createCmd(mVertices, mUVs, clippedTriangles, colors[3], blendMode, colorNum);
					if (isDraw) {
						spineSkeletonIns.graphics.drawTriangles(texture, 0, 0, trianglesCmd[0], trianglesCmd[1], trianglesCmd[2], Matrix.EMPTY, colors[3], null, blendMode, colorNum);
					}
				} else {
					let verts = renderable.vertices;
					let mVertices = [];
					let mUVs = [];
					let colors = [];
					if (this.vertexEffect != null) {
						let vertexEffect = this.vertexEffect;
						if (!twoColorTint) {
							for (let v = 0, u = 0, n = renderable.numFloats; v < n; v += vertexSize, u += 2) {
								tempPos.x = verts[v];
								tempPos.y = verts[v + 1];
								tempUv.x = uvs[u];
								tempUv.y = uvs[u + 1]
								tempLight.setFromColor(finalColor);
								tempDark.set(0, 0, 0, 0);
								vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
								verts[v] = tempPos.x;
								verts[v + 1] = tempPos.y;
								verts[v + 2] = tempLight.r;
								verts[v + 3] = tempLight.g;
								verts[v + 4] = tempLight.b;
								verts[v + 5] = tempLight.a;
								verts[v + 6] = tempUv.x;
								verts[v + 7] = tempUv.y

								mVertices.push(verts[v], -verts[v + 1]);
								colors.push(verts[v + 2], verts[v + 3], verts[v + 4], verts[v + 5]);
								mUVs.push(verts[v + 6], verts[v + 7]);
							}
						}
					} else {
						if (!twoColorTint) {
							for (let v = 2, u = 0, n = renderable.numFloats; v < n; v += vertexSize, u += 2) {
								verts[v] = finalColor.r;
								verts[v + 1] = finalColor.g;
								verts[v + 2] = finalColor.b;
								verts[v + 3] = finalColor.a;
								verts[v + 4] = uvs[u];
								verts[v + 5] = uvs[u + 1];

								mVertices.push(verts[v - 2], -verts[v - 1]);
								colors.push(verts[v], verts[v + 1], verts[v + 2], verts[v + 3]);
								mUVs.push(verts[v + 4], verts[v + 5]);
							}
						}
					}
					let colorNum = null;
					let blendMode;
					switch (slotBlendMode) {
						case 1:
							blendMode = "light";
							break;
						case 2:
							blendMode = "multiply";
							break;
						case 3:
							blendMode = "screen";
							break;
						default:
							blendMode = "normal";
					}
					colorNum = (255 << 24) + colors[0] * 255 | 0 + ((colors[1] * 255) << 8) + ((colors[2] * 255) << 16);
					trianglesCmd = this.createCmd(mVertices, mUVs, triangles, colors[3], blendMode, colorNum);
					if (isDraw) {
						spineSkeletonIns.graphics.drawTriangles(texture, 0, 0, trianglesCmd[0], trianglesCmd[1], trianglesCmd[2], Matrix.EMPTY, colors[3], null, blendMode, colorNum);
					}
				}
				if (trianglesCmd) {
					this._cmds.push(trianglesCmd);
				}
			}
			clipper.clipEndWithSlot(slot);
		}
		clipper.clipEnd();
	}

	private createCmd(
		mVertices: number[],
		mUVs: number[],
		triangles: number[],
		alpha: number,
		blendMode: string,
		colorNum: number
	): DrawTrianglesCmd {
		const cmd = [];
		cmd[0] = mVertices;
		cmd[1] = mUVs;
		cmd[2] = new Uint16Array(triangles);
		if (alpha !== 1) {
			cmd[3] = alpha;
		}
		if (blendMode !== 'normal') {
			cmd[4] = blendMode;
		}
		if (colorNum !== -1) {
			cmd[5] = colorNum;
		}
		return cmd as any;
	}

}
