/*
* name;
*/
class MathUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 弧度制转换为角度值
     * @param {number} radian
     * @returns {number}
     */
    getAngle(radian) {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param {number} angle
     */
    getRadian(angle) {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    getRadianTwoPoint(p1, p2) {
        let xdis = p2.x - p1.x;
        let ydis = p2.y - p1.y;
        return Math.atan2(ydis, xdis);
    }

    /**
     * 获取两点间旋转角度（顺时针）
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    getAngleTwoPoint(p1, p2){
        let vy = p2.y - p1.y;
        let vx = p2.x - p1.x;
        let ang;

        if (vy == 0) {
            if (vx < 0) {
                return 180;
            }
            return 0;
        }

        if (vx == 0){ //正切是vy/vx所以vx==0排除
            if (vy > 0) {
                ang = 90;
            }
            else if (vy < 0) {
                ang = 270;
            }
            return ang;
        }

        ang = this.getAngle( Math.atan( Math.abs(vy)/Math.abs(vx) ) );
        if (vx > 0) {
            if (vy < 0) {
                ang = 360 - ang;
            }
        }
        else {
            if (vy > 0) {
                ang = 180 - ang;
            }
            else {
                ang = 180 + ang;
            }
        }
        return ang;
    }

    /**
     * 获取两点间距离
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    getDistance(p1, p2) {
        let disX = p2.x - p1.x;
        let disY = p2.y - p1.y;
        let disQ = Math.pow(disX, 2) + Math.pow(disY, 2);
        return Math.sqrt(disQ);
    }

    /**
     * 精确到小数点后多少位（舍尾）
     * @param {number} 精确值
     * @param {number} 精确位数
     * @return {number}
     * */
    exactCount(exactValue, count = 0) {
        let num = Math.pow(10, count);
        let value = (exactValue * num) | 0;
        return value / num;
    }

    /**
     * [0-1]区间获取二次贝塞尔曲线点切线角度
     * @param {Point} p0起点
     * @param {Point} p1控制点
     * @param {Point} p2终点
     * @param {number} t [0-1]区间
     * @return {number}
     * */
    getBezierCutAngle(p0, p1, p2, t) {
        let _x = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
        let _y = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
        let angle = this.getAngle( Math.atan2(_y, _x) );
        return angle;
    }

    /**
     * [0-1]区间获取二次贝塞尔曲线上某点坐标
     * @param {Point} p0 起点
     * @param {Point} p1 控制点
     * @param {Point} p2 终点
     * @param {number} t [0-1]区间
     * @param {Point} 缓存的点对象，如不存在则生成新的点对象
     * @return {Laya.Point}
     * */
    getBezierPoint(p0, p1, p2, t, point = null) {
        if (!point) {
            point = new Laya.Point();
        }
        point.x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
        point.y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
        return point;
    }


}