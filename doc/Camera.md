#Camera
* parent : [Matrix](Matrix.md) < [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [fogFar](#fogFar) - 안개효과만 남고 아무것도 보이지 않는...
* [projectionMatrix](#projectionMatrix) - 현재 프로젝션 매트릭스를 반환
* [visible](#visible) - Field of Camera
* [renderArea](#renderArea) - 카메라 렌더링 영역지정, 렌더링 영역...
* [mode](#mode) - 카메라모드 지정
* [fov](#fov) - FOV(Field of view) 시...
* [fogNear](#fogNear) - 안개효과가 시작되는 z축 거리
* [fogColor](#fogColor) - 안개 효과 컬러 지정
* [fog](#fog) - 안개효과 지정여부
* [clipPlaneNear](#clipPlaneNear) - 현재 절두체의 최소z값
* [clipPlaneFar](#clipPlaneFar) - 현재 절두체의 최대z값
* [backgroundColor](#backgroundColor) - 렌더링 배경화면 색상을 지정
* [antialias](#antialias) - 쉐이더 레벨의 안티알리어싱 적용여부

**method**

* [resetProjectionMatrix](#resetProjectionMatrix) - 현재 프로퍼티들을 기준으로 프로젝션...

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [resize](#resize) - Const of Camera
* [perspective](#perspective) - Const of Camera
* [othogonal](#othogonal) - Const of Camera

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 씬을 실제로 렌더링할 카메라 객체를 생성함

**param**

- none

**exception**

- none

**sample**

```javascript
var camera = new Camera()
```

[top](#)

<a name="fogFar"></a>
###fogFar

_field_


**description**

- 안개효과만 남고 아무것도 보이지 않는  z축 거리

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 0

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.fogFar = 1000
```

[top](#)

<a name="projectionMatrix"></a>
###projectionMatrix

_field_


**description**

- 현재 프로젝션 매트릭스를 반환

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

<a name="visible"></a>
###visible

_field_


**description**

- Field of Camera

**setting**

- *writable*:true
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

<a name="renderArea"></a>
###renderArea

_field_


**description**

- 카메라 렌더링 영역지정, 렌더링 영역을 지정하지 않을경우 캔버스 영역 전체로 자동 지정됨.

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- null

**exception**

- none

**sample**

```javascript
var camera = new Camera()
// [x,y, width, height] - number형으로 입력, %단위도 입력가능
camera.renderArea = [10,100,200,300]
camera.renderArea = ["10%","10%",200,300]
```

[top](#)

<a name="mode"></a>
###mode

_field_


**description**

- 카메라모드 지정

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- Camera.perspective

**exception**

- none

**sample**

```javascript
var camera = new Camera()
// Camera.perspective or Camera.othogonal
camera.mode = Camera.perspective
camera.mode = Camera.othogonal
```

[top](#)

<a name="fov"></a>
###fov

_field_


**description**

- FOV(Field of view) 시야각을 정의.

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 55

**exception**

- none

**sample**

```javascript
var camera = new Camera()
// number형으로 입력
camera.fov = 45
// [width,height,angle] - 화면사이즈와 각도의 직접적 입력을 통한 fov 지정도 가능
camera.fov = [width,height,angle]
```

[top](#)

<a name="fogNear"></a>
###fogNear

_field_


**description**

- 안개효과가 시작되는 z축 거리

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 0

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.fogNear = 10
```

[top](#)

<a name="fogColor"></a>
###fogColor

_field_


**description**

- 안개 효과 컬러 지정

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.fogColor = [Math.random(),Math.random(),Math.random(),1]
```

[top](#)

<a name="fog"></a>
###fog

_field_


**description**

- 안개효과 지정여부

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- false

**exception**

- none

**sample**

```javascript
var camera = new Camera()
// true or false - false로 지정시 안개효과 삭제
camera.fog = true
```

[top](#)

<a name="clipPlaneNear"></a>
###clipPlaneNear

_field_


**description**

- 현재 절두체의 최소z값

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 0.1

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.clipPlaneNear = 10
```

[top](#)

<a name="clipPlaneFar"></a>
###clipPlaneFar

_field_


**description**

- 현재 절두체의 최대z값

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 10000

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.clipPlaneFar = 1000
```

[top](#)

<a name="backgroundColor"></a>
###backgroundColor

_field_


**description**

- 렌더링 배경화면 색상을 지정

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- {r: 0, g: 0, b: 0, a: 1}}

**exception**

- none

**sample**

```javascript
var camera = new Camera()
// [r,g,b,a] number형으로 입력
camera.backgroundColor = [Math.random(),Math.random(),Math.random(),1]
```

[top](#)

<a name="antialias"></a>
###antialias

_field_


**description**

- 쉐이더 레벨의 안티알리어싱 적용여부

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- false

**exception**

- none

**sample**

```javascript
var camera = new Camera()
camera.antialias = true
```

[top](#)

<a name="resetProjectionMatrix"></a>
###resetProjectionMatrix()

_method_


**description**

- 현재 프로퍼티들을 기준으로 프로젝션 매트릭스를 갱신

**param**


**exception**

- none

**return**

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

<a name="resize"></a>
###resize

_const_


**description**

- Const of Camera

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

resize

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="perspective"></a>
###perspective

_const_


**description**

- Const of Camera

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

perspective

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="othogonal"></a>
###othogonal

_const_


**description**

- Const of Camera

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

othogonal

**exception**

- none

**sample**

```javascript
//none
```

[top](#)
