#Scene
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [vertexShaders](#vertexShaders) - 현재 씬이 가지고있는 버텍스 쉐이더...
* [fragmentShaders](#fragmentShaders) - 현재 씬이 가지고 있는 프레그먼트 쉐...
* [baseLightRotate](#baseLightRotate) - 디렉셔널 라이트 방향 설정, -1~1...
* [cameras](#cameras) - 씬에 등록된 카메라 리스트
* [children](#children) - 씬에 등록된 자식 리스트를 오브젝트...

**method**

* [addChild](#addChild) - 자식 객체를 추가함. 메쉬나 카메라...
* [addCamera](#addCamera) - 카메라 객체를 추가함.
* [addMesh](#addMesh) - Mesh객체를 추가함.
* [addGeometry](#addGeometry) - 지오메트리 객체를 추가함. 지역변수를...
* [addMaterial](#addMaterial) - 재질 객체를 추가함. 지역변수를 쓰지...
* [addTexture](#addTexture) - 텍스쳐 객체를 추가함
* [addFragmentShader](#addFragmentShader) - 프레그먼트 쉐이더 객체를 추가함
* [addVertexShader](#addVertexShader) - 버텍스 쉐이더 객체를 추가함
* [getChild](#getChild) - 씬에 등록된 자식객체 전체를 검색
* [getMesh](#getMesh) - 씬에 등록된 [Mesh](Mesh.m...
* [getCamera](#getCamera) - 씬에 등록된 [Camera](Came...
* [getGeometry](#getGeometry) - 씬에 등록된 지오메트리 객체를 검색
* [getMaterial](#getMaterial) - 씬에 등록된 재질 객체를 검색
* [getTexture](#getTexture) - 씬에 등록된 텍스쳐 객체를 검색
* [removeChild](#removeChild) - 씬에 등록된 객체를 자식리스트에서 삭...
* [removeGeometry](#removeGeometry) - 씬에 등록된 지오메트리 객체를 리스트...
* [removeMaterial](#removeMaterial) - 씬에 등록된 재질 객체를 리스트에서...
* [removeTexture](#removeTexture) - 씬에 등록된 텍스쳐 객체를 리스트에서...

**static**

* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 실제 렌더링될 구조체는 Scene별로 집결됨.
Scene은 렌더링과 관련된 [Mesh](Mesh.md), [Camera](Camera.md), [Light](Light.md) 등을 포함하고 이들 객체가 공유하며 활용하는 기초 자원으로서 vertex shader, fragment shader, [Texture](Texture.md), [Material](Material.md), [Geometry](Geometry.md) 등을 등록하여 관리한다

**param**

none

**exception**

- none

**sample**

```javascript
var scene = new Scene();
```

[top](#)

<a name="vertexShaders"></a>
###vertexShaders

_field_


**description**


- 현재 씬이 가지고있는 버텍스 쉐이더 자바스크립트 정보

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- {}

**exception**


- none

**sample**

```javascript
console.log(scene.vertexShaders);
```

[top](#)

<a name="fragmentShaders"></a>
###fragmentShaders

_field_


**description**


- 현재 씬이 가지고 있는 프레그먼트 쉐이더 자바스크립트 정보

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- {}

**exception**


- none

**sample**

```javascript
console.log(scene.fragmentShaders);
```

[top](#)

<a name="baseLightRotate"></a>
###baseLightRotate

_field_


**description**


- 디렉셔널 라이트 방향 설정, -1~1 사이값으로 입력(0.4에서 노멀라이즈처리)

**setting**

- *writable*:true
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- [0, -1, -1]

**exception**


- none

**sample**

```javascript
var scene = new Scene();
scene.baseLightRotate = [0,1,0];
console.log(scene.baseLightRotate);
```

[top](#)

<a name="cameras"></a>
###cameras

_field_


**description**


- 씬에 등록된 카메라 리스트

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- {}

**exception**


- none

**sample**

```javascript
var scene = new Scene();
scene.addChild(new Camera);
console.log(scene.cameras); //오브젝트 형식의 카메라 리스트를 반환
```

[top](#)

<a name="children"></a>
###children

_field_


**description**


- 씬에 등록된 자식 리스트를 오브젝트 형식으로 반환

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- {}

**exception**


- none

**sample**

```javascript
console.log(scene.children);
```

[top](#)

<a name="addChild"></a>
###addChild(1. child:[Mesh](Mesh.md) or [Camera](Camera.md))

_method_


**description**


- 자식 객체를 추가함. 메쉬나 카메라 객체가 자식으로 올 수 있음

**param**

    1. child:[Mesh](Mesh.md) or [Camera](Camera.md) - Mesh 또는 Camera

**exception**


- 'Scene.addChild:0' - 카메라나 메쉬객체가 아닌 객체를 추가하려고 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
var camera = new Camera();
scene.addChild(camera);
```

[top](#)

<a name="addCamera"></a>
###addCamera(1. camera:[Camera](Camera.md))

_method_


**description**


- 카메라 객체를 추가함.

**param**

    1. camera:[Camera](Camera.md) - 등록할 카메라

**exception**


- 'Scene.addCamera:0' - 이미 등록된 카메라객체를 등록하려고 할 때
'Scene.addCamera:1' - 카메라가 아닌 객체를 등록하려고 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
var camera = new Camera();
scene.addCamera(camera);
```

[top](#)

<a name="addMesh"></a>
###addMesh(1. mesh:Mesh)

_method_


**description**


- Mesh객체를 추가함.

**param**

    1. mesh:Mesh - 메쉬객체

**exception**


- 'Scene.addMesh:0' - 이미 등록된 메쉬객체를 등록하려고 할 때
'Scene.addMesh:1' - 메쉬가 아닌 객체를 등록하려고 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var scene = new Scene();
var geo = new Geometry([],[]);
var mat = new Material();
var mesh = new Mesh(geo,mat);
scene.addMesh(mesh);
```

[top](#)

<a name="addGeometry"></a>
###addGeometry(1. geometry:[Geometry](Geometry.md))

_method_


**description**


- 지오메트리 객체를 추가함. 지역변수를 쓰지 않고 scene을 컨테이너로 사용할 수 있음.

**param**

    1. geometry:[Geometry](Geometry.md) - 지오메트리 객체

**exception**


- 'Scene.addGeometry:0' - 이미 등록된 지오메트리를 등록하려 할 때
'Scene.addGeometry:1' - 지오메트리 타입이 아닌 객체를 등록하려 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
var geo = new Geometry([],[]);
scene.addGeometry(geo);
```

[top](#)

<a name="addMaterial"></a>
###addMaterial(1. material:[Material](Material.md))

_method_


**description**


- 재질 객체를 추가함. 지역변수를 쓰지 않고 scene을 컨테이너로 사용할 수 있음.

**param**

    1. material:[Material](Material.md) - 재질 객체

**exception**


- 'Scene.addMaterial:0' - 이미 등록된 재질을 등록하려 할 때
'Scene.addMaterial:1' - Material 타입이 아닌 객체를 등록하려 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
var mat = new Material();
scene.addMaterial(mat);
```

[top](#)

<a name="addTexture"></a>
###addTexture(1. texture:[Texture](Texture.md))

_method_


**description**


- 텍스쳐 객체를 추가함

**param**

    1. texture:[Texture](Texture.md) - 텍스쳐 객체

**exception**


- 'Scene.addTexture:0' - 이미 등록된 텍스쳐를 등록하려 할 때
'Scene.addTexture:1' - Texture 타입이 아닌 객체를 등록하려 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
var texture = new Texture();
scene.addTexture(texture);
```

[top](#)

<a name="addFragmentShader"></a>
###addFragmentShader(1. fragmentShader:[Shader](Shader.md))

_method_


**description**


- 프레그먼트 쉐이더 객체를 추가함

**param**

    1. fragmentShader:[Shader](Shader.md) - 프레그먼트 쉐이더 객체

**exception**


- 'Scene.addFragmentShader:0' - 이미 등록된 프레그먼트 쉐이더를 등록하려 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
scene.addFragmentShader(fragmentShader);
```

[top](#)

<a name="addVertexShader"></a>
###addVertexShader(1. vertexShader:[Shader](Shader.md))

_method_


**description**


- 버텍스 쉐이더 객체를 추가함

**param**

    1. vertexShader:[Shader](Shader.md) - 버텍스 쉐이더 객체

**exception**


- 'Scene.addVertexShader:0' - 이미 등록된 버텍스 쉐이더를 등록하려 할 때

**return**


- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
scene.addVertexShader(vertexShader);
```

[top](#)

<a name="getChild"></a>
###getChild(id:String)

_method_


**description**


- 씬에 등록된 자식객체 전체를 검색

**param**

1. id:String - 찾고자 하는 자식의 id 또는 uuid

**exception**


- none

**return**


- [Mesh](Mesh.md) or [Camera](Camera.md) or null

**sample**

```javascript
scene.getChild('CameraID');
```

[top](#)

<a name="getMesh"></a>
###getMesh(1. id:String)

_method_


**description**


- 씬에 등록된 [Mesh](Mesh.md)객체를 검색

**param**

    1. id:String - 찾고자 하는 id 또는 uuid

**exception**


- none

**return**


- [Mesh](Mesh.md) or null

**sample**

```javascript
scene.getMesh('MeshID')
```

[top](#)

<a name="getCamera"></a>
###getCamera(1. id:String)

_method_


**description**


- 씬에 등록된 [Camera](Camera.md)객체를 검색

**param**

    1. id:String - 찾고자 하는 id 또는 uuid

**exception**


- none

**return**


- [Camera](Camera.md) or null

**sample**

```javascript
var cam = scene.getCamera('CameraID');
```

[top](#)

<a name="getGeometry"></a>
###getGeometry(1. id:String)

_method_


**description**


- 씬에 등록된 지오메트리 객체를 검색

**param**

    1. id:String - 찾고자 하는 id 또는 uuid

**exception**


- none

**return**


- [Geometry](Geometry.md) or null

**sample**

```javascript
var geo = scene.getGeometry('GeometryID');
```

[top](#)

<a name="getMaterial"></a>
###getMaterial(1. id:String)

_method_


**description**


- 씬에 등록된 재질 객체를 검색

**param**

    1. id:String - 찾고자 하는 id 또는 uuid

**exception**


- none

**return**


- [Material](Material.md) or null

**sample**

```javascript
var mat = scene.getMaterial('MaterialID');
```

[top](#)

<a name="getTexture"></a>
###getTexture(1. id:String)

_method_


**description**


- 씬에 등록된 텍스쳐 객체를 검색

**param**

    1. id:String - 찾고자 하는 id 또는 uuid

**exception**


- none

**return**


- [Texture](Texture.md) or null

**sample**

```javascript
var tex = scene.getTexture('TextureID');
```

[top](#)

<a name="removeChild"></a>
###removeChild(1. id:String)

_method_


**description**


- 씬에 등록된 객체를 자식리스트에서 삭제

**param**

    1. id:String - 삭제하려는 id 또는 uuid

**exception**


- none

**return**


- true or false - 삭제 성공시 true 반환

**sample**

```javascript
scene.removeChild('targetID');
```

[top](#)

<a name="removeGeometry"></a>
###removeGeometry(1. id:String)

_method_


**description**


- 씬에 등록된 지오메트리 객체를 리스트에서 삭제

**param**

    1. id:String - 삭제하려는 id 또는 uuid

**exception**


- none

**return**


- true or false - 삭제 성공시 true 반환

**sample**

```javascript
scene.removeGeometry('targetID');
```

[top](#)

<a name="removeMaterial"></a>
###removeMaterial(1. id:String)

_method_


**description**


- 씬에 등록된 재질 객체를 리스트에서 삭제

**param**

    1. id:String - 삭제하려는 id 또는 uuid

**exception**


- none

**return**


- true or false - 삭제 성공시 true 반환

**sample**

```javascript
scene.removeMaterial('targetID');
```

[top](#)

<a name="removeTexture"></a>
###removeTexture(1. id:String)

_method_


**description**


- 씬에 등록된 텍스쳐 객체를 리스트에서 삭제

**param**

    1. id:String - 삭제하려는 id 또는 uuid

**exception**


- none

**return**


- true or false - 삭제 성공시 true 반환

**sample**

```javascript
scene.removeTexture('targetID');
```

[top](#)

<a name="extend"></a>
###extend(className:string, constructor:function)

_static_


**description**


- 이 클래스를 상속하는 자식클래스를 만들 수 있는 정의자(Definer)를 얻음

**Definer class의 메소드**

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


- Definer - 클래스를 정의할 수 있는 생성전용객체

**sample**

```javascript
var classA = MoGL.extend('classA', function(){}).build();
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
var instance = Mesh.getInstance(uuid);
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
var meshCount = Mesh.count();
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
var classA = MoGL.extend('classA', function(){})
    .static('test', function(){
	     this.error('test', 0);
    })
    .build();
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
