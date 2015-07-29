# World
* [Constructor](#constructor)

**method**

* [addRender](#addrender-sceneidstring-cameraidstring-indexint--)
* [addScene](#addscene-idstring-scenescene-)
* [getScene](#getscene-idstring-)
* [removeRender](#removerender-sceneidstring-cameraidstring--)
* [removeScene](#removescene-idstring-)

[top](#)
## Constructor

```javascript
World('canvasID')
```

**description**

World는 MoGL의 기본 시작객체로 내부에 다수의 [Scene](Scene.md)을 소유할 수 있으며, 실제 렌더링되는 대상임.
또한 World의 인스턴스는 rendering함수 그 자체이기도 함.
* 메서드체이닝을 위해 대부분의 함수는 자신을 반환함.

**exception**

* 'World.constructor:0' - 캔버스 아이디가 없을때
* 'World.constructor:1' - 존재하지않는 Dom id일때

**param**

1. id:string : canvasID

**sample**

```javascript
var world = new World('canvasID1');

//애니메이션 루프에 인스턴스를 넣는다.
requestAnimationFrame( world );

//팩토리함수로도 작동
var world2 = World('canvasID2');
```

[top](#)
## addRender( sceneId:string, cameraId:string[, index:int]  )

**description**

실제 그려질 대상을 추가함. 다수 등록 가능.

**param**

1. sceneId:string - 그려질 대상 [Scene](Scene.md)의 등록시 id.
2. cameraId:string - 해당 [Scene](Scene.md)내의 카메라 등록시 id.
3. ?index:int - 그려질 순서. 생략하면 마지막 index + 1로 설정됨.

**exception**

* 'World.addRender:0' - 이미 등록된 id.
* 'World.addRender:1' - 존재하지 않는 [Scene](Scene.md)의 id.
* 'World.addRender:2' - 존재하지 않은 [Camera](Camera.md)의 id.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// Scene과 Camara생성 및 등록
var lobby = Scene();
lobby.addChild( 'cam1', new Camera() );

// Scene 등록 및 렌더대상 등록
var world = World('canvasID');
world.addScene( 'lobby', lobby );
world.addRender( 'lobby', 'cam1' );
```

[top](#)
## addScene( sceneId:string, scene:Scene )

**description**

[Scene](Scene.md)객체를 world에 추가함.

**param**

1. sceneId:string - removeScene, getScene 등에서 사용할 id
2. scene:[Scene](Scene.md) - [Scene](Scene.md)의 인스턴스

**exception**

* 'World.addScene:0' - 이미 등록된 id.
* 'World.addScene:1' - [Scene](Scene.md)이 아닌 객체를 지정한 경우.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var world = new World('canvasID');
world.addScene( 'lobby', new Scene() );
world.addScene( 'room', Scene() );
```

[top](#)
## getScene( sceneId:string )

**description**

sceneId에 해당되는 [Scene](Scene.md)을 얻음.

**param**

1. sceneId:string - 등록시 사용한 sceneId. 없으면 null을 반환함.

**return**

[Scene](Scene.md) - sceneId에 해당되는 [Scene](Scene.md) 인스턴스.

**sample**

```javascript
var world = new World('canvasID');
world.addScene( 'lobby', new Scene() );
var lobby = world.getScene( 'lobby' );
```

[top](#)
## removeRender( sceneId:string, cameraId:string  )

**description**

해당 대상을 렌더링 대상에서 제외함.

**param**

1. sceneId:string - 그려질 대상 [Scene](Scene.md)의 등록시 sceneId.
2. cameraId:string - 해당 [Scene](Scene.md) 내의 카메라 등록시 cameraId.

**exception**

* 'World.removeRender:0' - id에 해당되는 [Scene](Scene.md)이 존재하지 않음.
* 'World.removeRender:1' - id에 해당되는 [Camera](Camera.md)가 [Scene](Scene.md) 내에 존재하지 않음.
* 'World.removeRender:2' - id에 해당되는 [Scene](Scene.md)가 렌더리스트에 존재하지 않음.
* 'World.removeRender:3' - id에 해당되는 [Camera](Camera.md)가 렌더리스트에 존재하지 않음.
* 
**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// Scene과 Camara생성 및 등록
var lobby = new Scene();
lobby.addChild( 'cam1', new Camera() );

// Scene 등록 및 렌더대상 등록
var world = new World('canvasID');
world.addScene( 'lobby', lobby );
world.addRender( 'lobby', 'cam1' );

// 렌더대상에서 제외
world.removeRender( 'lobby', 'cam1' );
```

[top](#)
## removeScene( sceneId:string )

**description**

[Scene](Scene.md)객체를 world에서 제거함.
[Scene](Scene.md)을 제거하면 관련된 카메라가 지정된 render도 자동으로 제거됨.

**param**

1. sceneId:string - removeScene, getScene 등에서 사용할 sceneId

**exception**

* 'World.removeScene:0' - id에 해당되는 [Scene](Scene.md)이 존재하지 않음.
* 
**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// Scene과 Camara생성 및 등록
var lobby = new Scene();
lobby.addChild( 'cam1', Camera() );

// Scene 등록 및 렌더대상 등록
var world = new World('canvasID');
world.addScene( 'lobby', lobby );
world.addRender( 'lobby', 'cam1' );

// Scene 제거
world.removeScene( 'lobby' );
// 해당 렌더가 이미 제거되어있음
world.removeRender( 'lobby', 'cam1' ) === false
```

[top](#)
