import { EventBus } from './bus';
/**
 * 公共方法集合
 */
declare class Public {
    SCROLL_MINLENGTH: number;
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
}
export declare const mPublic: Public;
export declare class Scroller {
    public: Public;
    bus: EventBus;
    constructor();
}
export {};
