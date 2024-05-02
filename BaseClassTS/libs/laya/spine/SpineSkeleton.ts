import { ILaya } from "../../ILaya";
import { Sprite } from "../display/Sprite";
import { Event } from "../events/Event";
import { Matrix } from '../maths/Matrix';
import { SoundChannel } from "../media/SoundChannel";
import { SoundManager } from "../media/SoundManager";
import { Texture } from '../resource/Texture';
import { ClassUtils } from "../utils/ClassUtils";
import { Handler } from "../utils/Handler";
import { SpineSkeletonRenderer } from "./SpineSkeletonRenderer";
import { SpineTempletBase } from "./SpineTempletBase";
import TimeKeeper = spine.TimeKeeper;
import Skeleton = spine.Skeleton;
import AnimationState = spine.AnimationState;
import AnimationStateData = spine.AnimationStateData;

/**动画开始播放调度
 * @eventType Event.PLAYED
 * */
/*[Event(name = "played", type = "laya.events.Event.PLAYED", desc = "动画开始播放调度")]*/
/**动画停止播放调度
 * @eventType Event.STOPPED
 * */
/*[Event(name = "stopped", type = "laya.events.Event.STOPPED", desc = "动画停止播放调度")]*/
/**动画暂停播放调度
 * @eventType Event.PAUSED
 * */
/*[Event(name = "paused", type = "laya.events.Event.PAUSED", desc = "动画暂停播放调度")]*/
/**自定义事件。
 * @eventType Event.LABEL
 */
/*[Event(name = "label", type = "laya.events.Event.LABEL", desc = "自定义事件")]*/
/**
 * spine动画由<code>SpineTemplet</code>，<code>SpineSkeletonRender</code>，<code>SpineSkeleton</code>三部分组成。
 */
export class SpineSkeleton extends Sprite {
    static stopped: number = 0;
	static paused: number = 1;
	static playing: number = 2;

    private _templet: SpineTempletBase;
    private timeKeeper: TimeKeeper;
	private skeleton: Skeleton;
	private state: AnimationState;
	private stateData: AnimationStateData;
	private currentPlayTime: number = 0;
	private skeletonRenderer: SpineSkeletonRenderer;

	/**当前帧数 */
	private _frameIndex: number = -1;
	/**sk当前帧 todo: 可做sk事件抽离优化尝试 */
	private _skFrameIndex: number = 0;
	/**当前渲染帧数 */
	private _drawFrameIndex: number = -1;
	/**跑帧时间 */
	private _frameTime: number = 0;
	/**播放次数 */
	private _playTimes: number = null!;

    /** @internal */
    private _pause: boolean = true;
    /** @internal */
    private _currAniName: string = null;
    /** @internal 动画播放的起始时间位置*/
	private _playStart: number;
	/** @internal 动画播放的结束时间位置*/
    private _playEnd: number;
    /** @internal 动画的总时间*/
    private _duration: number;
    /** 播放速率*/
    private _playbackRate: number = 1.0;
    /** @internal */
	private _playAudio: boolean = true;
	/** @internal */
	private _soundChannelArr: any[] = [];
    // 播放轨道索引
    private trackIndex: number = 0;

	/**动画模式 0 默认模式 1 cache模式 */
	private _aniMode: number = 0;
	/**是否结束播放次数 */
	private _isEndPlayTimes: boolean = false;
	/**当前draw cmd */
	private _cmds: any[] = null!;
	/**单纹理名字 */
	private _textureName: string = '';

    /**
	 * 创建一个Skeleton对象
	 *
	 * @param templet	骨骼动画模板
	 * @param aniMode 0 默认模式 1 cache模式
	 */
    constructor(templet: SpineTempletBase = null, aniMode: number) {
		super();
		this._aniMode = aniMode;
        if (templet) this.init(templet);
	}

    init(templet: SpineTempletBase): void {
        let that = this;
        this._templet = templet;
        this._templet._addReference(1);
		// 单纹理名字
		for (const key in templet._textureDic) {
			if (key.indexOf('.png') !== -1 || key.indexOf('.jpg') !== -1 || key.indexOf('.webp') !== -1) {
				this._textureName = key;
				break;
			}
		}
        // 骨架，被执行或被计算的一个类，里面存放数据等信息
        this.skeleton = new Skeleton(this._templet.skeletonData);
        this.stateData = new AnimationStateData(this.skeleton.data);
		// 动画状态类
        this.state = new AnimationState(this.stateData);
        this.skeletonRenderer = new SpineSkeletonRenderer(false);
        this.timeKeeper = new TimeKeeper();
        this.skeletonRenderer.premultipliedAlpha = this._templet.spinePremultipliedAlpha;
        this.state.addListener({
            start: function(entry: any) {
                // console.log("started:", entry);
            },
            interrupt: function(entry: any) {
                // console.log("interrupt:", entry);
            },
            end: function(entry: any) {
                // console.log("end:", entry);
            },
            dispose: function(entry: any) {
                // console.log("dispose:", entry);
            },
            complete: function(entry: any) {
                // console.log("complete:", entry);
                if (entry.loop) { // 如果多次播放,发送complete事件
                    that.event(Event.COMPLETE);
                } else { // 如果只播放一次，就发送stop事件
                    that._currAniName = null;
                    that.event(Event.STOPPED);
                }
            },
            event: function(entry: any, event: any) {
                let eventData = {
                    audioValue: event.data.audioPath,
                    audioPath: event.data.audioPath,
                    floatValue: event.floatValue,
                    intValue: event.intValue,
                    name: event.data.name,
                    stringValue: event.stringValue,
                    time: event.time * 1000,
                    balance: event.balance,
                    volume: event.volume
                };
                // console.log("event:", entry, event);
                that.event(Event.LABEL, eventData);
                let _soundChannel: SoundChannel;
                if (that._playAudio && eventData.audioValue) {
                    _soundChannel = SoundManager.playSound(templet._textureDic.root + eventData.audioValue, 1, Handler.create(that, that._onAniSoundStoped), null,  (that.currentPlayTime * 1000 - eventData.time) / 1000);
                    SoundManager.playbackRate = that._playbackRate;
                    _soundChannel && that._soundChannelArr.push(_soundChannel);
                }
            },
        })
    }

    /**
	 * 播放动画
	 *
	 * @param	nameOrIndex	动画名字或者索引
	 * @param	loop		是否循环播放
	 * @param	force		false,如果要播的动画跟上一个相同就不生效,true,强制生效
	 * @param	start		起始时间
	 * @param	end			结束时间
     * @param	freshSkin	是否刷新皮肤数据
	 * @param	playAudio	是否播放音频
	 */
    play(nameOrIndex: any, loop: boolean, force: boolean = true, start: number = 0, end: number = 0, freshSkin: boolean = true, playAudio: boolean = true) {
		// 播放次数处理
		this._isEndPlayTimes = false;
		this._playTimes = null!;

        this._playAudio = playAudio;
        start /= 1000;
        end /= 1000;
        let animationName = nameOrIndex;
        if (start < 0 || end < 0)
			throw new Error("SpineSkeleton: start and end must large than zero.");
		if ((end !== 0) && (start > end))
            throw new Error("SpineSkeleton: start must less than end.");

        if (typeof animationName == "number") {
			animationName = this.getAniNameByIndex(nameOrIndex);
        }

        if (force || this._pause || this._currAniName != animationName) {
            this._currAniName = animationName;
            // 设置执行哪个动画
            this.state.setAnimation(this.trackIndex, animationName, loop);
            // 设置起始和结束时间
            let trackEntry =  this.state.getCurrent(this.trackIndex);
            trackEntry.animationStart = start;
            if (!!end && end < trackEntry.animationEnd)
                trackEntry.animationEnd = end;

            let animationDuration = trackEntry.animation.duration;
            this._duration = animationDuration;
            this._playStart = start;
            this._playEnd = end <= animationDuration ? end : animationDuration;

			// 切换动画数据记录初始化
			this._frameIndex = this._drawFrameIndex = -1;
			this._frameTime = this._skFrameIndex = 0;

            if (this._pause) {
                this._pause = false;
                this.timer.frameLoop(1, this, this._update, null, true);
            }
            this._update();
        }
    }

	//#region
	/**
	 * 获取当前帧下标
	 * @returns
	 */
	public getFrameIndex(): number {
		return this._frameIndex;
	}

	/**
	 * 获取当前渲染cmd
	 * @returns
	 */
	public getCmds(): any[] {
		let cmds = this._cmds;
		if (!cmds) {
			cmds = this.templet.getFrameCmd(this._currAniName, this._drawFrameIndex);
		}
		return cmds;
	}

	/**
	 * 获取单纹理
	 * @returns
	 */
	public getDicTexture(): Texture {
		const texDic = this['customTextureDic'] || this._templet._textureDic;
		// 所有spine工程都使用单纹理
		const ctexture: Texture = texDic[this._textureName];
		return ctexture;
	}

	/**
	 * 播放次数
	 * @param nameOrIndex
	 * @param times -1 循环播放 大于0时播放次数
	 */
	public playTimes(nameOrIndex: string | number, times: number): void {
		if (!times) {
			return;
		}

		this._isEndPlayTimes = false;
		this.play(nameOrIndex, true);
		if (times !== -1) {
			this._playTimes = times;
		}
	}

	private onPlayComplete(): void {
		const that = this;
		if (that._playTimes !== null && that._playTimes !== -1) {
			that._playTimes -= 1;
			if (that._playTimes <= 0) {
				that._isEndPlayTimes = true;
				that.stop();
				that.event(Event.END);
			}
		}
	}

	private updateFrame(dt: number): void {
		// 不可随意修改该dt会导致误差放大，帧渲染存在偏差
		const skFrameDt = 0.0333333;
		const trackEntry = this.state.getCurrent(this.trackIndex);
		const duration = trackEntry.animationEnd;

		this._frameTime += dt;
		if (this._frameTime > duration) {
			this._frameTime -= duration;
		}

		const curFrame = Math.round(this._frameTime / skFrameDt);
		const maxFrame = Math.round(duration / skFrameDt);

		if (this._frameIndex !== curFrame) {
			this._frameIndex = curFrame;

			let diffFrame = 0;
			if (this._skFrameIndex > curFrame) {
				diffFrame = maxFrame - this._skFrameIndex + curFrame;
			}
			else {
				diffFrame = curFrame - this._skFrameIndex;
			}

			this._skFrameIndex = curFrame;
			this.updateSk(diffFrame * skFrameDt);
		}
	}

	private updateSk(dt: number): void {
		let trackEntry =  this.state.getCurrent(this.trackIndex);
		this.state.update(dt);
		this.state.apply(this.skeleton);
		let animationLast = trackEntry.animationLast;
		this.currentPlayTime = Math.max(0, animationLast);
		if (!this.state || !this.skeleton) {
			return;
		}

		this.skeleton.updateWorldTransform();

		const cmds = this.templet.getFrameCmd(this._currAniName, this._frameIndex);
		if (!cmds) {
			const texDic = this['customTextureDic'] || this._templet._textureDic;
			this.skeletonRenderer.draw(this.skeleton, -1, -1, this, texDic, false);
			const skCmds = this.skeletonRenderer.getCmds();
			if (this._aniMode !== 1) {
				this._cmds = skCmds;
			}
			else {
				this.templet.setFrameCmd(this._currAniName, this._frameIndex, skCmds);
				this.skeletonRenderer.clear();
			}
		}
	}

	private _update():void {
		this.timeKeeper.update();
        this.updateFrame(this.timeKeeper.delta * this._playbackRate);
		// 渲染帧和当前帧相同则不做处理
		if (this._drawFrameIndex === this._frameIndex) {
			return;
		}
		// 当前渲染帧大于当前帧，则已经播放过一次了
		if (this._drawFrameIndex > this._frameIndex) {
			this.onPlayComplete();
			if (this._isEndPlayTimes) {
				return;
			}
		}
		// 渲染当前帧
		this.graphics.clear();
		this._drawFrameIndex = this._frameIndex;
		let cmds = this.getCmds();
		if (cmds) {
			const ctexture: Texture = this.getDicTexture();
			for (let i = 0, len = cmds.length; i < len; i++) {
				const cmd = cmds[i];
				this.graphics.drawTriangles(
					ctexture,
					0,
					0,
					cmd[0],
					cmd[1],
					cmd[2],
					Matrix.EMPTY,
					cmd[3] !== undefined ? cmd[3] : 1,
					null,
					cmd[4] !== undefined ? cmd[4] : 'normal',
					cmd[5] !== undefined ? cmd[5] : -1
				);
			}
		}
	}
	//#endregion

	// private _update():void {
	// 	this.timeKeeper.update();
    //     let delta = this.timeKeeper.delta * this._playbackRate;
    //     let trackEntry =  this.state.getCurrent(this.trackIndex);
    //     // 在游戏循环中，update被调用，这样AnimationState就可以跟踪时间
    //     this.state.update(delta);
    //     // 使用当前动画和事件设置骨架
    //     this.state.apply(this.skeleton);

    //     let animationLast = trackEntry.animationLast;
    //     this.currentPlayTime = Math.max(0, animationLast);

    //     // spine在state.apply中发送事件，开发者可能会在事件中进行destory等操作，导致无法继续执行
    //     if (!this.state || !this.skeleton) {
    //         return;
    //     }

	// 	// 计算骨骼的世界SRT(world SRT)
    //     this.skeleton.updateWorldTransform();
	// 	// add custom texture shader by yanmingjie
	// 	const texDic = this['customTextureDic'] || this._templet._textureDic;

	// 	const frameIndex = Math.ceil(this.currentPlayTime * 40);
	// 	if (this._frameIndex === frameIndex) {
	// 		return;
	// 	}

	// 	this.graphics.clear();
	// 	this._frameIndex = frameIndex;
	// 	const cmds = this.templet.getFrameCmd(this._currAniName, frameIndex);
	// 	if (cmds) {
	// 		for (let i = 0, len = cmds.length; i < len; i++) {
	// 			const cmd = cmds[i];
	// 			this.graphics.drawTriangles(texDic[cmd[0]], 0, 0, cmd[1], cmd[2], cmd[3], Matrix.EMPTY, cmd[4], cmd[5],cmd[6], cmd[7]);
	// 		}
	// 		return;
	// 	}

	// 	this.skeletonRenderer.draw(this.skeleton, -1, -1, this, texDic);
	// 	const skCmds = this.skeletonRenderer.getCmds();
	// 	this.templet.setFrameCmd(this._currAniName, frameIndex, skCmds);
	// 	this.skeletonRenderer.clear();
    // }

    /**
	 * 得到当前动画的数量
	 * @return 当前动画的数量
	 */
	getAnimNum(): number {
		return this._templet.skeletonData.animations.length;
	}

	/**
	 * 得到指定动画的名字
	 * @param	index	动画的索引
	 */
	getAniNameByIndex(index: number): string {
		return this._templet.getAniNameByIndex(index);
    }

    /**
     * 通过名字得到插槽的引用
     * @param slotName
     */
    getSlotByName(slotName: string) {
        return this.skeleton.findSlot(slotName)
    }

    /**
	 * 设置动画播放速率
	 * @param	value	1为标准速率
	 */
	playbackRate(value: number): void {
		this._playbackRate = value;
	}

	/**
	 * 通过名字显示一套皮肤
	 * @param	name	皮肤的名字
	 */
	showSkinByName(name: string): void {
		this.showSkinByIndex(this._templet.getSkinIndexByName(name));
	}

	/**
	 * 通过索引显示一套皮肤
	 * @param	skinIndex	皮肤索引
	 */
	showSkinByIndex(skinIndex: number): void {
        let newSkine = this.skeleton.data.skins[skinIndex];
        this.skeleton.setSkin(newSkine);
        this.skeleton.setSlotsToSetupPose();
    }

	/**
	 * 停止动画
	 */
	stop(): void {
		if (!this._pause) {
            this._pause = true;
            this._currAniName = null;
            this.timer.clear(this, this._update);
            this.state.update(-this.currentPlayTime);
            this.currentPlayTime = 0;
            this.event(Event.STOPPED);

            if (this._soundChannelArr.length > 0) { // 有正在播放的声音
				this._onAniSoundStoped(true);
			}
		}
	}

	/**
	 * 暂停动画的播放
	 */
	paused(): void {
		if (!this._pause) {
			this._pause = true;
            this.timer.clear(this, this._update);
            this.event(Event.PAUSED);
            if (this._soundChannelArr.length > 0) { // 有正在播放的声音
				let _soundChannel: SoundChannel;
				for (let len: number = this._soundChannelArr.length, i: number = 0; i < len; i++) {
					_soundChannel = this._soundChannelArr[i];
					if (!_soundChannel.isStopped) {
						_soundChannel.pause();
					}

				}
			}
		}
	}

	/**
	 * 恢复动画的播放
	 */
	resume(): void {
		if (this._pause) {
			this._pause = false;
            this.timer.frameLoop(1, this, this._update, null, true);
            if (this._soundChannelArr.length > 0) { // 有正在播放的声音
				let _soundChannel: SoundChannel;
				for (let len: number = this._soundChannelArr.length, i: number = 0; i < len; i++) {
					_soundChannel = this._soundChannelArr[i];
					if ((_soundChannel as any).audioBuffer) {
						_soundChannel.resume();
					}
				}
			}
		}
    }

    /**
	 * @internal
	 * 清掉播放完成的音频
	 * @param force 是否强制删掉所有的声音channel
	 */
	private _onAniSoundStoped(force: boolean): void {
		let _channel: SoundChannel;
		for (let len: number = this._soundChannelArr.length, i: number = 0; i < len; i++) {
			_channel = this._soundChannelArr[i];
			if (_channel.isStopped || force) {
				!_channel.isStopped && _channel.stop();
				this._soundChannelArr.splice(i, 1);
				// SoundManager.removeChannel(_channel); // TODO 是否需要? 去掉有什么好处? 是否还需要其他操作?
				len--; i--;
			}
		}
	}

    /**
     * 销毁当前动画
     * @override
     */
	destroy(destroyChild: boolean = true): void {
        super.destroy(destroyChild);
		this._cmds = null!;
		this._templet._removeReference(1);
        this._templet = null;
        this.timeKeeper = null;
        this.skeleton = null;
        this.state.clearListeners();
        this.state = null;
		this.skeletonRenderer && this.skeletonRenderer.clear();
        this.skeletonRenderer = null;
        this.timer.clear(this, this._update);
        if (this._soundChannelArr.length > 0) { // 有正在播放的声音
			this._onAniSoundStoped(true);
        }
	}

	/**
	 * 得到动画模板的引用
	 * @return templet
	 */
	get templet(): SpineTempletBase {
		return this._templet;
    }

    // ------------------------------------新增加的接口----------------------------------------------------
    /**
     * 添加一个动画
     * @param nameOrIndex   动画名字或者索引
     * @param loop          是否循环播放
     * @param delay         延迟调用，可以为负数
     */
    addAnimation(nameOrIndex: any, loop: boolean = false, delay: number = 0) {
        delay /= 1000;
        let animationName = nameOrIndex;
        if (typeof animationName == "number") {
            animationName = this.getAniNameByIndex(animationName);
        }
        this._currAniName = animationName;
        this.state.addAnimation(this.trackIndex, animationName, loop, delay);
    }

    /**
     * 设置当动画被改变时，存储混合(交叉淡出)的持续时间
     * @param fromNameOrIndex
     * @param toNameOrIndex
     * @param duration
     */
    setMix(fromNameOrIndex: any, toNameOrIndex: any, duration: number) {
        duration /= 1000;
        let fromName = fromNameOrIndex;
        if (typeof fromName == "number") {
            fromName = this.getAniNameByIndex(fromName);
        }
        let toName = toNameOrIndex;
        if (typeof toName == "number") {
            toName = this.getAniNameByIndex(toName);
        }
        this.stateData.setMix(fromName, toName, duration);
    }

    /**
     * 获取骨骼信息(spine.Bone)
     * 注意: 获取到的是spine运行时的骨骼信息(spine.Bone)，不适用引擎的方法
     * @param boneName
     */
    getBoneByName(boneName: string) {
        return this.skeleton.findBone(boneName);
    }

    /**
     * 获取Skeleton(spine.Skeleton)
     */
    getSkeleton() {
        return this.skeleton;
    }

    /**
     * 替换插槽皮肤
     * @param slotName
     * @param attachmentName
     */
    setSlotAttachment(slotName: string, attachmentName: string) {
        this.skeleton.setAttachment(slotName, attachmentName);
    }

    // ------------------------------------适配原player.xxx需要的接口----------------------------------------------------
    /**
	 * 设置当前播放位置
	 * @param	value 当前时间
	 */
	set currentTime(value: number) {
        if (!this._currAniName || !this._templet)
            return;

        value /= 1000;
        if (value < this._playStart || (!!this._playEnd && value > this._playEnd) || value > this._duration)
            throw new Error("AnimationPlayer: value must large than playStartTime,small than playEndTime.");

        this.state.update(value - this.currentPlayTime);
        this.currentPlayTime = value;
    }

    /**
	 * 获取当前播放状态
	 * @return	当前播放状态
	 */
	get playState(): number {
		if (!this._currAniName)
			return SpineSkeleton.stopped;
		if (this._pause)
			return SpineSkeleton.paused;
		return SpineSkeleton.playing;
	}

    // get aniDuration() {
    //     return this.state.getCurrent(0).animation.duration;
    // }
}

ILaya.regClass(SpineSkeleton);
ClassUtils.regClass("laya.layaspine.SpineSkeleton", SpineSkeleton);
ClassUtils.regClass("Laya.SpineSkeleton", SpineSkeleton);
