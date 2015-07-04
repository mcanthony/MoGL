# 시작하기

MoGL(모글)은 모바일 브라우저에 최적화된 작고 가벼운 웹지엘(WebGL) 라이브러리입니다.
쉽고 일관된 인터페이스로 웹지엘에 대한 특별한 지식없이도 화려한 그래픽을 구현할 수 있습니다.

[Release 페이지](https://github.com/projectBS/MoGL/releases)에서 최신 버전을 다운 받거나 https://cdnjs.com/libraries/mogl 에서 제공하는 링크를 삽입하여 사용 가능합니다.

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/mogl/0.3.0/mogl.min.js"></script>
```

## 간단한 삼각형만들기

우선 웹지엘계의 Hello World에 해당되는 삼각형 그리기를 해보겠습니다.
다음 설명을 따라 차근차근 진행하시면 쉽게 삼각형을 만날 수 있습니다.


**1. World(월드) 생성**

MoGL을 사용하기 위해서는 가장 먼저 그림을 그릴 공간인 월드를 만들어야 합니다. 
다음과 같이 World를 생성합니다.


```html
<canvas id="stage"></canvas>
```

```javascript
var world = new World('stage');
```

첫 번째 인자는 html의 canvas태그에 부여된 id입니다.

**2. Scene(장면) 생성**

월드에는 여러 개의 장면을 넣을 수 있는데, 화면에 표시되는 단위는 장면이므로 우선 넣을 장면을 생성한 뒤 월드에 넣어줍니다.

```javascript
var scene = new Scene();
world.addScene(scene.setId('firstScene'));
```

등록시에 첫 번째 인자에는 문자열로 된 고유한 id를 입력하고, 두번째 인자에는 객체를 넣어줍니다.

**3. Camera(카메라) 생성**

장면을 만들긴 했지만 그 장면의 어떤 모습을 그릴지 결정하는 것은 카메라입니다. 어떤 공간이 있다고 할 때 실제 화면에 바닥에서 하늘로 올려다 본 모습을 보이게 할지, 위에서 아래로 내려다 본 모습으로 보이게 할지 등을 결정하는 것이 카메라입니다. 
다음과 같이 카메라를 만들어 장면에 넣어줍니다.

```javascript
var camera = new Camera();
scene.addChild( camera );
```

우선 여기까지. 이제 화면에 그릴 준비는 다 된 셈입니다. 
다음으로 장면에 우리가 그리고 싶은 대상을 등록해야 합니다.
삼각형을 하나 등록해 봅시다.

**4. 삼각형 생성하기**

삼각형을 만들려면 3차원 공간 위의 점 3개와 이 3개의 점이 연결되어 있다는 인덱스 정보를 만들어 보내주어야 합니다. 이러한 그림을 그릴 기하학적인 구조물을 담당하고 있는 클래스를 Geometry(기하구조)라고 부릅니다. 
삼각형 Geometry를 생성해 봅시다.

```javascript
var triangle = new Geometry( 
    [-1,0,0,  1,0,0,  0,1,0], // 점의 좌표
    [0,1,2]  //index
);
```

위의 코드에서 Geometry의 생성자는 두 개의 배열을 받고 있는데,
* 첫번째 배열은 3개의 점의 좌표를 x,y,z 형식으로 묶어 총 9개의 요소로 구성된 배열입니다.
* 두번째 배열은 0,1,2 즉, 이 세개의 점이 하나의 삼각형을 이룬다는 정보를 제공하고 있습니다.

**5. Material(재질) 만들기**

기하구를 만들었지만 화면에 표시되려면 여기에 어떻게 색을 칠할지 알아야합니다. 어떻게 칠할 것인지에 대한 정보를 *재질*이라 합니다.
간단히 흰색 재질을 만들어 봅시다.

```javascript
var white = new Material( '#ffffff' );
```

**6. Mesh(메쉬) 만들기**

위에서 만든 기하구조와 재질을 합쳐 실제 장면에서의 위치, 회전, 확대 정보를 하나로 종합한 객체가 바로 메쉬입니다.
지금까지 만든 기하구조와 재질을 이용해 메쉬를 만들고, 이 메쉬를 앞서 만든 장면에 포함시켜 봅시다.

```javascript
var mesh = new Mesh( triangle, white );
mesh.z = -10; // mesh가 camera 앞에 위치하도록 z좌표 적용.
scene.addChild( mesh );
```

**7. 실제 그리기**

이제 화면에 그릴 삼각형이 완벽하게 준비되었습니다. 월드를 그리면 화면에 표시됩니다.

```javascript
setInterval( function(){
    world.render();
}, 1000/60 );
```

이상의 예를 가볍게 구현한 샘플은 아래에 있습니다.
[하얀 삼각형 만들기](http://projectbs.github.io/MoGL/helloWorld/001_drawTriangle.html)
