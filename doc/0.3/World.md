#World
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**method**

* [setAutoSize](#setAutoSize) - world에 지정된 canvas요소에...
* [addScene](#addScene) - [Scene](Scene.md)객체를...
* [getScene](#getScene) - sceneId에 해당되는 [Scene...
* [getRenderer](#getRenderer) - setInterval이나 reques...
* [start](#start) - requestAnimationFram...
* [stop](#stop) - start시킨 자동 render를 정...
* [removeScene](#removeScene) - [Scene](Scene.md)객체를...
* [render](#render) - 현재 화면을 그림.

**static**

* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...

**constant**

* [renderBefore](#renderBefore) - Const of World
* [renderAfter](#renderAfter) - Const of World

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- World는 MoGL의 기본 시작객체로 내부에 다수의 Scene을 소유할 수 있으며, 실제 렌더링되는 대상임.

**param**

- 1. id:string - canvasID

**exception**

- none

**sample**

```javascript
var world = new World('canvasID1);

// 애니메이션 루프에 인스턴스를 넣는다.
requestAnimationFrame( world.getRenderer(true) );

// 팩토리함수로도 사용가능
var world2 = World('canvasID2');
```

[top](#)

<a name="setAutoSize"></a>
###setAutoSize(1. isAutoSize:boolean)

_method_


**description**

- world에 지정된 canvas요소에 대해 viewport에 대한 자동 크기 조정을 해주는지 여부.
- 생성시 기본값은 false

**param**

    1. isAutoSize:boolean - 자동으로 캔버스의 크기를 조정하는지에 대한 여부.

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.isAutoSize(true);
```

[top](#)

<a name="addScene"></a>
###addScene(1. scene:[Scene](Scene.md))

_method_


**description**

- [Scene](Scene.md)객체를 world에 추가함.

**param**

    1. scene:[Scene](Scene.md) - [Scene](Scene.md)의 인스턴스

**exception**

- * 'World.addScene:0' - 이미 등록된 Scene.
- * 'World.addScene:1' - [Scene](Scene.md)이 아닌 객체를 지정한 경우.

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.addScene( Scene().setId('lobby') );
world.addScene( Scene().setId('room') );
```

[top](#)

<a name="getScene"></a>
###getScene(1. sceneId:string)

_method_


**description**

- sceneId에 해당되는 [Scene](Scene.md)을 얻음.

**param**

    1. sceneId:string - 등록시 scene의 id. 없으면 null을 반환함.

**exception**

- none

**return**

- [Scene](Scene.md) - sceneId에 해당되는 [Scene](Scene.md) 인스턴스.

**sample**

```javascript
var world = new World('canvasID');
world.addScene( new Scene().setId('lobby') );
var lobby = world.getScene( 'lobby' );
```

[top](#)

<a name="getRenderer"></a>
###getRenderer(1. isRequestAnimationFrame:boolean)

_method_


**description**

- setInterval이나 requestAnimationFrame에서 사용될 렌더링 함수를 얻음.
- 실제로는 본인과 바인딩된 render함수를 반환하고 한 번 반환한 이후는 캐쉬로 잡아둠.

**param**

    1. isRequestAnimationFrame:boolean - 애니메이션프레임용으로 반환하는 경우는 내부에서 다시 requestAnimationFrame을 호출하는 기능이 추가됨.

**exception**

- none

**return**

- function - this - 메소드체이닝을 위해 자신을 반환함.render.bind(this) 형태로 본인과 바인딩된 함수를 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.addScene( Scene().setId('lobby') );
//인터벌용
setInterval( world.getRenderer() );
//raf용
requestAnimationFrame( world.getRenderer(true) );
```

[top](#)

<a name="start"></a>
###start()

_method_


**description**

- requestAnimationFrame을 이용해 자동으로 render를 호출함.

**param**

none

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.start();
```

[top](#)

<a name="stop"></a>
###stop()

_method_


**description**

- start시킨 자동 render를 정지함.

**param**

none

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.start();
world.stop();
```

[top](#)

<a name="removeScene"></a>
###removeScene(1. sceneId:string)

_method_


**description**

- [Scene](Scene.md)객체를 world에서 제거함.
- [Scene](Scene.md)을 제거하면 관련된 카메라가 지정된 render도 자동으로 제거됨.

**param**

    1. sceneId:string - [Scene](Scene.md)객체에 정의된 id.

**exception**

- * 'World.removeScene:0' - id에 해당되는 [Scene](Scene.md)이 존재하지 않음.

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// Scene과 Camara생성 및 등록
var lobby = new Scene();
lobby.addChild( Camera() );

// Scene 등록
var world = new World('canvasID');
world.addScene( lobby.setId('lobby') );

// Scene 제거
world.removeScene( 'lobby' );
```

[top](#)

<a name="render"></a>
###render(currentTime)

_method_


**description**

- 현재 화면을 그림.

**param**

1. currentTime

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// Scene과 Camara생성 및 등록
var lobby = new Scene();
lobby.addChild( Camera() );

// Scene 등록
var world = new World('canvasID');
world.addScene( lobby.setId('lobby') );

// 실제 출력
world.render();
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

<a name="count"></a>
###count()

_static_


**description**

- 이 클래스로 부터 만들어져 활성화된 인스턴스의 수

**param**

none

**exception**

- none

**return**

- int - 활성화된 인스턴스의 수

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

<a name="getMD"></a>
###getMD()

_static_


**description**

- 해당 클래스를 마크다운 형식으로 문서화하여 출력함

**param**

none

**exception**

- none

**return**

- string - 클래스에 대한 문서 마크다운

**sample**

```javascript
//none
```

[top](#)

<a name="renderBefore"></a>
###renderBefore

_const_


**description**

- Const of World

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

renderBefore

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="renderAfter"></a>
###renderAfter

_const_


**description**

- Const of World

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

renderAfter

**exception**

- none

**sample**

```javascript
//none
```

[top](#)