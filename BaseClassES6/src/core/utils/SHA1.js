/**
 * Created by yanmingjie on 2015/7/22.
 */
class SHA1 extends BaseClass {

    constructor() {
        super();
        this.hexcase = 1; /* hex output format. 0 - lowercase; 1 - uppercase        */
        this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    }

    /**
     * string encrypt 
     * @param s that needs to be encrypted
     * @param hexcase format: 0 - lowercase; 1 - uppercase (The default lowercase)
     */
    encrypt(s, hexcase = 0){
        this.hexcase = hexcase;
        return this.hex_sha1(s);
    }
    /*
     * Perform a simple self-test to see if the VM is working
     */
    sha1_vm_test () {
        //加密小写
        return this.hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
    };
    
    hex_sha1 (s) {return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(s)));};
    b64_sha1 (s) { return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(s))); };
    any_sha1 (s, e) { return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(s)), e); };
    hex_hmac_sha1 (k, d) { return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    b64_hmac_sha1 (k, d) { return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    any_hmac_sha1 (k, d, e) { return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
    /*
     * Calculate the SHA1 of a raw string
     */
    rstr_sha1 (s) {
        return this.binb2rstr(this.binb_sha1(this.rstr2binb(s), s.length * 8));
    };
    /*
     * Calculate the HMAC-SHA1 of a key and some data (raw strings)
     */
    rstr_hmac_sha1 (key, data) {
        let bkey = this.rstr2binb(key);
        if (bkey.length > 16)
            bkey = this.binb_sha1(bkey, key.length * 8);
        let ipad = Array(16), opad = Array(16);
        for (let i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        let hash = this.binb_sha1(ipad.concat(this.rstr2binb(data)), 512 + data.length * 8);
        return this.binb2rstr(this.binb_sha1(opad.concat(hash), 512 + 160));
    };
    /*
     * Convert a raw string to a hex string
     */
    rstr2hex (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        let hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef"; //有大小写区分
        let output = "";
        let x;
        for (let i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    /*
     * Convert a raw string to a base-64 string
     */
    rstr2b64 (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let output = "";
        let len = input.length;
        for (let i = 0; i < len; i += 3) {
            let triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (let j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    rstr2any (input, encoding) {
        let divisor = encoding.length;
        let remainders = Array();
        let i, q, x, quotient;
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        let dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. We stop when the dividend is zero.
         * All remainders are stored for later use.
         */
        while (dividend.length > 0) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[remainders.length] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        let output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        /* Append leading zero equivalents */
        let full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
        for (i = output.length; i < full_length; i++)
            output = encoding[0] + output;
        return output;
    };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    str2rstr_utf8 (input) {
        let output = "";
        let i = -1;
        let x, y;
        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    /*
     * Encode a string as utf-16
     */
    str2rstr_utf16le (input) {
        let output = "";
        for (let i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    str2rstr_utf16be (input) {
        let output = "";
        for (let i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    /*
     * Convert a raw string to an array of big-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    rstr2binb (input) {
        let output = Array(input.length >> 2);
        for (let i = 0; i < output.length; i++)
            output[i] = 0;
        for (let i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        return output;
    };
    /*
     * Convert an array of big-endian words to a string
     */
    binb2rstr (input) {
        let output = "";
        for (let i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
        return output;
    };
    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    binb_sha1 (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;
        let w = Array(80);
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        let e = -1009589776;
        for (let i = 0; i < x.length; i += 16) {
            let olda = a;
            let oldb = b;
            let oldc = c;
            let oldd = d;
            let olde = e;
            for (let j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = this.bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                let t = this.safe_add(this.safe_add(this.bit_rol(a, 5), this.sha1_ft(j, b, c, d)), this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
                e = d;
                d = c;
                c = this.bit_rol(b, 30);
                b = a;
                a = t;
            }
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
            e = this.safe_add(e, olde);
        }
        return [a, b, c, d, e];
    };
    /*
     * Perform the appropriate triplet combination private for the current
     * iteration
     */
    sha1_ft (t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    };
    /*
     * Determine the appropriate additive constant for the current iteration
     */
    sha1_kt (t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
            (t < 60) ? -1894007588 : -899497514;
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    safe_add (x, y) {
        let lsw = (x & 0xFFFF) + (y & 0xFFFF);
        let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    bit_rol (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

}