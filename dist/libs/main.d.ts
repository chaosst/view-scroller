import { EventBus } from './bus';
/**
 * 公共方法集合
 */
export declare class Public {
    SCROLL_MINLENGTH: number;
    /**
     * 以像素为单位的最小阈值距离的最大值
     */
    REFRESH_MAX_DRAG_DISTANCE: number;
    /**
     * 刷新下拉最大的可拖动像素值
     */
    REFRESH_MAX_DISTANCE: number;
    themeSet(theme: string): string;
    isOpera: boolean;
    isIE: true | RegExpMatchArray | null;
    isEdge: boolean;
    isFF: boolean;
    isSafari: boolean;
    isChrome: boolean;
    getRealPx(val?: number | string): string;
    EVENTS: any;
    MOBILE_EVENTS: any;
    state: Record<string, any>;
}
export declare const mPublic: Public;
export declare class Scroller {
    #private;
    version: string;
    bus: EventBus;
    constructor();
    getPublic(): Public;
}
