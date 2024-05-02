import { Laya } from 'Laya';
import Singleton from '../base/Singleton';

export const enum StorageKey {
	/**历史登录服务器 */
	HISTORY_SERVERS = 'xxxx_history_servers',
}

export default class StorageManager extends Singleton {

	public setItem(key: StorageKey, value: any): void {
		const storage = Laya.LocalStorage;
		if (key !== StorageKey.HISTORY_SERVERS) {
			storage.setItem(key, `${value}`);
		} else {
			const hisValue = this.getItem(StorageKey.HISTORY_SERVERS);
			if (hisValue) {
				const arr = hisValue.split(",");
				if (!arr.includes(value)) {
					storage.setItem(key, `${hisValue}${value},`);
				}
			} else {
				storage.setItem(key, `${value},`);
			}
		}
	}

	public getItem(key: StorageKey): string | null {
		return Laya.LocalStorage.getItem(key);
	}

}
