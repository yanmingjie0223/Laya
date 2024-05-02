import { HTMLDivElement } from "laya/html/dom/HTMLDivElement";
import { HTMLStyle } from 'laya/html/utils/HTMLStyle';
import { GObjectType } from "./GObjectConst";
import { GTextField } from "./GTextField";
import { UIConfig } from "./UIConfig";
import { UBBParser } from "./utils/UBBParser";

export class GRichTextField extends GTextField {
	private _div: HTMLDivElement;

	constructor() {
		super();

		this._cKey = GObjectType.GRichTextField;
		this._text = "";
	}

	protected createDisplayObject(): void {
		this._displayObject = this._div = new HTMLDivElement();
		this._displayObject.mouseEnabled = true;
		this._displayObject["$owner"] = this;
	}

	public get div(): HTMLDivElement {
		return this._div;
	}

	public set text(value: string) {
		this._text = value;
		var text2: string = this._text;
		if (this._templateVars) text2 = this.parseTemplate(text2);
		try {
			this._div.size(this._width, this._height);
			if (this._ubbEnabled) this._div.innerHTML = UBBParser.inst.parse(text2);
			else this._div.innerHTML = text2;

			if (this._widthAutoSize || this._heightAutoSize) {
				var w: number,
					h: number = 0;
				if (this._widthAutoSize) {
					w = this._div.contextWidth;
					if (w > 0) w += 8;
				} else w = this._width;

				if (this._heightAutoSize) h = this._div.contextHeight;
				else h = this._height;

				this._updatingSize = true;
				this.setSize(w, h);
				this._updatingSize = false;
				// 样式
				if (!this._widthAutoSize) {
					this.styleFitWidth();
				}
				else if (!this._heightAutoSize) {
					this.styleFitHeight();
				}
			}
			else {
				this.styleFit();
			}
		} catch (err) {
			console.log("laya reports html error:" + err);
		}
	}

	public get text(): string {
		return this._text;
	}

	public get font(): string {
		return this._div.style.font;
	}

	public set font(value: string) {
		if (value) this._div.style.font = value;
		else this._div.style.font = UIConfig.defaultFont;
	}

	public get fontSize(): number {
		return this._div.style.fontSize;
	}

	public set fontSize(value: number) {
		this._div.style.fontSize = value;
	}

	public get color(): string {
		return this._div.style.color;
	}

	public set color(value: string) {
		if (this._div.style.color != value) {
			this._div.style.color = value;
			this.refresh();
			this.updateGear(4);
		}
	}

	public setXY(xv: number, yv: number): void {
		super.setXY(xv, yv);
		// 适配调整xy
		this.styleFit();
	}

	public get align(): string {
		return this._div.style.align;
	}

	public set align(value: string) {
		if (this._div.style.align != value) {
			this._div.style.align = value;
			this.refresh();
		}
	}

	public get valign(): string {
		return this._div.style.valign;
	}

	public set valign(value: string) {
		if (this._div.style.valign != value) {
			this._div.style.valign = value;
			this.refresh();
		}
	}

	public get leading(): number {
		return this._div.style.leading;
	}

	public set leading(value: number) {
		if (this._div.style.leading != value) {
			this._div.style.leading = value;
			this.refresh();
		}
	}

	public get bold(): boolean {
		return this._div.style.bold;
	}

	public set bold(value: boolean) {
		if (this._div.style.bold != value) {
			this._div.style.bold = value;
			this.refresh();
		}
	}

	public get italic(): boolean {
		return this._div.style.italic;
	}

	public set italic(value: boolean) {
		if (this._div.style.italic != value) {
			this._div.style.italic = value;
			this.refresh();
		}
	}

	public get stroke(): number {
		return this._div.style.stroke;
	}

	public set stroke(value: number) {
		if (this._div.style.stroke != value) {
			this._div.style.stroke = value;
			this.refresh();
		}
	}

	public get strokeColor(): string {
		return this._div.style.strokeColor;
	}

	public set strokeColor(value: string) {
		if (this._div.style.strokeColor != value) {
			this._div.style.strokeColor = value;
			this.refresh();
			this.updateGear(4);
		}
	}

	public set ubbEnabled(value: boolean) {
		this._ubbEnabled = value;
	}

	public get ubbEnabled(): boolean {
		return this._ubbEnabled;
	}

	public get textWidth(): number {
		var w: number = this._div.contextWidth;
		if (w > 0) w += 8;
		return w;
	}

	private refresh(): void {
		if (this._text.length > 0 && (<any>this._div)._refresh)
			(<any>this._div)._refresh();
	}

	protected updateAutoSize(): void {
		this._div.style.wordWrap = !this._widthAutoSize;
	}

	protected handleSizeChanged(): void {
		if (this._updatingSize) return;

		this._div.size(this._width, this._height);
		this._div.style.width = this._width;
		this._div.style.height = this._height;
	}

	/**
	 * 样式适配
	 */
	private styleFit(): void {
		const x: number = this.fitWidthX();
		const y: number = this.fitHeightY();
		this.displayObject.pos(x, y);
	}

	/**
	 * 左右居中样式
	 */
	private styleFitWidth(): void {
		const x: number = this.fitWidthX();
		this.displayObject.pos(x, this.y);
	}

	/**
	 * 上下居中样式
	 */
	private styleFitHeight(): void {
		const y: number = this.fitHeightY();
		this.displayObject.pos(this.x, y);
	}

	private fitWidthX(): number {
		const w = this._div.contextWidth;
		let x: number;
		if (this.align === HTMLStyle.ALIGN_CENTER) {
			x = this.x + (this.width - w) / 2;
		}
		else if (this.align === HTMLStyle.ALIGN_RIGHT) {
			x = this.x + this.width - w;
		}
		else {
			x = this.x;
		}
		return x;
	}

	private fitHeightY(): number {
		let y: number;
		const h = this._div.contextHeight;
		if (this.valign === HTMLStyle.VALIGN_MIDDLE) {
			y = this.y + (this.height - h) / 2;
		}
		else if (this.valign === HTMLStyle.VALIGN_BOTTOM) {
			y = this.y + this.height - h;
		}
		else {
			y = this.y;
		}
		return y;
	}

}
