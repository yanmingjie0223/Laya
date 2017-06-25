/*
* name;
*/
var MathUtils = (function () {

    function MathUtils() {
        MathUtils.__super.call(this);
    }

    Laya.class(MathUtils, "MathUtils", BaseClass);
    var _proto_ = MathUtils.prototype;

    /**
     * 弧度制转换为角度值
     * @param radian {number}
     * @returns {number}
     */
    _proto_.getAngle = function(radian) {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param angle {number}
     */
    _proto_.getRadian = function(angle) {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param p1 {Point}
     * @param p2 {Point}
     * @returns {number}
     */
    _proto_.getRadianTwoPoint = function(p1, p2) {
        var xdis = p2.x - p1.x;
        var ydis = p2.y - p1.y;
        return Math.atan2(ydis, xdis);
    }

    /**
     * 获取两点间旋转角度（顺时针）
     * @param p1 {Point}
     * @param p2 {Point}
     * @returns {number}
     */
    _proto_.getAngleTwoPoint = function(p1, p2){
        var vy = p2.y - p1.y;
        var vx = p2.x - p1.x;
        var ang;

        if(vy == 0){
            if(vx < 0){
                return 180;
            }
            return 0;
        }
        
        if(vx == 0){ //正切是vy/vx所以vx==0排除
            if(vy > 0){
                ang = 90;
            }else if(vy < 0){
                ang = 270;
            }
            return ang;
        }

        ang = this.getAngle( Math.atan( Math.abs(vy)/Math.abs(vx) ) );
        if(vx > 0){
            if(vy < 0){
                ang = 360 - ang;
            }
        }else{
            if(vy > 0){
                ang = 180 - ang;
            }else{
                ang = 180 + ang;
            }
        }
        return ang;
    }

    /**
     * 获取两点间距离
     * @param p1 {Point}
     * @param p2 {Point}
     * @returns {number}
     */
    _proto_.getDistance = function(p1, p2) {
        var disX = p2.x - p1.x;
        var disY = p2.y - p1.y;
        var disQ = Math.pow(disX, 2) + Math.pow(disY, 2);
        return Math.sqrt(disQ);
    }

    /**
     * 精确到小数点后多少位（舍尾）
     * @param 精确值    {number}
     * @param 精确位数  {number}
     * */
    _proto_.exactCount = function (exactValue, count) {
        (count === void 0) && (count = 0);
        var num = Math.pow(10, count);
        var value = (exactValue * num) | 0;
        return value / num;
    };

    /**
     * [0-1]区间获取二次贝塞尔曲线点切线角度
     * @param p0起点      {Point}
     * @param p1控制点    {Point}
     * @param p2终点      {Point}
     * @param [0-1]区间   {number}
     * */
    _proto_.getBezierCutAngle = function (p0, p1, p2, t) {
        var _x = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
        var _y = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
        var angle = this.getAngle( Math.atan2(_y, _x) );
        return angle;
    };

    /**
     * [0-1]区间获取二次贝塞尔曲线上某点坐标
     * @param p0起点      {Point}
     * @param p1控制点    {Point}
     * @param p2终点      {Point}
     * @param [0-1]区间   {number}
     * @param 缓存的点对象，如不存在则生成新的点对象 {Point}
     * */
    _proto_.getBezierPoint = function (p0, p1, p2, t, point) {
        (point === void 0) && (point = new Laya.Point);
        point.x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
        point.y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
        return point;
    };

    return MathUtils;
}());