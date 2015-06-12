#Material
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [wireFrameColor](#wireFrameColor) - Field of Material
* [wireFrame](#wireFrame) - Field of Material
* [shading](#shading) - Field of Material
* [lambert](#lambert) - Field of Material
* [isLoaded](#isLoaded) - Field of Material
* [diffuse](#diffuse) - Field of Material
* [count](#count) - Field of Material
* [color](#color) - Field of Material

**method**

* [removeTexture](#removeTexture) - Method of Material
* [addTexture](#addTexture) - Method of Material

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**event**

* [changed](#changed) - Event of Material

[top](#)

<a name="constructor"></a>
##Constructor

**description**

Constructor of Material

**param**



**exception**

none

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrameColor"></a>
###wireFrameColor

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrame"></a>
###wireFrame

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="shading"></a>
###shading

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="lambert"></a>
###lambert

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="isLoaded"></a>
###isLoaded

_field_


**description**

Field of Material

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="diffuse"></a>
###diffuse

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="count"></a>
###count

_field_


**description**

Field of Material

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

count

**sample**

```javascript
//none
```

[top](#)

<a name="color"></a>
###color

_field_


**description**

Field of Material

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="removeTexture"></a>
###removeTexture(type, texture)

_method_


**description**

Method of Material

**param**

1. type
2. texture

**exception**

none

**return**

?

**sample**

```javascript
//none
```

[top](#)

<a name="addTexture"></a>
###addTexture(type, texture/*, index, blendMode*/)

_method_


**description**

Method of Material

**param**

1. type
2. texture/*
3. index
4. blendMode*/

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

<a name="changed"></a>
###changed

_event_


**description**

Event of Material

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

changed

**sample**

```javascript
//none
```

[top](#)
