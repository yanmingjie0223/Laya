declare class moosnowHeavy {
	constructor();
	/**
	 * 登录接口
	 * @param callback  登录回调接收参数  data
		 * data.code   0:失败   1：成功
		 * data.info
		 * data.unionid
		 * data.openid
	 */
	static login(callback: any): void;

	/**
	 * androidPay 安卓支付
	 * @param signature string 订单加密字符串
	 * @param obj object  {success 成功回调函数    fail 失败回调函数    complete 完成回调函数}
	 */
	static androidPay(signature: string, obj?): void;

	/**
	 * IOS打开客服操作
	 * @param signature  string 订单加密字符串
	 * @param obj object  {success 成功回调函数    fail 失败回调函数    complete 完成回调函数  sendMessageImg 客服会话右下角图片备用链接}
	 */
	static openCustomerServiceConversation(signature: string, obj: any): void;

	/**
	 * 订阅消息
	 */
	static requestSubscribeMessage(): void;

	/**
	 * 保存用户游戏角色信息
	 * @param obj object  {roleId 角色ID    roleName 角色名称    serverId 服务器ID   vip  vip等级}
	 */
	static reportPlayerInfo(obj): void;

	//敏感词检测
	// @param content   string    检测文本,不能超过2500字
	// @param callback  回调函数  返回data
	/**
	//接口会先用wordsCheck传入的第一个字符串进行墨雪后台屏蔽字检测，检测后的结果为replaceto字符串，然后用replaceto字符串进行官方敏感词检测，检测结果为label    100为正常值，其它请接入方自行处理
	{
		"code": 1, //接口返回状态，1-成功 0失败，接口返回401，是登陆态丢失
		"info": "成功", //消息
		"data": {
			"suggest": "pass", //微信审核建议
			"label": 100, //命中标签枚举值，100 正常；10001 广告；20001 时政；20002 色情；20003 辱骂；20006 违法犯罪；20008 欺诈；20012 低俗；20013 版权；21000 其他
			"replacefrom": "习近平是种花家的主席", //替换前的文本
			"replaceto": "***是种花家的主席" //替换后的文本
		}
	}
	*/
	static wordsCheck(content, callback): void;

	//更新游戏角色信息
	//需要接入方在游戏中每隔30秒以内重复调用,角色等级、元宝等(货币不限于元宝，其它也可上传)需要获取最新的上传   用于后端统计在线情况   注意：不能超过30秒调用，否则会认为离线
	/**
	 * 更新游戏角色信息
	 * @param obj object  {
				roleId:角色ID
				roleName:角色名称
				serverId:服务器ID
				vip:vip等级
				custom:{
					"level": 999,              // 等级
					"power": "38496123",       // 战力
					"元宝": "5550000",
				}
			}
	 * @param callback 接口回调函数 接收参数  data
	 *      data.code     1: 保存成功  0：失败
	 */
	static heartBeatReportPlayerInfo(obj, callback?): void;
	/**
	 * 设置接口
	 */
	static get setting(): { setValue(key, value); getString(key, dvalue?): string };
}

declare class moosnowH5Sdk {
	constructor();
	/**
	 * 登录接口
	 * @param callback  登录回调接收参数  data
		 * data.code   0:失败   1：成功
		 * data.info
		 * data.unionid
		 * data.openid
	 */
	static login(callback: any): void;
	/**
	* 保存用户游戏角色信息
	* @param obj object  {roleId 角色ID    roleName 角色名称    serverId 服务器ID   vip  vip等级}
	*/
	static reportPlayerInfo(obj): void;
	//更新游戏角色信息
	//需要接入方在游戏中每隔30秒以内重复调用,角色等级、元宝等(货币不限于元宝，其它也可上传)需要获取最新的上传   用于后端统计在线情况   注意：不能超过30秒调用，否则会认为离线
	/**
	 * 更新游戏角色信息
	 * @param obj object  {
				roleId:角色ID
				roleName:角色名称
				serverId:服务器ID
				vip:vip等级
				custom:{
					"level": 999,              // 等级
					"power": "38496123",       // 战力
					"元宝": "5550000",
				}
			}
	 * @param callback 接口回调函数 接收参数  data
	 *      data.code     1: 保存成功  0：失败
	 */
	static heartBeatReportPlayerInfo(obj, callback?): void;
	/**
	 * 支付调用 signature 加密订单字符串
	 * @param signature
	 * @param obj object  {success 成功回调函数    fail 失败回调函数    complete 完成回调函数}
	 */
	static payOrder(signature, obj?): void;
	/**
	 * 重启
	 */
	static restart(): void;
	/**
	 * 第一次进入登录
	 */
	static firstTimeEnterLoginPage(): void;
	/**
	 * 设置接口
	 */
	static get setting(): { setValue(key, value); getString(key, dvalue?): string };
}

declare class MxFc {
	constructor();
	destroy(): void;
}