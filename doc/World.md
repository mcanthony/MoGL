#World
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**method**

* [stop](#stop) - Method of World
* [start](#start) - Method of World
* [setAutoSize](#setAutoSize) - Method of World
* [render](#render) - Method of World
* [removeScene](#removeScene) - Method of World
* [getScene](#getScene) - Method of World
* [getRenderer](#getRenderer) - Method of World
* [addScene](#addScene) - Method of World

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [renderBefore](#renderBefore) - Const of World
* [renderAfter](#renderAfter) - Const of World

[top](#)

<a name="constructor"></a>
##Constructor

**description**

Constructor of World

**param**

id

**exception**

0,1,2

**sample**

```javascript
//none
```

[top](#)

<a name="stop"></a>
###stop()

_method_


**description**

Method of World

**param**


**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="start"></a>
###start()

_method_


**description**

Method of World

**param**


**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="setAutoSize"></a>
###setAutoSize(isAutoSize)

_method_


**description**

Method of World

**param**

1. isAutoSize

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="render"></a>
###render(currentTime)

_method_


**description**

Method of World

**param**

1. currentTime

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="removeScene"></a>
###removeScene(sceneID)

_method_


**description**

Method of World

**param**

1. sceneID

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="getScene"></a>
###getScene(sceneID)

_method_


**description**

Method of World

**param**

1. sceneID

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="getRenderer"></a>
###getRenderer(isRequestAnimationFrame)

_method_


**description**

Method of World

**param**

1. isRequestAnimationFrame

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="addScene"></a>
###addScene(scene)

_method_


**description**

Method of World

**param**

1. scene

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="getMD"></a>
###getMD()

_static_


**description**

해당 클래스를 마크다운 형식으로 문서화하여 출력함

**param**


**exception**

none

**return**

string - 클래스에 대한 문서 마크다운

**sample**

```javascript
//none
```

[top](#)

<a name="getInstance"></a>
###getInstance(uuid:string)

_static_


**description**

uuid 또는 id를 기반으로 인스턴스를 얻어냄

**param**

1. uuid:string

**exception**

undefined.getInstance:u

**return**

Object - 해당되는 인스턴스

**sample**

```javascript
//none
```

[top](#)

<a name="extend"></a>
###extend(className:string, constructor:function)

_static_


**description**

이 클래스를 상속하는 자식클래스를 만들 수 있는 정의자(Defineder)를 얻음

**Defineder class의 메소드**

* 각 메서드는 체이닝됨
* Matrix = MoGL.extend('Matrix', function(){..}).static(..).field(..).build(); 형태로 사용
* field('x',{value:30}) - 속성을 정의함
* method('rotate',{value:function(){}}) - 메서드를 정의함
* constant('normalX',{value:'normalX'}) - 상수를 정의함
* event('updated',{value:'updated'}) - 이벤트를 정의함
* static('toString',{value:function(){}}) - 정적메서드를 정의함
* build() - 입력된 결과를 종합하여 클래스를 생성함

**param**

1. className:string
2. constructor:function

**exception**

none

**return**

Defineder - 클래스를 정의할 수 있는 생성전용객체

**sample**

```javascript
//none
```

[top](#)

<a name="error"></a>
###error(method:string, id:int)

_static_


**description**

정적함수에서 표준화된 예외를 처리함(정적함수 내부에서 사용)

**param**

1. method:string
2. id:int

**exception**

none

**return**

none

**sample**

```javascript
//none
```

[top](#)

<a name="count"></a>
###count()

_static_


**description**

이 클래스로 부터 만들어져 활성화된 인스턴스의 수

**param**


**exception**

none

**return**

int - 활성화된 인스턴스의 수

**sample**

```javascript
//none
```

[top](#)

<a name="renderBefore"></a>
###renderBefore

_const_


**description**

Const of World

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

renderBefore

**sample**

```javascript
//none
```

[top](#)

<a name="renderAfter"></a>
###renderAfter

_const_


**description**

Const of World

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

renderAfter

**sample**

```javascript
//none
```

[top](#)
