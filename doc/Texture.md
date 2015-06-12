#Texture
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [resizeType](#resizeType) - Field of Texture
* [isLoaded](#isLoaded) - Field of Texture
* [img](#img) - Field of Texture

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [zoomOut](#zoomOut) - Const of Texture
* [zoomIn](#zoomIn) - Const of Texture
* [specularNormal](#specularNormal) - Const of Texture
* [specular](#specular) - Const of Texture
* [normal](#normal) - Const of Texture
* [load](#load) - Const of Texture
* [diffuseWrap](#diffuseWrap) - Const of Texture
* [diffuse](#diffuse) - Const of Texture
* [crop](#crop) - Const of Texture
* [addSpace](#addSpace) - Const of Texture

[top](#)

<a name="constructor"></a>
##Constructor

**description**

Constructor of Texture

**param**



**exception**

none

**sample**

```javascript
//none
```

[top](#)

<a name="resizeType"></a>
###resizeType

_field_


**description**

Field of Texture

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

Field of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
//none
```

[top](#)

<a name="img"></a>
###img

_field_


**description**

Field of Texture

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

none

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

<a name="zoomOut"></a>
###zoomOut

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

zoomOut

**sample**

```javascript
//none
```

[top](#)

<a name="zoomIn"></a>
###zoomIn

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

zoomIn

**sample**

```javascript
//none
```

[top](#)

<a name="specularNormal"></a>
###specularNormal

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

specularNormal

**sample**

```javascript
//none
```

[top](#)

<a name="specular"></a>
###specular

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

specular

**sample**

```javascript
//none
```

[top](#)

<a name="normal"></a>
###normal

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

normal

**sample**

```javascript
//none
```

[top](#)

<a name="load"></a>
###load

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

load

**sample**

```javascript
//none
```

[top](#)

<a name="diffuseWrap"></a>
###diffuseWrap

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

diffuseWrap

**sample**

```javascript
//none
```

[top](#)

<a name="diffuse"></a>
###diffuse

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

diffuse

**sample**

```javascript
//none
```

[top](#)

<a name="crop"></a>
###crop

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

crop

**sample**

```javascript
//none
```

[top](#)

<a name="addSpace"></a>
###addSpace

_const_


**description**

Const of Texture

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

addSpace

**sample**

```javascript
//none
```

[top](#)
