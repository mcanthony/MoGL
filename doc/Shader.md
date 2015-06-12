#Shader
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [code](#code) - Field of Shader

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [colorVertexShaderPhong](#colorVertexShaderPhong) - Const of Shader
* [postBaseFragmentShader](#postBaseFragmentShader) - Const of Shader
* [wireFrameVertexShader](#wireFrameVertexShader) - Const of Shader
* [wireFrameFragmentShader](#wireFrameFragmentShader) - Const of Shader
* [postBaseVertexShader](#postBaseVertexShader) - Const of Shader
* [toonFragmentShaderPhong](#toonFragmentShaderPhong) - Const of Shader
* [toonVertexShaderPhong](#toonVertexShaderPhong) - Const of Shader
* [bitmapFragmentShader](#bitmapFragmentShader) - Const of Shader
* [colorVertexShader](#colorVertexShader) - Const of Shader
* [colorVertexShaderGouraud](#colorVertexShaderGouraud) - Const of Shader
* [colorFragmentShaderPhong](#colorFragmentShaderPhong) - Const of Shader
* [colorFragmentShaderGouraud](#colorFragmentShaderGouraud) - Const of Shader
* [colorFragmentShader](#colorFragmentShader) - Const of Shader
* [bitmapVertexShaderPhong](#bitmapVertexShaderPhong) - Const of Shader
* [bitmapVertexShaderGouraud](#bitmapVertexShaderGouraud) - Const of Shader
* [bitmapVertexShaderBlinn](#bitmapVertexShaderBlinn) - Const of Shader
* [bitmapVertexShader](#bitmapVertexShader) - Const of Shader
* [bitmapFragmentShaderPhong](#bitmapFragmentShaderPhong) - Const of Shader
* [bitmapFragmentShaderGouraud](#bitmapFragmentShaderGouraud) - Const of Shader
* [bitmapFragmentShaderBlinn](#bitmapFragmentShaderBlinn) - Const of Shader

[top](#)

<a name="constructor"></a>
##Constructor

**description**

Constructor of Shader

**param**

v

**exception**

none

**sample**

```javascript
//none
```

[top](#)

<a name="code"></a>
###code

_field_


**description**

Field of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

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

none

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

none

**exception**

none

**return**

int - 활성화된 인스턴스의 수

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShaderPhong"></a>
###colorVertexShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="postBaseFragmentShader"></a>
###postBaseFragmentShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrameVertexShader"></a>
###wireFrameVertexShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrameFragmentShader"></a>
###wireFrameFragmentShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="postBaseVertexShader"></a>
###postBaseVertexShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="toonFragmentShaderPhong"></a>
###toonFragmentShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="toonVertexShaderPhong"></a>
###toonVertexShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShader"></a>
###bitmapFragmentShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShader"></a>
###colorVertexShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShaderGouraud"></a>
###colorVertexShaderGouraud

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShaderPhong"></a>
###colorFragmentShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShaderGouraud"></a>
###colorFragmentShaderGouraud

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShader"></a>
###colorFragmentShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderPhong"></a>
###bitmapVertexShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderGouraud"></a>
###bitmapVertexShaderGouraud

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderBlinn"></a>
###bitmapVertexShaderBlinn

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShader"></a>
###bitmapVertexShader

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderPhong"></a>
###bitmapFragmentShaderPhong

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderGouraud"></a>
###bitmapFragmentShaderGouraud

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderBlinn"></a>
###bitmapFragmentShaderBlinn

_const_


**description**

Const of Shader

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
//none
```

[top](#)
