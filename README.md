# view-scroller ![GitHub package.json version](https://img.shields.io/github/package-json/v/chaosst/view-scroller) [![Build Status](https://travis-ci.org/chaosst/view-scroller.svg?branch=master)](https://travis-ci.org/chaosst/view-scroller) 

[view-scroller](https://github.com/chaosst/view-scroller) 是一款基于typeScript+snabbdom编写的滚动插件，可实现自定义滚动条样式，支持滚动顶部、底部、左边、右边事件，可实现无限滚动，上拉自动加载下一页等场景。兼容typeScript、vue2.0、vue3.0、react、angularJs等前端项目，兼容热重载开发。
- 下一个版本会兼容移动端，实现上拉刷新等功能。

#### 开发初衷

作为一个前端开发人员，开发的时候可能会遇到基于不同技术盏的项目，这种项目能共用的插件非常少，比如老旧的js插件用到vue项目可能会出现不兼容热重载的问题，又比如组件只兼容web端，在移动端黎表现力差这种问题，为了解决这些问题，我试着开发能兼容多种项目、多种客户端的插件。

## Browser compatibility

| browser | IE | Firefox | Chrome | Edge | Opera | safari |
| ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| version | 10 | 69 | 64 | 79 | 51 | 13.1 |


## Demo
滚动插件demo：[https://chaosst.gitee.io/view-scroller/src/examples/index](https://chaosst.gitee.io/view-scroller/src/examples/index)

## How to start the example
拉取github项目到本地后
```bash
npm run start
```
http://localhost:3000/src/examples/index 查看例子

## How to use

### Node（以Vue2.0为例）
兼容vue2.0、vue3.0、typeScript项目

#### Install
```bash
npm i view-scroller -S
```

#### Example
```html
<!-- demo.vue -->
<template>
    <div class="page">
        <el-form ref="form">
            ...
        </el-form>
    </div>
</template>
```
```js
/* demo.vue */
import { viewScroller } from 'view-scroller'
import 'view-scroller/dist/index.css'

export default{
    name:'demo',
    data(){
        return {
            scroller:null
        }
    },
    methods:{
      initScroller(){
        this.scroller = viewScroller.init(this.$refs.form,{
            alwayShow:true,
            class:'myscroller',
            width:500,
            height:500,
            theme:'light',    
            /* 滚动事件，定义事件触发的四个方向距离 */
            limit:{
              top:10,
              bottom:10,
              left:10,
              right:10
            },
            /* 滚动条样式配置 */
            scrollBar:{
                size:10,
                right:0,
                bottom:0,
                minLength:40,
                spacing:14
            },
            on:{
                /* 可以监听滚动事件 */
                scroll:(e)=>{
                },
                scrollTop:(e)=>{
                    console.log('触发顶部事件')
                    e.done()
                }
            }
        })
      }  
    },
    mounted(){
        //初始化滚动条
        this.initScroller()
        /* 滚动方法 */
        this.scroller.scrollTo({x:0,y:100}, 500)
    }
}
```

### Browser
IE最低兼容到IE10，兼容各种主流浏览器

#### Install
拉取github项目根目录下dist/index.global.js，dist/index.css到项目中
```html
<!-- 全局引入 -->
<script src="./dist/index.global.js"></script>
<link href="./dist/index.css" rel="stylesheet" type="text/css" />
```
#### Example
```html
<script>
        window.onload = function(){
            var el = document.getElementsByClassName('content')[0]
			//初始化滚动条
            var scroller = window.viewScroller.init(el,{
                alwayShow:true,
				class:'myscroller',
				width:500,
				height:500,
				theme:'light',    
				/* 滚动事件，定义事件触发的四个方向距离 */
				limit:{
				  top:10,
				  bottom:10,
				  left:10,
				  right:10
				},
				/* 滚动条样式配置 */
				scrollBar:{
					size:10,
					right:0,
					bottom:0,
					minLength:40,
					spacing:14
				},
				on:{
					/* 可以监听滚动事件 */
					scroll:function(e){
					},
					scrollTop:function(e){
                        console.log('触发顶部事件')
                        e.done()
					}
				}
            })
			/* 滚动方法 */
			scroller.scrollTo({x:0,y:100}, 500)
		}
</script>
...
<body>
	<div class="page">
        <div class="content">
		...
		</div>
	</div>
</body>
```


## API

#### viewScroller 初始化方法:

- `init(el:HTMLElement, options?:ScorllBarOptions)` 
- 对节点el进行滚动条初始化，选项options为非必填

#### viewScroller 初始化属性ScorllBarOptions:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| mobile | 滚动插件是否设置为移动端模式，滚动触发事件会变成适配移动端的touch事件，alwayShow为false时的显示规则会变成滚动时出现，滚动完成后2秒消失 | 否 | boolean | false |
| width | 滚动插件外层容器的宽度，单位px，支持string设置其他单位 | 否 | string number | auto |
| height | 滚动插件外层容器的高度，单位px，支持string设置其他单位 | 否 | string number | auto |
| alwayShow | 滚动插件的滚动条是否一直可见 | 否 | boolean | false |
| class | 滚动插件外层容器的样式类名 | 否 | string |  |
| theme | 滚动插件的主题设置（dark 深色， light 浅色， dark-reverse 深色反转， light-reverse 浅色反转） | 否 | string | dark |
| limit | 配合滚动插件的scrollTop，scrollBottom，scrollLeft，scrollRight事件使用 | 否 | object |  |
| scrollBar | 滚动插件的样式设置 | 否 | object |  |
| on | 滚动插件的绑定事件集合，可在初始化时进行事件绑定 | 否 | object |  |

#### limit 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| top | scrollTop事件触发距离，向顶部滚动时，当离顶部距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 10 |
| bottom | scrollBottom事件触发距离，向底部滚动时，当离底部距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 60 |
| left | scrollLeft事件触发距离，向左边滚动时，当离左边距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 10 |
| right | scrollRight事件触发距离，向右边滚动时，当离右边距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 60 |

#### scrollBar 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| size | 滚动条的粗细（垂直方向的宽度或水平方向的高度），单位px，支持string设置其他单位 | 否 | number string | 6 |
| right | 垂直方向滚动条离容器最右方的距离，单位px，支持string设置其他单位 | 否 | number string | 4 |
| bottom | 水平方向滚动条离容器最底部的距离，单位px，支持string设置其他单位 | 否 | number string | 4 |
| radius | 滚动条的圆角设置，单位px | 否 | number string | 4 |
| minLength | 当容器滚动内容足够多的时候，可以设置滚动条最小的长度来避免滚动条会无限接近一个点，单位px，不支持string设置其他单位 | 否 | number | 20 |
| spacing | 滚动容器预留垂直方向或水平方向滚动条的间距空间，默认0，为0时嵌套滚动插件时的滚动条有可能出现多层重合，可以设置大于0的距离来解决这个问题，单位px，支持string设置其他单位 | 否 | number,string | 0 |

#### on 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| scroll | 滚动条的滚动事件，当容器内容滚动时触发 | 否 | function |  |
| scrollTop | 滚动容器滚动到顶部距离limit.top时触发，参数请查看下方事件 | 否 | function |  |
| scrollBottom | 滚动容器滚动到底部距离limit.bottom时触发，参数请查看下方事件 | 否 | function |  |
| scrollLeft | 滚动容器滚动到左边距离limit.left时触发，参数请查看下方事件 | 否 | function |  |
| scrollRight | 滚动容器滚动到右边距离limit.right时触发，参数请查看下方事件 | 否 | function |  |

### viewScroller init()初始化后的实例方法:

- `scrollXTo(value:number, duration?:number)` 
- 容器水平方向滚到到左边距离为value的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `scrollYTo(value:number, duration?:number)` 
- 容器垂直方向滚到到左边距离为value的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `scrollTo({x,y}:ScrollToJSON, duration?:number)` 
- 容器水平方向滚到到左边距离为x,垂直方向滚到到左边距离为y的位置，duration非必填，为滚动动画时间（单位：毫秒）

### viewScroller init()初始化后的事件:

- `onScroll(value:number, duration?:number)` 
- 同options.on.scroll，滚动容器滚动事件，当容器内容滚动时触发
- `onScrollTop(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollTop，滚动容器滚动到顶部距离limit.top时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollBottom(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollBottom，滚动容器滚动到底部距离limit.bottom时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollLeft(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollLeft，滚动容器滚动到左边距离limit.left时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollRight(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollRight，滚动容器滚动到右边距离limit.right时触发，完成后需要调用ScrollerEv.done()修改状态

#### ScrollerEv可读属性
| 属性 | 描述 |
|-----|-----|
| width | 滚动容器的内容区域width+左右padding+左右border |
| height | 滚动容器的内容区域height+上下padding+上下border |
| offsetTop | 滚动容器到定位父节点的top方向的距离 |
| offsetLeft | 滚动容器到定位父节点的left方向的距离 |
| scrollWidth | 滚动容器可滚动的垂直高度 |
| scrollHeight | 滚动容器可滚动的水平宽度 |
| scrollTop | 滚动容器垂直方向滚动距离 |
| scrollLeft | 滚动容器水平方向滚动距离 |
| clientWidth | 滚动容器的内容区域width+左右padding（可视区域width的大小） |
| clientHeight | 滚动容器的内容区域height+上下padding（可视区域height的大小） |
| clientTop | 滚动容器上边框 |
| clientLeft | 滚动容器左边框 |
| target | 滚动容器html对象 |
| done | 事件完成的回调方法，修改滚动事件（scrollTop,scrollBottom,scrollLeft,scrollRight）的状态 |

## 更新记录

#### v1.2.0 更新
- 1、适配移动端的滚动条拖动
- 2、多层嵌套滚动条时，处理每层的滚动条层级问题，以保证里层的滚动条能被抓取到
- 3、部分参数添加字符串配置，可以通过字符串实现配置rem，em等css单位兼容移动端布局