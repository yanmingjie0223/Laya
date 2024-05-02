import EventManager from './manager/EventManager';
import FguiManager from './manager/FguiManager';
import HttpManager from './manager/HttpManager';
import I18nManager from './manager/I18nManager';
import LayerManager from './manager/LayerManager';
import { LoadingManager } from './manager/LoadingManager';
import LoadManager from './manager/LoadManager';
import ModelManager from './manager/ModelManager';
import PathManager from './manager/PathManager';
import ResManager from './manager/ResManager';
import SoundManager from './manager/SoundManager';
import StageManager from './manager/StageManager';
import StorageManager from './manager/StorageManager';
import TimeManager from './manager/TimeManager';
import ViewManager from './manager/ViewManager';
import ArrayUtils from './utils/ArrayUtils';
import DateUtils from './utils/DateUtils';
import DebugUtils from './utils/DebugUtils';
import DisplayUtils from './utils/DisplayUtils';
import EffectUtils from './utils/EffectUtils';
import MathUtils from './utils/MathUtils';
import RandomUtils from './utils/RandomUtils';
import StringUtils from './utils/StringUtils';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:06:25
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 22:57:20
 */
export default class App {
	/**是否自动游戏 */
	public static isAutoGame: boolean = false;
	/**是否连接外网 */
	public static isInternet: boolean = false;

	public static get TimeManager(): TimeManager {
		return TimeManager.getInstance<TimeManager>();
	}

	public static get StageManager(): StageManager {
		return StageManager.getInstance<StageManager>();
	}

	public static get HttpManager(): HttpManager {
		return HttpManager.getInstance<HttpManager>();
	}

	public static get SoundManager(): SoundManager {
		return SoundManager.getInstance<SoundManager>();
	}

	public static get LayerManager(): LayerManager {
		return LayerManager.getInstance<LayerManager>();
	}

	public static get EventManager(): EventManager {
		return EventManager.getInstance();
	}

	public static get I18nManager(): I18nManager {
		return I18nManager.getInstance();
	}

	public static get PathManager(): PathManager {
		return PathManager.getInstance<PathManager>();
	}

	public static get LoadManager(): LoadManager {
		return LoadManager.getInstance<LoadManager>();
	}

	public static get LoadingManager(): LoadingManager {
		return LoadingManager.getInstance<LoadingManager>();
	}

	public static get ResManager(): ResManager {
		return ResManager.getInstance<ResManager>();
	}

	public static get ViewManager(): ViewManager {
		return ViewManager.getInstance<ViewManager>();
	}

	public static get FguiManager(): FguiManager {
		return FguiManager.getInstance<FguiManager>();
	}

	public static get ModelManager(): ModelManager {
		return ModelManager.getInstance<ModelManager>();
	}

	public static get ArrayUtils(): ArrayUtils {
		return ArrayUtils.getInstance<ArrayUtils>();
	}

	public static get DateUtils(): DateUtils {
		return DateUtils.getInstance<DateUtils>();
	}

	public static get DebugUtils(): DebugUtils {
		return DebugUtils.getInstance<DebugUtils>();
	}

	public static get EffectUtils(): EffectUtils {
		return EffectUtils.getInstance<EffectUtils>();
	}

	public static get MathUtils(): MathUtils {
		return MathUtils.getInstance<MathUtils>();
	}

	public static get RandomUtils(): RandomUtils {
		return RandomUtils.getInstance<RandomUtils>();
	}

	public static get StringUtils(): StringUtils {
		return StringUtils.getInstance<StringUtils>();
	}

	public static get DisplayUtils(): DisplayUtils {
		return DisplayUtils.getInstance<DisplayUtils>();
	}

	public static get StorageManager(): StorageManager {
		return StorageManager.getInstance<StorageManager>();
	}
}
