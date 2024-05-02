/**
 * 对状态处理的状态类
 */
export class Status<E extends number> {

	private _status: number = 0;

	/**
	 * 加入状态
	 * @param status
	 */
	public addStatus(status: E): void {
		this._status |= 1 << status;
	}

	/**
	 * 去除状态
	 * @param status
	 */
	public removeStatus(status: E): void {
		this._status &= ~(1 << status);
	}

	/**
	 * 清理所有状态
	 */
	public clear(): void {
		this._status = 0;
	}

	/**
	 * 判断是否该状态
	 * @param status
	 * @returns
	 */
	public isStatus(status: E): boolean {
		const code = this._status & (1 << status);
		return code !== 0;
	}

}
