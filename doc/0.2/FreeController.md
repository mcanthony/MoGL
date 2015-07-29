**실험실**

# FreeController
* parent : [MoGL](MoGL.md)
* [Constructor](#constructor)

**field**

**method**

* [update](#update)
* [getSpeed](#getspeed)
* [getSmoothDelay](#getsmoothdelay)
* [setSpeed](#setspeed-valuenumber)
* [setSmoothDelay](#setsmoothdelay-valuenumber)




[top](#)
## Constructor
```javascript
FreeController(camera:Camera)
```

**description**

1. 카메라객체를 프리카메라 모드로 제어하는 컨트롤러 객체

**exception**

* 'FreeController.constructor:0' - 카메라 객체가 아닐때..

**param**

1. camera : 카메라객체.

**sample**

```javascript
// 카메라 객체만 인자로 받음
var controller = new FreeController(new Camera())
```
[top](#)
## getSpeed

**description**

1. 컨트롤러 speed값을 반환
2. 기본값 : 1.0

**param**

없음

**sample**

```javascript
var camera = new Camera()
var controller = new FreeController(camera)
controller.getSpeed()
```
[top](#)
## getSmoothDelay

**description**

1. 컨트롤러의 smoothDelay값을 반환
2. 기본값 : 0.1

**param**

없음

**sample**

```javascript
var camera = new Camera()
var controller = new FreeController(camera)
controller.getSmoothDelay()
```

[top](#)
## setSpeed( value:number)

**description**

1. 컨트롤러의 speed값을 설정

**param**

1 value : Number형태로 값을 설정

**sample**

```javascript
var camera = new Camera()
var controller = new FreeController(camera)
controller.setSpeed(2)
```
[top](#)
## setSmoothDelay( value:number)

**description**

1. 컨트롤러의 smoothDelay값을 설정
2. 0~0.5 사이값만 허용. 0.5 이상의 값은 강제로 0.5로 설정

**param**

1 value : Number형태로 값을 설정

**sample**

```javascript
var camera = new Camera()
var controller = new FreeController(camera)
controller.setSmoothDelay(0.2)
```

[top](#)
## update

**description**

1. 컨트롤러 상태를 업데이트.

**param**

없음

**sample**

```javascript
var controller = new FreeController(camera)
setInterval(function(){
  controller.update()
  world.render()
},1000/60)
```

[top](#)
