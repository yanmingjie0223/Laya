/*
* name;
*/
var AudioManager = (function () {

    function AudioManager() {
        this.__super.call(this);

        this._isMute = false;

        this._isMuteBg = false;
        this._isMuteEffect = false;

        this._volumeBg = 1;
        this._volumeEffect = 1;

        this._autoStopMusic = true;
        this.playbackRate

        this.initData();
        this.save();
    }

    Laya.class(AudioManager, "AudioManager", BaseClass);
    var _proto_ = AudioManager.prototype;
    var _getset_ = Laya.getset;

    _proto_.initData = function(){
        var isMuteBg = Laya.LocalStorage.getItem("isMuteBg");
        this._isMuteBg = !!isMuteBg ? true : false;
        var isMuteEffect = Laya.LocalStorage.getItem("isMuteEffect");
        this._isMuteEffect = !!isMuteEffect ? true : false;
        var isMute = Laya.LocalStorage.getItem("isMute");
        this._isMute = !!isMute ? true : false;

        var volumeBg = Laya.LocalStorage.getItem("volumeBg");
        this._volumeBg = (volumeBg || volumeBg == 0) ? volumeBg : 1;
        var volumeEffect = Laya.LocalStorage.getItem("volumeEffect");
        this._volumeEffect = (volumeEffect || volumeEffect == 0) ? volumeEffect : 1;

        Laya.SoundManager.musicMuted = this.isMuteBg;
        Laya.SoundManager.soundMuted = this.isMuteEffect;
        Laya.SoundManager.muted = this.isMute;
        Laya.SoundManager.musicVolume = this.volumeBg;
        Laya.SoundManager.soundVolume = this.volumeEffect;
    }


    /**
     * api方法 SoundManager
     */
    _proto_.addChannel = function(channel){
        Laya.SoundManager.addChannel(channel);
    }
    _proto_.destroySound = function(url){
        Laya.SoundManager.destroySound(url);
    }
    _proto_.playMusic = function(url, loops, complete, startTime){
        (loops === void 0) && (loops = 0);
        (complete === void 0) && (complete = null);
        (startTime === void 0) && (startTime = 0);
        Laya.SoundManager.playSound(url, loops, complete, startTime);
    }
    _proto_.playSound = function(url, loops, complete, soundClass, startTime){
        (loops === void 0) && (loops = 1);
        (complete === void 0) && (complete = null);
        (soundClass === void 0) && (soundClass = null);
        (startTime === void 0) && (startTime = 0);
        Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime);
    }
    _proto_.removeChannel = function(channel){
        Laya.SoundManager.removeChannel(channel);
    }
    _proto_.setMusicVolume = function(volume){
        Laya.SoundManager.setMusicVolume(volume);
        this._volumeBg = volume;
        this.save();
    }
    _proto_.setSoundVolume = function(volume){
        Laya.SoundManager.setSoundVolume(volume);
        this._volumeEffect = volume;
        this.save();
    }
    _proto_.stopAll = function(){
        Laya.SoundManager.stopAll();
    }
    _proto_.stopAllSound = function(){
        Laya.SoundManager.stopAllSound();
    }
    _proto_.stopMusic = function(){
        Laya.SoundManager.stopMusic();
    }
    _proto_.stopSound = function(url){
        Laya.SoundManager.stopSound(url);
    }
    
    _getset_(0, _proto_, "playbackRate",
        function(){
            return Laya.SoundManager.playbackRate;
        },
        function(value){
            Laya.SoundManager.playbackRate = value;
        }
    );

    _getset_(0, _proto_, "autoStopMusic",
        function(){
            return Laya.SoundManager.autoStopMusic;
        },
        function(value){
            Laya.SoundManager.autoStopMusic = value;
        }
    );

    _getset_(0, _proto_, "musicMuted",
        function(){
            return this.isMuteBg;
        },
        function(value){
            this.isMuteBg = value;
        }
    );

    _getset_(0, _proto_, "musicVolume",
        function(){
            return this.volumeBg;
        },
        function(value){
            this.volumeBg = value;
        }
    );

    _getset_(0, _proto_, "soundMuted",
        function(){
            return this.isMuteEffect;
        },
        function(value){
            this.isMuteEffect = value;
        }
    );

    _getset_(0, _proto_, "soundVolume",
        function(){
            return this.volumeEffect;
        },
        function(value){
            this.volumeEffect = value;
        }
    );

    /**
     * 拓展api
     */
    _proto_.save = function(){
        Laya.LocalStorage.setItem("isMute", this.isMute);
        Laya.LocalStorage.setItem("isMuteBg", this.isMuteBg);
        Laya.LocalStorage.setItem("isMuteEffect", this.isMuteEffect);
        Laya.LocalStorage.setItem("volumeBg", this.volumeBg);
        Laya.LocalStorage.setItem("volumeEffect", this.volumeEffect);
    }

    _getset_(0, _proto_, "volumeBg",
        function(){
            return this._volumeBg;
        },
        function(value){
            this._volumeBg = value;
            Laya.SoundManager.musicVolume = value;
            this.save();
        }
    );

    _getset_(0, _proto_, "volumeEffect",
        function(){
            return this._volumeEffect;
        },
        function(value){
            this._volumeEffect = value;
            Laya.SoundManager.soundVolume = value;
            this.save();
        }
    );

    _getset_(0, _proto_, "isMuteBg",
        function(){
            return this._isMuteBg;
        },
        function(value){
            this._isMuteBg = value;
            Laya.SoundManager.musicMuted = value;
            this.save();
        }
    );

    _getset_(0, _proto_, "isMuteEffect",
        function(){
            return this._isMuteEffect;
        },
        function(value){
            this._isMuteEffect = value;
            Laya.SoundManager.soundMuted = value;
            this.save();
        }
    );

    _getset_(0, _proto_, "isMute",
        function(){
            return this._isMute;
        },
        function(value){
            this._isMute = value;
            Laya.SoundManager.muted = value;
            this.save();
        }
    );

    return AudioManager;
}());