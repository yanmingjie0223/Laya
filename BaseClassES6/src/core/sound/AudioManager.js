/*
* name;
*/
class AudioManager extends BaseClass {

    constructor() {
        super();

        this._isMute = false;
        this._isMuteMusic = false;
        this._isMuteSound = false;

        this._volumeMusic = 1;
        this._volumeSound = 1;

        this._initData();
        this.save();
    }

    /**
     * 获取初始音乐基础信息，存储在本地浏览器中
     */
    _initData() {
        let isMuteMusic = Laya.LocalStorage.getItem("isMuteMusic");
        this._isMuteMusic = isMuteMusic === "true" ? true : false;
        let isMuteSound = Laya.LocalStorage.getItem("isMuteSound");
        this._isMuteSound = isMuteSound === "true" ? true : false;
        let isMute = Laya.LocalStorage.getItem("isMute");
        this._isMute = isMute === "true" ? true : false;

        let volumeMusic = Laya.LocalStorage.getItem("volumeMusic");
        this._volumeMusic = volumeMusic ? parseFloat(volumeMusic) : 1;
        let volumeSound = Laya.LocalStorage.getItem("volumeSound");
        this._volumeSound = volumeSound ? parseFloat(volumeSound) : 1;

        Laya.SoundManager.muted = this.isMute;
        Laya.SoundManager.musicMuted = this.isMuteMusic;
        Laya.SoundManager.soundMuted = this.isMuteSound;
        Laya.SoundManager.musicVolume = this.volumeMusic;
        Laya.SoundManager.soundVolume = this.volumeSound;
    }

    /**
     * 销毁一个音乐
     * @param 音乐地址
     */
    destroySound(url) {
        Laya.SoundManager.destroySound(url);
    }

    /**
     * 关闭所有音乐
     */
    stopAll() {
        Laya.SoundManager.stopAll();
    }

    /**
     * 关闭所有音效
     */
    stopAllSound() {
        Laya.SoundManager.stopAllSound();
    }

    /**
     * 关闭所有背景音效
     */
    stopMusic() {
        Laya.SoundManager.stopMusic();
    }

    /**
     * 关闭单个音效
     * @param 音乐地址
     */
    stopSound(url) {
        Laya.SoundManager.stopSound(url);
    }

    /**
     * 播放音效
     */
    playSound(url, loops = 1, complete = null, soundClass = null, startTime = 0) {
        Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime);
    }

    /**
     * 播放背景音乐
     */
    playMusic(url, loops = 0, complete = null, startTime = 0) {
        Laya.SoundManager.playMusic(url, loops, complete, startTime);
    }

    /**
     * 设置获取背景声音大小
     */
    get volumeMusic() {
        return this._volumeMusic;
    }
    set volumeMusic(value) {
        this._volumeMusic = value;
        Laya.SoundManager.setMusicVolume(value);
        this.save();
    }
    
    /**
     * 设置获取音效声音大小
     */
    get volumeSound() {
        return this._volumeSound;
    }
    set volumeSound(value) {
        this._volumeSound = value;
        Laya.SoundManager.setSoundVolume(value);
        this.save();
    }

    /**
     * 设置获取是否静音背景音乐
     */
    get isMuteMusic() {
        return this._isMuteMusic;
    }
    set isMuteMusic(value) {
        this._isMuteMusic = value;
        Laya.SoundManager.musicMuted = value;
        this.save();
    }

    /**
     * 设置获取是否静音音效音乐
     */
    get isMuteSound() {
        return this._isMuteSound;
    }
    set isMuteSound(value) {
        this._isMuteSound = value;
        Laya.SoundManager.soundMuted = value;
        this.save();
    }

    /**
     * 设置获取是否所有静音
     */
    get isMute() {
        return this._isMute;
    }
    set isMute(value) {
        this._isMute = value;
        Laya.SoundManager.muted = value;
        this.save();
    }

    /**
     * 保存数据到本地
     */
    save() {
        Laya.LocalStorage.setItem("isMute", this.isMute);
        Laya.LocalStorage.setItem("isMuteMusic", this.isMuteMusic);
        Laya.LocalStorage.setItem("isMuteSound", this.isMuteSound);
        Laya.LocalStorage.setItem("volumeMusic", this.volumeMusic);
        Laya.LocalStorage.setItem("volumeSound", this.volumeSound);
    }

}