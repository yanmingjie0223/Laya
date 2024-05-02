/* eslint-disable */

/**
 *  PQStudio A group of unknown boys who create happy games
 *  PQStudio The first stage 2021-2031
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *  Copyright 2009 Google Inc. All Rights Reserved
 *
 *  http://www.dataxsecure.com/js/closure/goog.bck.201310042312/docs/closure_goog_math_long.js.source.html
 */

 export class Int64 {
    // NOTE: the compiler should inline these constant values below and then remove
    // these variables, so there should be no runtime penalty for these.
    /**
     * Number used repeated below in calculations.  This must appear before the
     * first call to any from* function below.
     * @type {number}
     * @private
     */
    private static _TWO_PWR_16_DBL: number = 1 << 16;

    /**
     * @type {number}
     * @private
     */
    private static _TWO_PWR_24_DBL: number = 1 << 24;

    /**
     * @type {number}
     * @private
     */
    private static _TWO_PWR_32_DBL: number = Int64._TWO_PWR_16_DBL * Int64._TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @private
     */
    private static _TWO_PWR_31_DBL: number = Int64._TWO_PWR_32_DBL / 2;

    /**
     * @type {number}
     * @private
     */
    private static _TWO_PWR_48_DBL: number = Int64._TWO_PWR_32_DBL * Int64._TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @private
     */
    private static readonly TWO_PWR_64_DBL: number = Int64._TWO_PWR_32_DBL * Int64._TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @private
     */
    private static readonly TWO_PWR_63_DBL: number = Int64.TWO_PWR_64_DBL / 2;

    /** @type {Int64} */
    public static readonly ZERO: Int64 = Int64.fromInt(0);

    /** @type {Int64} */
    public static readonly ONE: Int64 = Int64.fromInt(1);

    /** @type {Int64} */
    public static readonly NEG_ONE: Int64 = Int64.fromInt(-1);

    /** @type {Int64} */
    public static readonly MAX_VALUE: Int64 = Int64.fromBits(0xffffffff | 0, 0x7fffffff | 0);

    /** @type {Int64} */
    public static readonly MIN_VALUE: Int64 = Int64.fromBits(0, 0x80000000 | 0);

    /**
     * @type {Int64}
     * @private
     */
    public static readonly TWO_PWR_24: Int64 = Int64.fromInt(1 << 24);

    private _low: number;
    private _high: number;

    /**
     * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
     * values as *signed* integers.  See the from* functions below for more
     * convenient ways of constructing Longs.
     *
     * The internal representation of a long is the two given signed, 32-bit values.
     * We use 32-bit pieces because these are the size of integers on which
     * Javascript performs bit-operations.  For operations like addition and
     * multiplication, we split each number into 16-bit pieces, which can easily be
     * multiplied within Javascript's floating-point representation without overflow
     * or change in sign.
     *
     * In the algorithms below, we frequently reduce the negative case to the
     * positive case by negating the input(s) and then post-processing the result.
     * Note that we must ALWAYS check specially whether those values are MIN_VALUE
     * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
     * a positive number, it overflows back into a negative).  Not handling this
     * case would often result in infinite recursion.
     *
     * @param {number} low  The low (signed) 32 bits of the long.
     * @param {number} high  The high (signed) 32 bits of the long.
     * @constructor
     */
    public constructor(low: number, high: number) {
        this._low = low | 0;
        this._high = high | 0;
    }

    /**
     * Returns a Long representing the given (32-bit) integer value.
     * @param {number} value The 32-bit integer in question.
     * @return {Int64} The corresponding Long value.
     */
    public static fromInt(value: number): Int64 {
        const obj = new Int64(value | 0, value < 0 ? -1 : 0);
        return obj;
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite
     * number.  Otherwise, zero is returned.
     * @param {number} value The number in question.
     * @return {Int64} The corresponding Long value.
     */
    public static fromNumber(value: number): Int64 {
        if (isNaN(value) || !isFinite(value)) {
            return Int64.ZERO.clone();
        } else if (value <= -Int64.TWO_PWR_63_DBL) {
            return Int64.MIN_VALUE.clone();
        } else if (value + 1 >= Int64.TWO_PWR_63_DBL) {
            return Int64.MAX_VALUE.clone();
        } else if (value < 0) {
            return Int64.fromNumber(-value).negate();
        } else {
            return new Int64(value % Int64._TWO_PWR_32_DBL | 0, (value / Int64._TWO_PWR_32_DBL) | 0);
        }
    }

    /**
     * Returns a Long representing the 64-bit integer that comes by concatenating
     * the given high and low bits.  Each is assumed to use 32 bits.
     * @param {number} lowBits The low 32-bits.
     * @param {number} highBits The high 32-bits.
     * @return {Int64} The corresponding Long value.
     */
    public static fromBits(lowBits: number, highBits: number): Int64 {
        return new Int64(lowBits, highBits);
    }

    /**
     * Returns a Long representation of the given string, written using the given
     * radix.
     * @param {string} str The textual representation of the Long.
     * @param {number} opt_radix The radix in which the text is written.
     * @return {Int64} The corresponding Long value.
     */
    public static fromString(str: string, opt_radix: number): Int64 {
        if (str.length == 0) {
            throw Error("number format error: empty string");
        }

        const radix = opt_radix || 10;
        if (radix < 2 || 36 < radix) {
            throw Error("radix out of range: " + radix);
        }

        if (str.charAt(0) == "-") {
            return Int64.fromString(str.substring(1), radix).negate();
        } else if (str.indexOf("-") >= 0) {
            throw Error('number format error: interior "-" character: ' + str);
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        const radixToPower = Int64.fromNumber(Math.pow(radix, 8));

        let result = Int64.ZERO;
        for (let i = 0; i < str.length; i += 8) {
            const size = Math.min(8, str.length - i);
            const value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                const power = Int64.fromNumber(Math.pow(radix, size));
                result = result.multiply(power).add(Int64.fromNumber(value));
            } else {
                result = result.multiply(radixToPower);
                result = result.add(Int64.fromNumber(value));
            }
        }
        return result;
    }

    /** @return {number} The value, assuming it is a 32-bit integer. */
    public toInt(): number {
        return this._low;
    }

    /** @return {number} The closest floating-point representation to this value. */
    public toNumber(): number {
        return this._high * Int64._TWO_PWR_32_DBL + this.getLowBitsUnsigned();
    }

    /**
     * @param {number} opt_radix The radix in which the text should be written.
     * @return {string} The textual representation of this value.
     */
    public toString(opt_radix: number): string {
        let radix = opt_radix || 10;
        if (radix < 2 || 36 < radix) {
            throw Error("radix out of range: " + radix);
        }

        if (this.isZero()) {
            return "0";
        }

        if (this.isNegative()) {
            if (this.equals(Int64.MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                let radixLong = Int64.fromNumber(radix);
                let div = this.div(radixLong);
                let rem = div.multiply(radixLong).subtract(this);
                return div.toString(radix) + rem.toInt().toString(radix);
            } else {
                return "-" + this.negate().toString(radix);
            }
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        let radixToPower = Int64.fromNumber(Math.pow(radix, 6));

        let rem: Int64 = this;
        let result = "";
        while (true) {
            let remDiv = rem.div(radixToPower);
            let intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
            let digits = intval.toString(radix);

            rem = remDiv;
            if (rem.isZero()) {
                return digits + result;
            } else {
                while (digits.length < 6) {
                    digits = "0" + digits;
                }
                result = "" + digits + result;
            }
        }
    }

    /** @return {number} The high 32-bits as a signed value. */
    public getHighBits() {
        return this._high;
    }

    /** @return {number} The low 32-bits as a signed value. */
    public getLowBits() {
        return this._low;
    }

    /** @return {number} The low 32-bits as an unsigned value. */
    public getLowBitsUnsigned() {
        return this._low >= 0 ? this._low : Int64._TWO_PWR_32_DBL + this._low;
    }

    /**
     * @return {number} Returns the number of bits needed to represent the absolute
     *     value of this Long.
     */
    public getNumBitsAbs(): number {
        if (this.isNegative()) {
            if (this.equals(Int64.MIN_VALUE)) {
                return 64;
            } else {
                return this.negate().getNumBitsAbs();
            }
        } else {
            let val = this._high != 0 ? this._high : this._low;
            let bit = 31;
            for (; bit > 0; bit--) {
                if ((val & (1 << bit)) != 0) {
                    break;
                }
            }
            return this._high != 0 ? bit + 33 : bit + 1;
        }
    }

    /** @return {boolean} Whether this value is zero. */
    public isZero(): boolean {
        return this._high == 0 && this._low == 0;
    }

    /** @return {boolean} Whether this value is negative. */
    public isNegative(): boolean {
        return this._high < 0;
    }

    /** @return {boolean} Whether this value is odd. */
    public isOdd(): boolean {
        return (this._low & 1) == 1;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long equals the other.
     */
    public equals(other: Int64): boolean {
        return this._high == other._high && this._low == other._low;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long does not equal the other.
     */
    public notEquals(other: Int64): boolean {
        return this._high != other._high || this._low != other._low;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long is less than the other.
     */
    public lessThan(other: Int64): boolean {
        return this.compare(other) < 0;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long is less than or equal to the other.
     */
    public lessThanOrEqual(other: Int64): boolean {
        return this.compare(other) <= 0;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long is greater than the other.
     */
    public greaterThan(other: Int64): boolean {
        return this.compare(other) > 0;
    }

    /**
     * @param {Int64} other Long to compare against.
     * @return {boolean} Whether this Long is greater than or equal to the other.
     */
    public greaterThanOrEqual(other: Int64): boolean {
        return this.compare(other) >= 0;
    }

    /**
     * Compares this Long with the given one.
     * @param {Int64} other Long to compare against.
     * @return {number} 0 if they are the same, 1 if the this is greater, and -1
     *     if the given one is greater.
     */
    public compare(other: Int64): number {
        if (this.equals(other)) {
            return 0;
        }

        let thisNeg = this.isNegative();
        let otherNeg = other.isNegative();
        if (thisNeg && !otherNeg) {
            return -1;
        }
        if (!thisNeg && otherNeg) {
            return 1;
        }

        // at this point, the signs are the same, so subtraction will not overflow
        if (this.subtract(other).isNegative()) {
            return -1;
        } else {
            return 1;
        }
    }

    /** @return {Int64} The negation of this value. */
    public negate(): Int64 {
        if (this.equals(Int64.MIN_VALUE)) {
            return Int64.MIN_VALUE.clone();
        } else {
            return this.not().add(Int64.ONE);
        }
    }

    /**
     * Returns the sum of this and the given Long.
     * @param {Int64} other Long to add to this one.
     * @return {Int64} The sum of this and the given Long.
     */
    public add(other: Int64): Int64 {
        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        let a48 = this._high >>> 16;
        let a32 = this._high & 0xffff;
        let a16 = this._low >>> 16;
        let a00 = this._low & 0xffff;

        let b48 = other._high >>> 16;
        let b32 = other._high & 0xffff;
        let b16 = other._low >>> 16;
        let b00 = other._low & 0xffff;

        let c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 + b48;
        c48 &= 0xffff;
        return Int64.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
    }

    /**
     * Returns the difference of this and the given Long.
     * @param {Int64} other Long to subtract from this.
     * @return {Int64} The difference of this and the given Long.
     */
    public subtract(other: Int64): Int64 {
        return this.add(other.negate());
    }

    /**
     * Returns the product of this and the given long.
     * @param {Int64} other Long to multiply with this.
     * @return {Int64} The product of this and the other.
     */
    public multiply(other: Int64): Int64 {
        if (this.isZero()) {
            return Int64.ZERO.clone();
        } else if (other.isZero()) {
            return Int64.ZERO.clone();
        }

        if (this.equals(Int64.MIN_VALUE)) {
            return other.isOdd() ? Int64.MIN_VALUE : Int64.ZERO.clone();
        } else if (other.equals(Int64.MIN_VALUE)) {
            return this.isOdd() ? Int64.MIN_VALUE : Int64.ZERO.clone();
        }

        if (this.isNegative()) {
            if (other.isNegative()) {
                return this.negate().multiply(other.negate());
            } else {
                return this.negate().multiply(other).negate();
            }
        } else if (other.isNegative()) {
            return this.multiply(other.negate()).negate();
        }

        // If both longs are small, use float multiplication
        if (this.lessThan(Int64.TWO_PWR_24) && other.lessThan(Int64.TWO_PWR_24)) {
            return Int64.fromNumber(this.toNumber() * other.toNumber());
        }

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        let a48 = this._high >>> 16;
        let a32 = this._high & 0xffff;
        let a16 = this._low >>> 16;
        let a00 = this._low & 0xffff;

        let b48 = other._high >>> 16;
        let b32 = other._high & 0xffff;
        let b16 = other._low >>> 16;
        let b00 = other._low & 0xffff;

        let c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xffff;
        return Int64.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
    }

    /**
     * Returns this Long divided by the given one.
     * @param {Int64} other Long by which to divide.
     * @return {Int64} This Long divided by the given one.
     */
    public div(other: Int64): Int64 {
        if (other.isZero()) {
            throw Error("division by zero");
        } else if (this.isZero()) {
            return Int64.ZERO.clone();
        }

        if (this.equals(Int64.MIN_VALUE)) {
            if (other.equals(Int64.ONE) || other.equals(Int64.NEG_ONE)) {
                return Int64.MIN_VALUE.clone(); // recall that -MIN_VALUE == MIN_VALUE
            } else if (other.equals(Int64.MIN_VALUE)) {
                return Int64.ONE.clone();
            } else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                let halfThis = this.shiftRight(1);
                let approx = halfThis.div(other).shiftLeft(1);
                if (approx.equals(Int64.ZERO)) {
                    return other.isNegative() ? Int64.ONE.clone() : Int64.NEG_ONE.clone();
                } else {
                    let rem = this.subtract(other.multiply(approx));
                    let result = approx.add(rem.div(other));
                    return result;
                }
            }
        } else if (other.equals(Int64.MIN_VALUE)) {
            return Int64.ZERO.clone();
        }

        if (this.isNegative()) {
            if (other.isNegative()) {
                return this.negate().div(other.negate());
            } else {
                return this.negate().div(other).negate();
            }
        } else if (other.isNegative()) {
            return this.div(other.negate()).negate();
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        let res = Int64.ZERO.clone();
        let rem: Int64 = this;
        while (rem.greaterThanOrEqual(other)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            let approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            let log2 = Math.ceil(Math.log(approx) / Math.LN2);
            let delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            let approxRes = Int64.fromNumber(approx);
            let approxRem = approxRes.multiply(other);
            while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                approx -= delta;
                approxRes = Int64.fromNumber(approx);
                approxRem = approxRes.multiply(other);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) {
                approxRes = Int64.ONE.clone();
            }

            res = res.add(approxRes);
            rem = rem.subtract(approxRem);
        }
        return res;
    }

    /**
     * Returns this Long modulo the given one.
     * @param {Int64} other Long by which to mod.
     * @return {Int64} This Long modulo the given one.
     */
    public modulo(other: Int64) {
        return this.subtract(this.div(other).multiply(other));
    }

    /** @return {Int64} The bitwise-NOT of this value. */
    public not(): Int64 {
        return Int64.fromBits(~this._low, ~this._high);
    }

    /**
     * Returns the bitwise-AND of this Long and the given one.
     * @param {Int64} other The Long with which to AND.
     * @return {Int64} The bitwise-AND of this and the other.
     */
    public and(other: Int64) {
        return Int64.fromBits(this._low & other._low, this._high & other._high);
    }

    /**
     * Returns the bitwise-OR of this Long and the given one.
     * @param {Int64} other The Long with which to OR.
     * @return {Int64} The bitwise-OR of this and the other.
     */
    public or(other: Int64): Int64 {
        return Int64.fromBits(this._low | other._low, this._high | other._high);
    }

    /**
     * Returns the bitwise-XOR of this Long and the given one.
     * @param {Int64} other The Long with which to XOR.
     * @return {Int64} The bitwise-XOR of this and the other.
     */
    public xor(other: Int64): Int64 {
        return Int64.fromBits(this._low ^ other._low, this._high ^ other._high);
    }

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number} numBits The number of bits by which to shift.
     * @return {Int64} This shifted to the left by the given amount.
     */
    public shiftLeft(numBits: number): Int64 {
        numBits &= 63;
        if (numBits == 0) {
            return this;
        } else {
            let low = this._low;
            if (numBits < 32) {
                let high = this._high;
                return Int64.fromBits(low << numBits, (high << numBits) | (low >>> (32 - numBits)));
            } else {
                return Int64.fromBits(0, low << (numBits - 32));
            }
        }
    }

    /**
     * Returns this Long with bits shifted to the right by the given amount.
     * @param {number} numBits The number of bits by which to shift.
     * @return {Int64} This shifted to the right by the given amount.
     */
    public shiftRight(numBits: number): Int64 {
        numBits &= 63;
        if (numBits == 0) {
            return this;
        } else {
            let high = this._high;
            if (numBits < 32) {
                let low = this._low;
                return Int64.fromBits((low >>> numBits) | (high << (32 - numBits)), high >> numBits);
            } else {
                return Int64.fromBits(high >> (numBits - 32), high >= 0 ? 0 : -1);
            }
        }
    }

    /**
     * Returns this Long with bits shifted to the right by the given amount, with
     * the new top bits matching the current sign bit.
     * @param {number} numBits The number of bits by which to shift.
     * @return {Int64} This shifted to the right by the given amount, with
     * zeros placed into the new leading bits.
     */
    public shiftRightUnsigned(numBits: number): Int64 {
        numBits &= 63;
        if (numBits == 0) {
            return this;
        } else {
            let high = this._high;
            if (numBits < 32) {
                let low = this._low;
                return Int64.fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits);
            } else if (numBits == 32) {
                return Int64.fromBits(high, 0);
            } else {
                return Int64.fromBits(high >>> (numBits - 32), 0);
            }
        }
    }

    /**
     *  @return {Int64} clone PQLong
     */
    public clone(): Int64 {
        return new Int64(this._low, this._high);
    }
}
