#Shader
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [code](#code) - 쉐이더 구성정보 코드(JS)를 반환

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [wireFrameVertexShader](#wireFrameVertexShader) - 와이어프레임 버텍스 쉐이더
* [wireFrameFragmentShader](#wireFrameFragmentShader) - 와이어프레임 프레그먼트 쉐이더
* [toonVertexShaderPhong](#toonVertexShaderPhong) - 툰 퐁 버텍스 쉐이더
* [toonFragmentShaderPhong](#toonFragmentShaderPhong) - 툰 퐁 프레그먼트 쉐이더
* [postBaseVertexShader](#postBaseVertexShader) - 후처리 베이스 버텍스 쉐이더
* [postBaseFragmentShader](#postBaseFragmentShader) - 후처리 베이스 프레그먼트 쉐이더
* [colorVertexShaderPhong](#colorVertexShaderPhong) - 컬러 퐁 버텍스 쉐이더
* [colorVertexShaderGouraud](#colorVertexShaderGouraud) - 컬러 고라우드 버텍스 쉐이더
* [colorVertexShader](#colorVertexShader) - 컬러 버텍스 쉐이더
* [colorFragmentShaderPhong](#colorFragmentShaderPhong) - 컬러 퐁 프레그먼트 쉐이더
* [colorFragmentShaderGouraud](#colorFragmentShaderGouraud) - 컬러 고라우드 프레그먼트 쉐이더
* [colorFragmentShader](#colorFragmentShader) - 컬러 프레그먼트 쉐이더
* [bitmapVertexShaderPhong](#bitmapVertexShaderPhong) - 비트맵 퐁 버텍스 쉐이더
* [bitmapVertexShaderGouraud](#bitmapVertexShaderGouraud) - 비트맵 고라우드 버텍스 쉐이더
* [bitmapVertexShaderBlinn](#bitmapVertexShaderBlinn) - 비트맵 블린 버텍스 쉐이더
* [bitmapVertexShader](#bitmapVertexShader) - 비트맵 버텍스 쉐이더
* [bitmapFragmentShaderPhong](#bitmapFragmentShaderPhong) - 비트맵 퐁 프레그먼트 쉐이더
* [bitmapFragmentShaderGouraud](#bitmapFragmentShaderGouraud) - 비트맵 고라우드 프레그먼트 쉐이더
* [bitmapFragmentShaderBlinn](#bitmapFragmentShaderBlinn) - 비트맵 블린 프레그먼트 쉐이더
* [bitmapFragmentShader](#bitmapFragmentShader) - 비트맵 프레그먼트 쉐이더

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 쉐이더 클래스. 버텍스쉐이더와 프레그먼트 쉐이더를 생성.

**param**

- 1. v:Object - 오브젝트 형태로 쉐이더 정보를 입력
2. 버텍스쉐이더 - { id:'', attributes:[], uniforms:[], varyings[], function:[], main[]
3. 프레그먼트쉐이더 - { id:'', uniforms:[], varyings[], function:[], main[]

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="code"></a>
###code

_field_


**description**

- 쉐이더 구성정보 코드(JS)를 반환

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="getMD"></a>
###getMD()

_static_


**description**

- 해당 클래스를 마크다운 형식으로 문서화하여 출력함

**param**


**exception**

- none

**return**

- string - 클래스에 대한 문서 마크다운

**sample**

```javascript
//none
```

[top](#)

<a name="getInstance"></a>
###getInstance(uuid:string)

_static_


**description**

- uuid 또는 id를 기반으로 인스턴스를 얻어냄

**param**

1. uuid:string - 얻고 싶은 인스턴스의 uuid 또는 id

**exception**

- none

**return**

- Object - 해당되는 인스턴스

**sample**

```javascript
//none
```

[top](#)

<a name="extend"></a>
###extend(className:string, constructor:function)

_static_


**description**

- 이 클래스를 상속하는 자식클래스를 만들 수 있는 정의자(Defineder)를 얻음
- 
**Defineder class의 메소드**

- * 각 메서드는 체이닝됨
- * Matrix = MoGL.extend('Matrix', function(){..}).static(..).field(..).build(); 형태로 사용
- * field('x',{value:30}) - 속성을 정의함
- * method('rotate',{value:function(){}}) - 메서드를 정의함
- * constant('normalX',{value:'normalX'}) - 상수를 정의함
- * event('updated',{value:'updated'}) - 이벤트를 정의함
- * static('toString',{value:function(){}}) - 정적메서드를 정의함
- * build() - 입력된 결과를 종합하여 클래스를 생성함

**param**

1. className:string - 자식클래스의 이름
2. constructor:function - 자식클래스의 생성자

**exception**

- none

**return**

- Defineder - 클래스를 정의할 수 있는 생성전용객체

**sample**

```javascript
//none
```

[top](#)

<a name="error"></a>
###error(method:string, id:int)

_static_


**description**

- 정적함수에서 표준화된 예외를 처리함(정적함수 내부에서 사용)

**param**

1. method:string - 예외가 발생한 함수명
2. id:int - 예외고유 id

**exception**

- none

**return**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="count"></a>
###count()

_static_


**description**

- 이 클래스로 부터 만들어져 활성화된 인스턴스의 수

**param**


**exception**

- none

**return**

- int - 활성화된 인스턴스의 수

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrameVertexShader"></a>
###wireFrameVertexShader

_const_


**description**

- 와이어프레임 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="wireFrameFragmentShader"></a>
###wireFrameFragmentShader

_const_


**description**

- 와이어프레임 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="toonVertexShaderPhong"></a>
###toonVertexShaderPhong

_const_


**description**

- 툰 퐁 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="toonFragmentShaderPhong"></a>
###toonFragmentShaderPhong

_const_


**description**

- 툰 퐁 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="postBaseVertexShader"></a>
###postBaseVertexShader

_const_


**description**

- 후처리 베이스 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="postBaseFragmentShader"></a>
###postBaseFragmentShader

_const_


**description**

- 후처리 베이스 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShaderPhong"></a>
###colorVertexShaderPhong

_const_


**description**

- 컬러 퐁 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShaderGouraud"></a>
###colorVertexShaderGouraud

_const_


**description**

- 컬러 고라우드 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorVertexShader"></a>
###colorVertexShader

_const_


**description**

- 컬러 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShaderPhong"></a>
###colorFragmentShaderPhong

_const_


**description**

- 컬러 퐁 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShaderGouraud"></a>
###colorFragmentShaderGouraud

_const_


**description**

- 컬러 고라우드 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="colorFragmentShader"></a>
###colorFragmentShader

_const_


**description**

- 컬러 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderPhong"></a>
###bitmapVertexShaderPhong

_const_


**description**

- 비트맵 퐁 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderGouraud"></a>
###bitmapVertexShaderGouraud

_const_


**description**

- 비트맵 고라우드 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShaderBlinn"></a>
###bitmapVertexShaderBlinn

_const_


**description**

- 비트맵 블린 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapVertexShader"></a>
###bitmapVertexShader

_const_


**description**

- 비트맵 버텍스 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderPhong"></a>
###bitmapFragmentShaderPhong

_const_


**description**

- 비트맵 퐁 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderGouraud"></a>
###bitmapFragmentShaderGouraud

_const_


**description**

- 비트맵 고라우드 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShaderBlinn"></a>
###bitmapFragmentShaderBlinn

_const_


**description**

- 비트맵 블린 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="bitmapFragmentShader"></a>
###bitmapFragmentShader

_const_


**description**

- 비트맵 프레그먼트 쉐이더

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)