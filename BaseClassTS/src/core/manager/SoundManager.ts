import { Laya } from 'Laya';
import { SoundChannel } from 'laya/media/SoundChannel';
import { Handler } from 'laya/utils/Handler';
import Singleton from '../base/Singleton';

/*
 * @Author: yanmingjie
 * @Date: 2019-12-17 23:30:15
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:39:51
 */
export default class SoundManager extends Singleton {

	public static readonly IS_MUTE: string = "xxxx_isMute";
	public static readonly IS_MUTE_MUSIC: string = "xxxx_isMuteMusic";
	public static readonly IS_MUTE_SOUND: string = "xxxx_isMuteSound";
	public static readonly VOLUME_MUSIC: string = "xxxx_volumeMusic";
	public static readonly VOLUME_SOUND: string = "xxxx_volumeSound";

	private _isMute: boolean = false;
	private _isMuteMusic: boolean = false;
	private _isMuteSound: boolean = false;
	private _volumeMusic: number = 1;
	private _volumeSound: number = 1;
	private _musicChannel: SoundChannel = null!;

	public constructor() {
		super();
		this._initData();
		this.save();
	}

	/**
	 * 销毁一个音乐
	 * @param url 音乐地址
	 */
	public destroySound(url: string) {
		Laya.SoundManager.destroySound(url);
	}

	/**
	 * 关闭所有音乐
	 */
	public stopAll() {
		Laya.SoundManager.stopAll();
	}

	/**
	 * 关闭所有音效
	 */
	public stopAllEffect() {
		Laya.SoundManager.stopAllSound();
	}

	/**
	 * 关闭所有背景音效
	 */
	public stopMusic() {
		Laya.SoundManager.stopMusic();
	}

	/**
	 * 关闭单个音效
	 * @param url 音乐地址
	 */
	public stopSound(url: string) {
		Laya.SoundManager.stopSound(url);
	}

	/**
	 * 播放音效
	 * @param url
	 * @param loops
	 * @param complete
	 * @param soundClass
	 * @param startTime
	 * @returns
	 */
	public playEffect(url: string, loops: number = 1, complete: Handler = null, soundClass = null, startTime: number = 0): SoundChannel {
		return Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime);
	}

	/**
	 * 播放背景音乐
	 * @param url
	 * @param loops
	 * @param complete
	 * @param startTime
	 * @returns
	 */
	public playMusic(url: string, loops: number = 0, complete: Handler = null, startTime: number = 0): SoundChannel {
		const channel = Laya.SoundManager.playMusic(url, loops, complete, startTime);
		if (!channel) {
			return;
		}

		if (this._musicChannel) {
			this._musicChannel.stop();
		}
		this._musicChannel = channel;
		return this._musicChannel;
	}

	public getMusicChannel(): SoundChannel {
		return this._musicChannel;
	}

	/**
	 * 设置获取背景声音大小
	 */
	public get volumeMusic(): number {
		return this._volumeMusic;
	}
	public set volumeMusic(value) {
		this._volumeMusic = value;
		Laya.SoundManager.setMusicVolume(value);
		this.save();
	}

	/**
	 * 设置获取音效声音大小
	 */
	public get volumeSound(): number {
		return this._volumeSound;
	}
	public set volumeSound(value) {
		this._volumeSound = value;
		Laya.SoundManager.setSoundVolume(value);
		this.save();
	}

	/**
	 * 设置获取是否静音背景音乐
	 */
	public get isMuteMusic(): boolean {
		return this._isMuteMusic;
	}
	public set isMuteMusic(value) {
		this._isMuteMusic = value;
		Laya.SoundManager.musicMuted = value;
		this.save();
	}

	/**
	 * 设置获取是否静音音效音乐
	 */
	public get isMuteSound(): boolean {
		return this._isMuteSound;
	}
	public set isMuteSound(value) {
		this._isMuteSound = value;
		Laya.SoundManager.soundMuted = value;
		this.save();
	}

	/**
	 * 设置获取是否所有静音
	 */
	public get isMute(): boolean {
		return this._isMute;
	}
	public set isMute(value) {
		this._isMute = value;
		Laya.SoundManager.muted = value;
		this.save();
	}

	/**
	 * 获取背景音乐管道
	 */
	public get musicChannel(): SoundChannel {
		return this._musicChannel;
	}

	/**
	 * 保存数据到本地
	 */
	private save() {
		Laya.LocalStorage.setItem(SoundManager.IS_MUTE, `${this.isMute}`);
		Laya.LocalStorage.setItem(SoundManager.IS_MUTE_MUSIC, `${this.isMuteMusic}`);
		Laya.LocalStorage.setItem(SoundManager.IS_MUTE_SOUND, `${this.isMuteSound}`);
		Laya.LocalStorage.setItem(SoundManager.VOLUME_MUSIC, `${this.volumeMusic}`);
		Laya.LocalStorage.setItem(SoundManager.VOLUME_SOUND, `${this.volumeSound}`);
	}

	/**
	 * 获取初始音乐基础信息，存储在本地浏览器中
	 */
	private _initData() {
		const isMuteMusic = Laya.LocalStorage.getItem(SoundManager.IS_MUTE_MUSIC);
		this._isMuteMusic = isMuteMusic === "true";
		const isMuteSound = Laya.LocalStorage.getItem(SoundManager.IS_MUTE_SOUND);
		this._isMuteSound = isMuteSound === "true";
		const isMute = Laya.LocalStorage.getItem(SoundManager.IS_MUTE);
		this._isMute = isMute === "true";

		const volumeMusic = Laya.LocalStorage.getItem(SoundManager.VOLUME_MUSIC);
		this._volumeMusic = volumeMusic ? parseFloat(volumeMusic) : 1;
		const volumeSound = Laya.LocalStorage.getItem(SoundManager.VOLUME_SOUND);
		this._volumeSound = volumeSound ? parseFloat(volumeSound) : 1;

		Laya.SoundManager.muted = this.isMute;
		Laya.SoundManager.musicMuted = this.isMuteMusic;
		Laya.SoundManager.soundMuted = this.isMuteSound;
		Laya.SoundManager.musicVolume = this.volumeMusic;
		Laya.SoundManager.soundVolume = this.volumeSound;
	}

}
