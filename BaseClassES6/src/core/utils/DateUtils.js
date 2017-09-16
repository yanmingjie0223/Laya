/*
* name;
*/
class DateUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 1 格式化时间获取 00:00:00
     * @param 时间戳差 {number}
     */
    formatTime(time) {
        let str = "";
        let h = time / 3600;
        h = parseInt(h + "");
        let m = (time - h * 3600) / 60;
        m = parseInt(m + "");
        let s = time - h * 3600 - m * 60;
        s = parseInt(s + "");
        if (h > 0) {
            str += h + ":";
        }
        if (m > 9) {
            str += m + ":";
        }
        else {
            str += "0" + m + ":";
        }
        if (s > 9) {
            str += s + "";
        }
        else {
            str += "0" + s;
        }
        return str;
    };

    /**
     * 2 使用时间返回所需要的字符串格式"2016年06月12日"
     * @param 时间戳 {number}
     * @param 返回格式 "yyyy年MM月dd日" {string}
     * @return 返回指点格式字符串 {string}
     * */
    millisecondsToDate(time, fmt) {
        let d = new Date(time);
        let o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours(),
            "H+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds() //毫秒
        };
        let week = {
            "0": "\u65e5",
            "1": "\u4e00",
            "2": "\u4e8c",
            "3": "\u4e09",
            "4": "\u56db",
            "5": "\u4e94",
            "6": "\u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[d.getDay() + ""]);
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

}