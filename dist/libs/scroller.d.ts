import { Scroller } from './main';
import { ScorllBarOptionsRequired, ScrollToJSON } from '../index';
declare global {
    interface Window {
        ResizeObserver: any;
    }
}
/**
 * 滚动插件的实现类
 */
export default class ScrollerBar extends Scroller {
    private onceEvents;
    private startPos;
    private options;
    private isDraging;
    private mouseupEv;
    private mousemoveEv;
    private patch;
    private selector;
    private initDiv;
    private mainEv;
    constructor();
    /**
     * 监听滚动方法
     * @param callback 滚动回调
     */
    onScroll(callback: Function): void;
    /**
     * 监听滚动到底部回调
     * @param callback 回调
     */
    onScrollBottom(callback: Function): void;
    /**
     * 监听滚动到顶部回调
     * @param callback 回调
     */
    onScrollTop(callback: Function): void;
    /**
     * 监听滚动到最左回调
     * @param callback 回调
     */
    onScrollLeft(callback: Function): void;
    /**
     * 监听滚动到最右回调
     * @param callback 回调
     */
    onScrollRight(callback: Function): void;
    scrollXTo(value: number, duration?: number): void;
    scrollYTo(value: number, duration?: number): void;
    scrollTo({ x, y }: ScrollToJSON, duration?: number): void;
    /**
     * 初始化滚动条拖动的全局事件
     */
    private dragInit;
    /**
     * 初始化滚动条
     * @param el 需要初始化滚动条的html元素
     * @param options 初始化滚动条的参数
     */
    scrollerInit(el: HTMLElement, options: ScorllBarOptionsRequired): any;
    private thumbResizeHor;
    private thumbResizeVer;
    private getScrollClass;
    private createVnode;
    /**
     * 容器大小发生变化时，更新滚动条位置和大小
     */
    update(): void;
    /**
     * 滚动条初始化时的参数处理函数
     * @param options 初始化滚动条的参数
     */
    private optionsInit;
}
