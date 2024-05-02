/* eslint-disable */

/**
 *  PQStudio A group of unknown boys who create happy games
 *  PQStudio The first stage 2021-2031
 */

import { Int64 } from './Int64';

type Nullable<T> = T | undefined | null;

/**
 * 类提供用于优化读取、写入以及处理二进制数据的方法和属性
 *
 * @export
 * @class Byte
 */
export class Byte {
	/**
	 * 大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。
	 *
	 * @static
	 * @type {string}
	 * @memberof Byte
	 */
	public static BIG_ENDIAN: string = 'bigEndian';

	/**
	 * 小端字节序，地址低位存储值的低位，地址高位存储值的高位
	 *
	 * @static
	 * @type {string}
	 * @memberof Byte
	 */
	public static LITTLE_ENDIAN: string = 'littleEndian';

	/**
	 * 是否为小端数据
	 *
	 * @protected
	 * @type {boolean}
	 * @memberof Byte
	 */
	protected _xd_: boolean = true;
	private _allocated_: number = 8;
	/**
	 * 原始数据
	 *
	 * @protected
	 * @type {*}
	 * @memberof Byte
	 */
	protected _d_!: DataView;
	protected _u8d_!: Uint8Array;
	protected _pos_: number = 0;
	protected _length: number = 0;
	private static _sysEndian: Nullable<string> = void 0;

	/**
	 * <p>获取当前主机的字节序。</p>
	 * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。</p>
	 * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
	 *  <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	 * @return 当前系统的字节序。
	 */
	public static getSystemEndian(): String {
		if (!this._sysEndian) {
			let buffer: any = new ArrayBuffer(2);
			new DataView(buffer).setInt16(0, 256, true);
			this._sysEndian =
				new Int16Array(buffer)[0] === 256 ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
		}
		return this._sysEndian;
	}

	/**
	 * 创建一个 <code>Byte</code> 类的实例。
	 * @param	data	用于指定初始化的元素数目，或者用于初始化的TypedArray对象、ArrayBuffer对象。
	 * 如果为 null ，则预分配一定的内存空间，
	 * 当可用空间不足时，优先使用这部分内存，如果还不够，则重新分配所需内存。
	 */
	public constructor(data: Nullable<ArrayBuffer> = void 0) {
		if (data) {
			this._u8d_ = new Uint8Array(data);
			this._d_ = new DataView(this._u8d_.buffer);
			this._length = this._d_.byteLength;
		} else {
			this.___resizeBuffer(this._allocated_);
		}
	}

	/**
	 * 获取此对象的 ArrayBuffer 数据，数据只包含有效数据部分。
	 */
	public get buffer(): ArrayBuffer {
		let rstBuffer: ArrayBuffer = this._d_.buffer;
		if (rstBuffer.byteLength == this.length) return rstBuffer;
		return rstBuffer.slice(0, this.length);
	}

	/**
	 * <p> <code>Byte</code> 实例的字节序。取值为：<code>BIG_ENDIAN</code> 或 <code>LITTLE_ENDIAN</code> 。</p>
	 * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
	 * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
	 *  <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	 */
	public get endian(): string {
		return this._xd_ ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
	}

	public set endian(endianStr: string) {
		this._xd_ = endianStr == Byte.LITTLE_ENDIAN;
	}

	/**
	 * <p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
	 * <p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
	 * <p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
	 */
	public set length(value: number) {
		if (this._allocated_ < value)
			this.___resizeBuffer(
				(this._allocated_ = Math.floor(Math.max(value, this._allocated_ * 2)))
			);
		else if (this._allocated_ > value) this.___resizeBuffer((this._allocated_ = value));
		this._length = value;
	}

	public get length(): number {
		return this._length;
	}

	/** @private */
	private ___resizeBuffer(len: number): void {
		try {
			let newByteView: any = new Uint8Array(len);
			if (this._u8d_ != null) {
				if (this._u8d_.length <= len) newByteView.set(this._u8d_);
				else newByteView.set(this._u8d_.subarray(0, len));
			}
			this._u8d_ = newByteView;
			this._d_ = new DataView(newByteView.buffer);
		} catch (err) {
			throw '___resizeBuffer err:' + len;
		}
	}

	/**
	 * <p>常用于解析固定格式的字节流。</p>
	 * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint32</code> 值，然后以此值为长度，读取此长度的字符串。</p>
	 * @return 读取的字符串。
	 */
	public getString(): string {
		return this.rUTF(this.getUint32());
	}

	//LITTLE_ENDIAN only now;
	/**
	 * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
	 * @param	start	开始位置。
	 * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	 * @return  读取的 Float32Array 对象。
	 */
	public getFloat32Array(start: number, len: number): any {
		let end: number = start + len;
		end = end > this._length ? this._length : end;
		let v: Float32Array = new Float32Array(this._d_.buffer.slice(start, end));
		this._pos_ = end;
		return v;
	}

	/**
	 * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
	 * @param	start	开始位置。
	 * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	 * @return  读取的 Uint8Array 对象。
	 */
	public getUint8Array(start: number, len: number): Uint8Array {
		let end: number = start + len;
		end = end > this._length ? this._length : end;
		let v: Uint8Array = new Uint8Array(this._d_.buffer.slice(start, end));
		this._pos_ = end;
		return v;
	}

	/**
	 * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。
	 * @param	start	开始读取的字节偏移量位置。
	 * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	 * @return  读取的 Uint8Array 对象。
	 */
	public getInt16Array(start: number, len: number): any {
		let end: number = start + len;
		end = end > this._length ? this._length : end;
		let v: Int16Array = new Int16Array(this._d_.buffer.slice(start, end));
		this._pos_ = end;
		return v;
	}

	/**
	 * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
	 * @return 单精度（32 位）浮点数。
	 */
	public getFloat32(): number {
		if (this._pos_ + 4 > this._length) throw 'getFloat32 error - Out of bounds';
		let v: number = this._d_.getFloat32(this._pos_, this._xd_);
		this._pos_ += 4;
		return v;
	}

	/**
	 * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
	 * 同getFloat32()
	 * @return 单精度（32 位）浮点数。
	 */
	public getFloat(): number {
		if (this._pos_ + 4 > this._length) throw 'getFloat32 error - Out of bounds';
		let v: number = this._d_.getFloat32(this._pos_, this._xd_);
		this._pos_ += 4;
		return v;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
	 * @return 双精度（64 位）浮点数。
	 */
	public getFloat64(): number {
		if (this._pos_ + 8 > this._length) throw 'getFloat64 error - Out of bounds';
		let v: number = this._d_.getFloat64(this._pos_, this._xd_);
		this._pos_ += 8;
		return v;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
	 * 同getFloat64()
	 * @return 双精度（64 位）浮点数。
	 */
	public getDouble(): number {
		if (this._pos_ + 8 > this._length) throw 'getFloat64 error - Out of bounds';
		let v: number = this._d_.getFloat64(this._pos_, this._xd_);
		this._pos_ += 8;
		return v;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
	 * @param	value	单精度（32 位）浮点数。
	 */
	public writeFloat32(value: number): void {
		this.ensureWrite(this._pos_ + 4);
		this._d_.setFloat32(this._pos_, value, this._xd_);
		this._pos_ += 4;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
	 * 同writeFloat32()
	 * @param	value	单精度（32 位）浮点数。
	 */
	public writeFloat(value: number): void {
		this.ensureWrite(this._pos_ + 4);
		this._d_.setFloat32(this._pos_, value, this._xd_);
		this._pos_ += 4;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
	 * @param	value	双精度（64 位）浮点数。
	 */
	public writeFloat64(value: number): void {
		this.ensureWrite(this._pos_ + 8);
		this._d_.setFloat64(this._pos_, value, this._xd_);
		this._pos_ += 8;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
	 * 同writeFloat64()
	 * @param	value	双精度（64 位）浮点数。
	 */
	public writeDouble(value: number): void {
		this.ensureWrite(this._pos_ + 8);
		this._d_.setFloat64(this._pos_, value, this._xd_);
		this._pos_ += 8;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
	 * @return Int32 值。
	 */
	public getInt32(): number {
		if (this._pos_ + 4 > this._length) throw 'getInt32 error - Out of bounds';
		let float: number = this._d_.getInt32(this._pos_, this._xd_);
		this._pos_ += 4;
		return float;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
	 * @return Uint32 值。
	 */
	public getUint32(): number {
		if (this._pos_ + 4 > this._length) throw 'getUint32 error - Out of bounds';
		let v: number = this._d_.getUint32(this._pos_, this._xd_);
		this._pos_ += 4;
		return v;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入指定的 Int32 值。
	 * @param	value	需要写入的 Int32 值。
	 */
	public writeInt32(value: number): void {
		this.ensureWrite(this._pos_ + 4);
		this._d_.setInt32(this._pos_, value, this._xd_);
		this._pos_ += 4;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入 Uint32 值。
	 * @param	value	需要写入的 Uint32 值。
	 */
	public writeUint32(value: number): void {
		this.ensureWrite(this._pos_ + 4);
		this._d_.setUint32(this._pos_, value, this._xd_);
		this._pos_ += 4;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
	 * @return Int16 值。
	 */
	public getInt16(): number {
		if (this._pos_ + 2 > this._length) throw 'getInt16 error - Out of bounds';
		let us: number = this._d_.getInt16(this._pos_, this._xd_);
		this._pos_ += 2;
		return us;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
	 * @return Uint16 值。
	 */
	public getUint16(): number {
		if (this._pos_ + 2 > this._length) throw 'getUint16 error - Out of bounds';
		let us: number = this._d_.getUint16(this._pos_, this._xd_);
		this._pos_ += 2;
		return us;
	}

	/**
	 * 获取一个int64
	 *
	 * @return {Int64}  Int64
	 * @memberof Byte
	 */
	public getInt64(): Int64 {
		let lo = 0;
		let hi = 0;
		const view = new Uint8Array(this._d_.buffer);
		let offset = this._pos_;
		if (this.endian == Byte.LITTLE_ENDIAN) {
			lo = view[offset + 2] << 16;
			lo |= view[offset + 1] << 8;
			lo |= view[offset];
			lo += (view[offset + 3] << 24) >>> 0;
			offset += 4;
			hi = view[offset + 2] << 16;
			hi |= view[offset + 1] << 8;
			hi |= view[offset];
			hi += (view[offset + 3] << 24) >>> 0;
		} else {
			hi = view[offset + 1] << 16;
			hi |= view[offset + 2] << 8;
			hi |= view[offset + 3];
			hi += (view[offset] << 24) >>> 0;
			offset += 4;
			lo = view[offset + 1] << 16;
			lo |= view[offset + 2] << 8;
			lo |= view[offset + 3];
			lo += (view[offset] << 24) >>> 0;
		}
		let value = new Int64(lo, hi);
		this._pos_ += 8;
		return value;
	}

	/**
	 * 写入Int64
	 *
	 * @param {Int64} value
	 * @memberof Byte
	 */
	public writeInt64(value: Int64): void {
		let offset = this._pos_;
		this.ensureWrite(offset + 8);
		let lo = value.getLowBits();
		let hi = value.getHighBits();
		let view = new Uint8Array(this._d_.buffer);

		if (this.endian == Byte.LITTLE_ENDIAN) {
			view[offset + 3] = (lo >>> 24) & 0xff;
			view[offset + 2] = (lo >>> 16) & 0xff;
			view[offset + 1] = (lo >>> 8) & 0xff;
			view[offset] = lo & 0xff;
			offset += 4;
			view[offset + 3] = (hi >>> 24) & 0xff;
			view[offset + 2] = (hi >>> 16) & 0xff;
			view[offset + 1] = (hi >>> 8) & 0xff;
			view[offset] = hi & 0xff;
		} else {
			view[offset] = (hi >>> 24) & 0xff;
			view[offset + 1] = (hi >>> 16) & 0xff;
			view[offset + 2] = (hi >>> 8) & 0xff;
			view[offset + 3] = hi & 0xff;
			offset += 4;
			view[offset] = (lo >>> 24) & 0xff;
			view[offset + 1] = (lo >>> 16) & 0xff;
			view[offset + 2] = (lo >>> 8) & 0xff;
			view[offset + 3] = lo & 0xff;
		}
		this._pos_ += 8;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入指定的 Uint16 值。
	 * @param	value	需要写入的Uint16 值。
	 */
	public writeUint16(value: number): void {
		this.ensureWrite(this._pos_ + 2);
		this._d_.setUint16(this._pos_, value, this._xd_);
		this._pos_ += 2;
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入指定的 Int16 值。
	 * @param	value	需要写入的 Int16 值。
	 */
	public writeInt16(value: number): void {
		this.ensureWrite(this._pos_ + 2);
		this._d_.setInt16(this._pos_, value, this._xd_);
		this._pos_ += 2;
	}

	/**
	 * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
	 * @return Uint8 值。
	 */
	public getUint8(): number {
		if (this._pos_ + 1 > this._length) throw 'getUint8 error - Out of bounds';
		return this._d_.getUint8(this._pos_++);
	}

	/**
	 * 在字节流的当前字节偏移量位置处写入指定的 Uint8 值。
	 * @param	value	需要写入的 Uint8 值。
	 */
	public writeUint8(value: number): void {
		this.ensureWrite(this._pos_ + 1);
		this._d_.setUint8(this._pos_, value);
		this._pos_++;
	}

	/**
	 * @private
	 * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
	 * @param	pos	字节读取位置。
	 * @return Uint8 值。
	 */
	public _getUInt8(pos: number): number {
		return this._d_.getUint8(pos);
	}

	/**
	 * @private
	 * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
	 * @param	pos	字节读取位置。
	 * @return Uint16 值。
	 */
	public _getUint16(pos: number): number {
		return this._d_.getUint16(pos, this._xd_);
	}

	/**
	 * @private
	 * 读取指定长度的 UTF 型字符串。
	 * @param	len 需要读取的长度。
	 * @return 读取的字符串。
	 */
	private rUTF(len: number): string {
		let v: string = '',
			max: number = this._pos_ + len,
			c: number,
			c2: number,
			c3: number,
			f: Function = String.fromCharCode;
		let u: any = this._u8d_;
		while (this._pos_ < max) {
			c = u[this._pos_++];
			if (c < 0x80) {
				if (c != 0) {
					v += f(c);
				}
			} else if (c < 0xe0) {
				v += f(((c & 0x3f) << 6) | (u[this._pos_++] & 0x7f));
			} else if (c < 0xf0) {
				c2 = u[this._pos_++];
				v += f(((c & 0x1f) << 12) | ((c2 & 0x7f) << 6) | (u[this._pos_++] & 0x7f));
			} else {
				c2 = u[this._pos_++];
				c3 = u[this._pos_++];
				v += f(
					((c & 0x0f) << 18) |
						((c2 & 0x7f) << 12) |
						((c3 << 6) & 0x7f) |
						(u[this._pos_++] & 0x7f)
				);
			}
		}
		return v;
	}

	// River: 自定义的字符串读取,项目相关的内容
	/**
	 * @private
	 * 读取 <code>len</code> 参数指定的长度的字符串。
	 * @param	len	要读取的字符串的长度。
	 * @return 指定长度的字符串。
	 */
	public getCustomString(len: number): string {
		let v: string = '',
			ulen: number = 0,
			c: number,
			c2: number,
			f: Function = String.fromCharCode;
		let u: any = this._u8d_;
		while (len > 0) {
			c = u[this._pos_];
			if (c < 0x80) {
				v += f(c);
				this._pos_++;
				len--;
			} else {
				ulen = c - 0x80;
				this._pos_++;
				len -= ulen;
				while (ulen > 0) {
					c = u[this._pos_++];
					c2 = u[this._pos_++];
					v += f((c2 << 8) | c);
					ulen--;
				}
			}
		}

		return v;
	}

	/**
	 * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
	 */
	public get pos(): number {
		return this._pos_;
	}

	public set pos(value: number) {
		this._pos_ = value;
	}

	/**
	 * 可从字节流的当前位置到末尾读取的数据的字节数。
	 */
	public get bytesAvailable(): number {
		return this._length - this._pos_;
	}

	/**
	 * 清除字节数组的内容，并将 length 和 pos 属性重置为 0。调用此方法将释放 Byte 实例占用的内存。
	 */
	public clear(): void {
		this._pos_ = 0;
		this.length = 0;
	}

	/**
	 * @private
	 * 获取此对象的 ArrayBuffer 引用。
	 * @return
	 */
	public __getBuffer(): ArrayBuffer {
		// this._d_.buffer.byteLength = this.length;
		return this._d_.buffer;
	}

	/**
	 * <p>将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的字为字符串添加前缀。</p>
	 * <p>对应的读取方法为： getUTFBytes 。</p>
	 * @param value 要写入的字符串。
	 */
	public writeUTFBytes(value: string): void {
		// utf8-decode
		value = value + '';
		for (let i: number = 0, sz: number = value.length; i < sz; i++) {
			let c: number = value.charCodeAt(i);

			if (c <= 0x7f) {
				this.writeByte(c);
			} else if (c <= 0x7ff) {
				//优化为直接写入多个字节，而不必重复调用writeByte，免去额外的调用和逻辑开销。
				this.ensureWrite(this._pos_ + 2);
				this._u8d_.set([0xc0 | (c >> 6), 0x80 | (c & 0x3f)], this._pos_);
				this._pos_ += 2;
			} else if (c <= 0xffff) {
				this.ensureWrite(this._pos_ + 3);
				this._u8d_.set(
					[0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)],
					this._pos_
				);
				this._pos_ += 3;
			} else {
				this.ensureWrite(this._pos_ + 4);
				this._u8d_.set(
					[
						0xf0 | (c >> 18),
						0x80 | ((c >> 12) & 0x3f),
						0x80 | ((c >> 6) & 0x3f),
						0x80 | (c & 0x3f)
					],
					this._pos_
				);
				this._pos_ += 4;
			}
		}
	}

	/**
	 * <p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
	 * <p>对应的读取方法为： getUTFString 。</p>
	 * @param	value 要写入的字符串值。
	 */
	public writeUTFString(value: string): void {
		let tPos: number = this.pos;
		this.writeUint16(1);
		this.writeUTFBytes(value);
		let dPos: number = this.pos - tPos - 2;
		if (dPos >= 65536) {
			throw 'writeUTFString byte len more than 65536';
		}
		this._d_.setUint16(tPos, dPos, this._xd_);
	}

	/**
	 * <p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
	 * <p>对应的读取方法为： getUTFString 。</p>
	 * @param	value 要写入的字符串值。
	 */
	public writeUTF8String(value: string): void {
		let tPos: number = this.pos;
		this.writeUint16(1);
		this.writeUTFBytes(value);
		let dPos: number = this.pos - tPos - 2;
		if (dPos >= 65536) {
			throw 'writeUTFString byte len more than 65536';
		}
		this._d_.setUint16(tPos, dPos, this._xd_);
	}

	/**
	 * @private
	 * 读取 UTF-8 字符串。
	 * @return 读取的字符串。
	 */
	public readUTFString(): string {
		return this.readUTFBytes(this.getUint16());
	}

	/**
	 * @private
	 * 读取 UTF-8 字符串。
	 * @return 读取的字符串。
	 */
	public readUTF8String(): string {
		return this.readUTFBytes(this.getUint16());
	}

	/**
	 * @private
	 * 读取 UTF-8 字符串。
	 * @return 读取的字符串。
	 */
	public getUTF8String(): string {
		return this.readUTFBytes(this.getUint16());
	}

	/**
	 * <p>从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。</p>
	 * <p>对应的写入方法为： writeUTFString 。</p>
	 * @return 读取的字符串。
	 */
	public getUTFString(): string {
		return this.readUTFString();
	}

	/**
	 * @private
	 * 读字符串，必须是 writeUTFBytes 方法写入的字符串。
	 * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
	 * @return 读取的字符串。
	 */
	public readUTFBytes(len: number = -1): string {
		if (len == 0) return '';
		let lastBytes: number = this.bytesAvailable;
		if (len > lastBytes) throw 'readUTFBytes error - Out of bounds';
		len = len > 0 ? len : lastBytes;
		return this.rUTF(len);
	}

	/**
	 * <p>从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。</p>
	 * <p>一般读取的是由 writeUTFBytes 方法写入的字符串。</p>
	 * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
	 * @return 读取的字符串。
	 */
	public getUTFBytes(len: number = -1): string {
		return this.readUTFBytes(len);
	}

	/**
	 * <p>在字节流中写入一个字节。</p>
	 * <p>使用参数的低 8 位。忽略高 24 位。</p>
	 * @param	value
	 */
	public writeByte(value: number): void {
		this.ensureWrite(this._pos_ + 1);
		this._d_.setInt8(this._pos_, value);
		this._pos_ += 1;
	}

	/**
	 * @private
	 * 从字节流中读取带符号的字节。
	 */
	public readByte(): number {
		if (this._pos_ + 1 > this._length) throw 'readByte error - Out of bounds';
		return this._d_.getInt8(this._pos_++);
	}

	/**
	 * <p>从字节流中读取带符号的字节。</p>
	 * <p>返回值的范围是从 -128 到 127。</p>
	 * @return 介于 -128 和 127 之间的整数。
	 */
	public getByte(): number {
		return this.readByte();
	}

	/**
	 * <p>保证该字节流的可用长度不小于 <code>lengthToEnsure</code> 参数指定的值。</p>
	 * @param	lengthToEnsure	指定的长度。
	 */
	public ensureWrite(lengthToEnsure: number): void {
		if (this._length < lengthToEnsure) this._length = lengthToEnsure;
		if (this._allocated_ < lengthToEnsure) this.length = lengthToEnsure;
	}

	/**
	 * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
	 * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
	 * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
	 * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
	 * @param	arraybuffer	需要写入的 Arraybuffer 对象。
	 * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
	 * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
	 */
	public writeArrayBuffer(
		arraybuffer: ArrayBuffer,
		offset: number = 0,
		length: number = 0
	): void {
		if (offset < 0 || length < 0) throw 'writeArrayBuffer error - Out of bounds';
		if (length == 0) length = arraybuffer.byteLength - offset;
		//$ALERT 这里会分配用户指定的内存空间，这可能导致分配多余的内存空间，甚至导致内存溢出。应该进行有效性检查。如果用户想要分配多余的空间，应该使用set length。
		this.ensureWrite(this._pos_ + length);
		let uint8array: Uint8Array = new Uint8Array(arraybuffer);
		this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
		this._pos_ += length;
	}

	/**
	 * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
	 * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
	 * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
	 * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
	 * @param	arraybuffer	需要写入的 Arraybuffer 对象。
	 * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
	 * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
	 */
	public writeBytes(arraybuffer: ArrayBuffer, offset: number = 0, length: number = 0): void {
		if (offset < 0 || length < 0) throw 'writeArrayBuffer error - Out of bounds';
		if (length == 0) length = arraybuffer.byteLength - offset;
		//$ALERT 这里会分配用户指定的内存空间，这可能导致分配多余的内存空间，甚至导致内存溢出。应该进行有效性检查。如果用户想要分配多余的空间，应该使用set length。
		this.ensureWrite(this._pos_ + length);
		let uint8array: Uint8Array = new Uint8Array(arraybuffer);
		this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
		this._pos_ += length;
	}
}
