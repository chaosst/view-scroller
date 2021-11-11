import { Scroller } from './main';
import { ScorllBarOptionsRequired, ScrollToJSON } from '../index';
declare class ScrollerEv {
    width: number;
    height: number;
    offsetTop: number;
    offsetLeft: number;
    scrollWidth: number;
    scrollHeight: number;
    scrollTop: number;
    scrollLeft: number;
    clientWidth: number;
    clientHeight: number;
    clientTop: number;
    clientLeft: number;
    target: any;
}
/**
 * 滚动插件的实现类
 */
export default class ScrollerBar extends Scroller {
    #private;
    private options;
    /**
     * 滚动插件外层Dom对象
     */
    target: Element | null;
    /**
     * 滚动插件初始化的容器Dom对象
     */
    currentTarget: Element | null;
    cssSelector: string | null;
    state: number;
    constructor();
    private getEvent;
    /**
     * 返回滚动插件的当前滚动事件对象
     * @returns
     */
    getScrollerEvent(): ScrollerEv;
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
    /**
     * 监听下拉刷新方法
     * @param callback 滚动回调
     */
    onRefresh(callback: Function): void;
    scrollXTo(value: number, duration?: number): void;
    scrollYTo(value: number, duration?: number): void;
    scrollTo({ x, y }: ScrollToJSON, duration?: number): void;
    /**
     * 初始化滚动条拖动的全局事件
     */
    private dragInit;
    /**
     * 初始化滚动条
     * @param el 需要初始化滚动条的html元素或css选择器
     * @param options 初始化滚动条的参数
     */
    scrollerInit(el: Node | string, options: ScorllBarOptionsRequired): any;
    private getNested;
    private thumbResizeHor;
    private thumbResizeVer;
    private getScrollClass;
    private appendNodeList;
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
    destroy(): void;
    getState(): number;
}
export {};
