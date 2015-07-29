# Scene
* parent : [MoGL](MoGL.md)
* [Constructor](#Constructor)

**method**

* [addChild](#addchild-idstring-meshmesh-)
* [addFragmentShader](#addfragmentshader-idstring-programstring-)
* [addGeometry](#addgeometry-idstring-geomertygeometry)
* [addMaterial](#addmaterial-idstring-materialmaterial-)
* [addTexture](#addtexture-idstring-image-resizetypestring-)
* [addVertextShader](#addvertexshader-idstring-programstring-)
* [getChild](#getchild-idstring-)
* [getGeometry](#getgeomtry-idstring-)
* [getMaterial](#getmaterial-idstring-)
* [getTexture](#gettexture-idstring-)
* [removeChild](#removechild-idstring-)
* [removeFragmentShader](#removefragmentshader-idstring-)
* [removeGeometry](#removegeometry-idstring-)
* [removeMaterial](#removematerial-idstring-)
* [removeTexture](#removetexture-idstring-)
* [removeVertextShader](#removevertexshader-idstring-)

[top](#)
## Constructor

```javascript
Scene()
```

**description**

실제 렌더링될 구조체는 Scene별도 집결됨. 렌더링 단위인 [Camera](Camera.md)는 한 번에 하나의 Scene만 가리킬 수 있음.
* Scene은 렌더링과 관련된 [Mesh](Mesh.md), [Camera](Camera.md), [Light](Light.md) 등을 포함하고 이들 객체가 공유하며 활용하는 기초 자원으로서 vertex shader, fragment shader, texture, [Material](Material.md), [Geometry](Geometry.md) 등을 고유한 id로 등록하여 관리한다.

**param**

없음.

**sample**

```javascript
//일반적은 new방식
var scene = new Scene();

//factory함수로도 작동
var scene2 = Scene();
```

[top](#)
## addChild( id:string, mesh:[Mesh](Mesh.md) )

**description**

실제 렌더링될 [Mesh](Mesh.md) 및 그 서브클래스를 등록함.

**param**

1. id:string - removeChild 등에서 사용할 id.
2. mesh:[Mesh](Mesh.md) - [Mesh](Mesh.md) 및 그 서브클래스([Camera](Camera.md), [Light](Light.md) 등)

**exception**

* 'Scene.addChild:0' - 이미 존재하는 id.
* 'Scene.addChild:1' - [Mesh](Mesh.md)가 아닌 객체.
* 'Scene.addChild:2' - [Mesh](Mesh.md)안의 [Geometry](Geometry.md)에 지정된 vertex shader의 id가 존재하지 않음.
* 'Scene.addChild:3' - [Mesh](Mesh.md)안의 [Material](Material.md)에 지정된 fragment shader의 id가 존재하지 않음.
* 'Scene.addChild:4' - [Mesh](Mesh.md)안의 [Material](Material.md)에 지정된 texture의 id가 존재하지 않음.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var city1 = Scene();
city1.addChild( 'frontView', new Camera() );
city1.addChild( 'centerLight', new OmniLight() );
city1.addChild( 'building', new Mesh() );

try{
    //중복된 id등록 시도
    city1.addChild( 'building', new Mesh() );
}catch(e){
    console.log(e); //Scene.addChild:0
}

try{
    //mesh가 아닌 객체 등록 시도
    city1.addChild( 'building2', {} );
}catch(e){
    console.log(e); //Scene.addChild:1
}
```

[top](#)
## addFragmentShader( id:string, program:string )

**description**

실제 사용될 shader를 등록함. fragment shader는 MoGL 표준 인터페이스를 준수하는 형태로 제작되어야함.
* [MoGL Fragment Shader Interface](Interface_MoGLFragmentShader.md)

**param**

1. id:string - removeFragmentShader, getFragmentShader 등에서 사용할 id.
2. program:string - 실제 fragment shader 코드의 문자열.
 
**exception**

* 'Scene.addFragmentShader:0' - 이미 존재하는 id를 등록하려할 때.
* 'Scene.addFragmentShader:1' - MoGL 표준 인터페이스를 준수하지 않는 fragment shader를 등록하려할 때.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```html
<script id="fshader" type="text/shader">
precision mediump float;
uniform sampler2D uSampler;
varying vec2 vUV;
void main(void) {
     gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t));
}
</script>
```

```javascript
var lobby = Scene();
var shader = document.getElementById('fshader').text;
lobby.addFragmentShader( 'base', shader );

try{
    //중복된 id등록 시도
    lobby.addFragmentShader( 'base', shader );
}catch(e){
    console.log(e); //Scene.addFragmentShader:0
}

try{
    //적절하지 않은 값을 전달
    lobby.addFragmentShader( 'base2', {} );
}catch(e){
    console.log(e); //Scene.addFragmentShader:1
}
```

[top](#)
## addGeometry( id:string, geomerty:[Geometry](Geometry.md)

**description**

기하구조체인 [Geometry](Geometry.md)를 등록함. 기하구조체는 다양한 Mesh에서 재활용될 수 있으므로 Scene에 등록한 후 [Mesh](Mesh.md)에서는 id로 재활용함.

**param**

1. id:string - removeGeometry, getGeometry 등에서 사용할 id. Mesh 등에서도 사용됨.
2. geomerty:[Geometry](Geometry.md) - [Geometry](Geometry.md)의 인스턴스.

**exception**

* 'Scene.addGeometry:0' - 이미 존재하는 id를 등록하려할 때.
* 'Scene.addGeometry:1' - [Geometry](Geometry.md) 아닌 객체를 등록하려할 때.
* 'Scene.addGeometry:2' - [Geometry](Geometry.md)에 선언된 vertex shader의 id가 없을 때.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
// 월드를 정의하고 빌딩용 지오메트리를 등록
var lobby = world.getScene('lobby');
lobby.addGeometry( 'building', new Geometry( v1, i1 ) );

// 장면을 정의하고 텍스쳐를 등록
city1.addTexture( 'red', new Texture( 'color', 'color' ).setColor('#f00') );
city1.addTexture( 'green', new Texture( 'color', 'color' ).setColor('#0f0') );
city1.addTexture( 'blue', new Texture( 'color', 'color' ).setColor('#00f') );

// 실제 빌딩 메쉬 생성
var building = new Mesh( 'building', new Material('red') );

// 장면에 추가
city1.addChild( 'building', building );

// 하나의 Geometry는 여러 메쉬에서 공유됨.
city1.addChild( 'building2', new Mesh( 'building', new Material('green') ));
city1.addChild( 'building3', new Mesh( 'building', new Material('blue') ));

try{
    //중복된 id등록 시도
    lobby.addGeometry( 'building', new Geometry( v1, i1 ) );
}catch(e){
    console.log(e); //Scene.addGeometry:0
}

try{
    //적절하지 않은 값을 전달
    lobby.addGeometry( 'building2', {} );
}catch(e){
    console.log(e); //Scene.addGeometry:1
}
```

[top](#)
## addMaterial( id:string, material:[Material](Material.md) )

**description**

재질을 나타내는 [Material](Material.md)을 등록함.

**param**

1. id:string - removeMaterial, getMaterial 등에서 사용할 id. [Mesh](Mesh.md)에서도 사용.
2. material:[Material](Material.md) - [Material](Material.md)의 인스턴스

**exception**

* 'Scene.addMaterial:0' - 이미 존재하는 id를 등록하려할 때.
* 'Scene.addMaterial:1' - [Material](Material.md) 아닌 객체를 등록하려할 때.
* 'Scene.addMaterial:2' - [Material](Material.md)에 선언된 fragment shader의 id가 없을 때.
* 'Scene.addMaterial:3' - [Material](Material.md)에 선언된 texture의 id가 없을 때.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var scene = Scene().addMaterial( 'white', new Material('#fff') );
try{
    //중복된 id등록 시도
    scene.addMaterial( 'white', new Material( 255, 255, 255, 1.0 ) );
}catch(e){
    console.log(e); //Scene.addMaterial:0
}

try{
    //적절하지 않은 값을 전달
    scene.addMaterial( 'white', {} );
}catch(e){
    console.log(e); //Scene.addMaterial:1
}
```

[top](#)
## addTexture( id:string, image:*[, resizeType:string] )

**description**

텍스쳐로 사용될 이미지를 등록함.
* 로딩이 완료되지 않은 이미지는 등록되지 않고 무시됨.
* 이미지의 크기가 2의 n승으로 떨어지지 않는 경우 자동으로 리사이즈함.
* 내부적으로는 어떠한 소스가 와도 image엘리먼트를 만들어 base64형식의 dateURL을 src로 지정한 상태의 객체로 보관함.
* 내부처리가 있으므로 field로 제공되지 않음.

**param**

1. id:string - removeTexture, getTexture 등에서 사용할 id.
2. image:* - 실제 소스가 될 이미지. 다음과 같은 값이 올 수 있음.
    * image엘리먼트 - 로딩이 완료된 이미지태그.
    * canvas엘리먼트 - 현재 canvas2D에 그려진 내용을 이미지로 사용.
    * video엘리먼트 - 지정하는 시점의 프레임에 있는 내용을 사용.
    * base64문자열 - urlData형식으로 지정된 base64문자열.
    * Blob객체 - 실제 이미지를 포함하고 있는 Blob객체.
    * rgba배열 - canvas등에서 얻은 rgba형식의 배열.
3. ?resizeType:string - 기본값은 'zoomOut' 이며 다음과 같은 값이 올 수 있음. 아래 해당되지 않은 값이 오면 zoomOut으로 처리.
    * [Texture.zoomOut](Texture.md#texturezoomout) or 'zoomOut' - 이미지를 축소하여 2의 n에 맞춤.
    * [Texture.zoomIn](Texture.md#texturezoomin) or 'zoomIn' - 이미지를 확대하여 2의 n에 맞춤.
    * [Texture.crop](Texture.md#texturecrop) or 'crop' - 이미지를 2의 n에 맡게 좌상단을 기준으로 잘라냄.
    * [Texture.addSpace](Texture.md#textureaddspace) or 'addSpace' - 이미지를 2의 n에 맡게 여백을 늘림.

**exception**

* 'Scene.addTexture:0' - 이미 존재하는 id를 등록하려할 때.
* 'Scene.addTexture:1' - Param에 명시된 형식이 아닌 image를 등록하려할 때.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```html
<img src="texture.jpg" id="img1"/>
```

```javascript
var lobby = new Scene();
var img = document.getElementById('img1');
lobby.addTexture( 'texture', img );
try{
    //중복된 id등록 시도
    lobby.addTexture( 'texture', img );
}catch(e){
    console.log(e); //Scene.addTexture:0
}

try{
    //적절하지 않은 값을 전달
    lobby.addTexture( 'img', {} );
}catch(e){
    console.log(e); //Scene.addTexture:1
}
```

[top](#)
## addVertexShader( id:string, program:string )

**description**

실제 사용될 shader를 등록함. vetex shader는 MoGL 표준 인터페이스를 준수하는 형태로 제작되어야함.
* [MoGL Vertex Shader Interface](Interface_MoGLVertexShader.md)

**param**

1. id:string - removeVertexShader, getVertexShader 등에서 사용할 id.
2. program:string - 실제 vertex shader 코드의 문자열.


**exception**

* 'Scene.addVertexShader:0' - 이미 존재하는 id를 등록하려할 때.
* 'Scene.addVertexShader:1' - MoGL 표준 인터페이스를 준수하지 않는 vertex shader를 등록하려할 때.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```html
<script id="vshader" type="text/shader">
attribute vec3 aVertexPosition;
attribute vec2 aUV;
varying vec2 vUV;
uniform vec3 uRotation;
uniform vec3 uPosition;
uniform vec3 uScale;

mat4 positionMTX(vec3 t){
	return mat4( 1,0,0,0, 0,1,0,0, 0,0,1,0, t[0],t[1],t[2],1);
}

mat4 scaleMTX(vec3 t){
	return mat4( t[0],0,0,0, 0,t[1],0,0, 0,0,t[2],0, 0,0,0,1);
}

mat4 rotationMTX(vec3 t){
	float s = sin(t[0]);float c = cos(t[0]);
	mat4 m1=mat4(1,0,0,0,0,c,-s,0,0,s,c,0, 0,0,0,1);
	s=sin(t[1]);c=cos(t[1]);
	mat4 m2=mat4(c,0,s,0,0,1,0,0,-s,0,c,0, 0,0,0,1);
	s=sin(t[2]);c=cos(t[2]);
	mat4 m3=mat4(c,-s,0,0,s,c,0,0,0,0,1,0, 0,0,0,1);
	return m3 * m2 * m1;
}
void main(void){
	gl_Position = positionMTX(uPosition) * 
		rotationMTX(uRotation) * 
		scaleMTX(uScale) * 
		vec4(aVertexPosition, 1.0);
	vUV = aUV;
}
</script>
```

```javascript
var lobby = Scene();
var shader = document.getElementById('vshader').text;
lobby.addVertexShader( 'base', shader );

try{
    //중복된 id등록 시도
    lobby.addVertexShader( 'base', shader );
}catch(e){
    console.log(e); //Scene.addVertexShader:0
}

try{
    //적절하지 않은 값을 전달
    lobby.addVertexShader( 'base2', {} );
}catch(e){
    console.log(e); //Scene.addVertexShader:1
}
```

[top](#)
## getChild( id:string )

**description**

id에 해당되는 [Mesh](Mesh.md)를 얻음.

**param**

1. id:string - 등록시 사용한 id.

**return**

[Mesh](Mesh.md) - id에 해당되는 [Mesh](Mesh.md) 인스턴스. 없는 경우에는 null이 반환됨.

**sample**

```javascript
var lobby = world.getScene('lobby');
lobby.addChild( 'frontView', new Camera() );
var frontView = lobby.getChild('frontView');
```

[top](#)
## getGeomtry( id:string )

**description**

id에 해당되는 [Geometry](Geometry.md)를 얻음.

**param**

1. id:string - 등록시 사용한 id. 없는 경우는 null을 반환함.

**return**

[Geometry](Geometry.md) - id에 해당되는 [Geometry](Geometry.md) 인스턴스.

**sample**

```javascript
var cube = world.getScene('lobby').getGeometry('cube');
```

[top](#)
## getMaterial( id:string )

**description**

id에 해당되는 [Material](Material.md)을 얻음.

**param**

1. id:string - 등록시 사용한 id.

**return**

[Material](Material.md) - id에 해당되는 [Material](Material.md) 인스턴스.

**sample**

```javascript
var cube = world.getScene('lobby').getMaterial('white');
```

[top](#)
## getTexture( id:string )

**description**

id에 해당되는 texture 이미지를 얻음.

**param**

1. id:string - 등록시 사용한 id.

**return**

image엘리먼트 - id에 해당되는 image엘리먼트. src는 dataURL로 되어있음.

**sample**

```javascript
var normal = world.getScene('lobby').getTexture('normal');
console.log( normal.src ); //dataURL 형식으로 보여짐.
```

[top](#)
## removeChild( id:string )

**description**

등록된 [Mesh](Mesh.md)를 제거함.

**param**

1. id:string - addChild에서 사용한 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
world.getScene('lobby').removeChild('base');
```

[top](#)
## removeFragmentShader( id:string )

**description**

등록된 fragment shader를 제거함.
* 제거시 scene내에서 해당 shader를 참조하는 [Material](Material.md)과 그 [Material](Material.md)을 소유한 [Mesh](Mesh.md)가 전부 삭제됨.

**param**

1. id:string - addFragmentShader에서 사용한 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
world.getScene('lobby').removeFragmentShader('base');
```

[top](#)
## removeGeometry( id:string )

**description**

등록된 [Geometry](Geometry.md)를 삭제함.
* 삭제시 Scene을 조사하여 해당 [Geometry](Geometry.md)를 참조하는 [Mesh](Mesh.md)도 전부 삭제됨.

**param**

1. id:string - addGeometry에서 사용할 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
var lobby = world.getScene('lobby');
lobby.addGeometry( 'building', new Geometry( v1, i1 ) );
lobby.removeGeometry('building');
```

[top](#)
## removeMaterial( id:string )

**description**

등록된 [Material](Material.md)을 제거함.
* 해당 [Material](Material.md)을 참고하는 Scene내의 모든 [Mesh](Mesh.md)도 제거됨.

**param**

1. id:string - addMaterial에서 사용한 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
world.getScene('lobby').removeCamera('frontView');
```

[top](#)
## removeTexture( id:string )

**description**

등록된 Texture를 제거함.
* 제거시 Scene내의 참조하고 있는 [Material](Material.md)을 전부 삭제하고 삭제된 [Material](Material.md)을 참조하는 [Mesh](Mesh.md)도 일괄삭제됨.

**param**

1. id:string - addTexture에서 사용한 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
world.getScene('lobby').removeTexture('white');
```

[top](#)
## removeVertexShader( id:string )

**description**

등록된 vertex shader를 제거함.
* 제거시 Scene 내의 참조 중인 [Geometry](Geometry.md)와 이 [Geometry](Geometry.md)를 참조하는 [Mesh](Mesh.md)도 일괄 삭제됨.

**param**

1. id:string - addVertextShader에서 사용한 id.

**return**

boolean - 해당 객체가 존재하고 삭제하는데 성공하면 true, 그 외에는 false.

**sample**

```javascript
world.getScene('lobby').removeVertexShader('base');
```

[top](#)
