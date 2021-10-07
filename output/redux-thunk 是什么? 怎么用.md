---
title: redux-thunk 是什么? 怎么用
date: 2021-09-27 00:38:01
categories: 
 - react
 - 前端
tags: 
 - react
 - redux-thunk
 - redux
---

## 前言
使用 `Redux` 的很多的项目都会用到`redux-thunk`，但这个库到底是用来干嘛的?  
没读过源码的可能不知道, 这个库的源码也非常少一共11行!
 
 
 ### redux-thunk 的作用
 很简单 `redux-thunk` 本质就是一个redux中间件 , redux-thunk封装了 `dispatch`这个函数,这样redux **可以让我们`dispatch`一个函数，而不只是普通的 `plain object`** , 这样我们就可以使用异步action了,为什么需要异步action呢?  因为每当 `dispatch(action)` 时，state 会被立即更新。但是实际项目中可能 需求是过一段时间，才会得到结果再去更新state
 
### 什么是chunk

**`thunk`是一个包装表达式以延迟其计算的函数**

```javascript
//计算1 + 2是立即的
// x === 3
let x = 1 + 2;

// 1 + 2 的计算被延迟
// foo可以稍后调用来执行计算
// foo 就是一个thunk
let foo = () => 1 + 2;
```



 ### 启用redux-thunk
 
`redux-thunk`是一个redux中间件, 所以需要配合`redux`中的`applyMiddleware()`来使用
```JavaScript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/index';
 
// 注意:这个API需要reudx @>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
```

简单方便 这样就启用redux-thunk了
 
 ### 源码分析以及使用场景
 
 我们先看看`redux-thunk`的源码,  目前最新版为`Version 2.3.0`  我们来分析一下源码做了什么事情
 
 ```JavaScript
 function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;

 ```
 
 源码就这么几行 本质就是  
>store.dispatch接收到一个一个action
先判断这个action类型是不是function 如果是函数就执行这个函数并且传入`dispatch`, `getState`, `extraArgument` 这三个参数
如果不是函数 那就按照原本逻辑执行   
next 本质就是原本的dispatch 比如 `const next = store.dispatch` 

 为什么不能直接传一个function给dispatch呢 , 因为 dispatch收到的action会传给`reducer`,但是`redux`对`reducer`的规定是
 **Reducer应该是个[纯函数](#纯函数)，即只要传入相同的参数，每次都应返回相同的结果。所以 reducer 接收到的 action 必须是一个 plain object 类型不要把和处理数据无关的代码放在Reducer里**

但是我们现在有个异步请求需求 **在一个异步请求一个列表后 页面展示loading状态 请求结束后取消loading 并把列表数据更新state中** 

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/index';
 
// 注意:这个API需要reudx @>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// 定义一个Action Creator  接收payload参数 payload包含 isLoading 和 listData
function setList (  payload ) {
	// 返回一个action
  return {
    type:'SET_LIST'
    payload
  }
}

// 定义一个fetch请求,获取list数据
function getList ( ) {
	retrun fetch( 'https://www.haoolee.com/article/list' )
}

// 定义一个异步的Action Creator 
function setListAsync ( ) {
	return ( dispatch ) => {
		// 请求开始 设置isLoading为true 页面展示loading状态
		dispatch(setList({isLoading: true})) // setList返回一个Object的action
		getList().then(({list})=>{
			// 请求成功了 设置isLoading为false 页面取消loading状态  并展示list数据
			dispatch(setList({isLoading: false, list}))
		})
	}
}

store.dispatch(setListAsync()).then(() => {
  console.log('Done!');
})
```

这样看起来好像很麻烦? 我为什么不直接调用  
` store.dispatch( setList({isLoading: true}) )`   
然后在`getList.then(( {list} )=> store.dispatch(setList( {isLoading: true,list} )))`   
这样子写呢????

确实 这样写完全可以. 

### 所以?redux-thunk到底解决了什么问题?????
它可以让我们一次性发起多个 action 而不用 多次dispatch,并且既然它使得dispatch可以接收函数，而且并不要求像 reducer 一样是纯函数，那么我们可以在其中做任意想做的事情

如果你不确定你是否需要它，你可能不需要。没必要强行用

 
 ### 纯函数
 
 纯函数就是 
 只要是同样的输入，必定得到同样的输出。纯函数是函数式编程的概念，必须遵守以下一些约束。
 
 * 不得改写参数
* 不能调用系统 I/O 的API
* 不能调用Date.now()或者Math.random()等不纯的方法，因为每次会得到不一样的结果
* 不能引用外部变量

以上就是我对redux-thunk的理解 如有不对 望请指正~~
 
 