# Material
* parent : [MoGL](MoGL.md)
* [Constructor](#constructor)

**method**

* [addTexture](#addtexture-typestring-textureidstring-indexint-blendmodestring-)
* [getRefCount](#getrefcount)
* [removeTexture](#removetexture-textureidstring-)
* [setBackgroundColor](#setbackgroundcolor-colorstring-)
* [setEdge](#setedge-pixelint-color-)
* [setLambert](#setlambert-ratenumber-)
* [setShading](#setshading-typefunction-)
* [setWireFrame](#setwireframe-isvisibleboolean-color-)

[top](#)
## Constructor

```javascript
Material( [color:string] )
Material( r:number, g:bumber, b:number, a:number )
```

**description**

모든 재질의 부모가 되는 클래스로 Material 자체는 아무런 빛의 속성을 적용받지 않는 재질임.

* Material의 메서드는 대부분 메서드체이닝을 지원함.

**param**

1. ?color:string - 재질의 기본적인 색상. 생략하면 색상 없음. 다음과 같은 형태가 올 수 있음.
    * '#FFF' - 3자리 16진수의 경우 자동으로 RRGGBB로 해석되고 알파는 1이 됨.
    * '#FFFFFF' - 6자리 16진수의 경우 알파는 1이 됨.
    * '#FFFFFF0.7' - 6자리 16진수 이후 오는 숫자는 알파로 해석되며 0~1사이의 소수가 올 수 있음.
2. r, g, b, a : 각각 0~1 사이의 소수를 받으며 각각 대응함.

**sample**

```javascript
var mat1 = new Material('#f00');
var mat2 = new Material('#ff0000');
var mat3 = new Material('#ff00000.8');
var mat4 = new Material( 0xff/0xff, 0xaf/0xff, 0x45/0xff, 0.5 );

//팩토리함수로도 사용가능
var mat5 = Material('#ff00000.8');
```

[top](#)
## addTexture( type:string, textureId:string[, index:int, blendMode:string] )

**description**

[Mesh](Mesh.md)를 통해 최종적으로 포함될 [Scene](Scene.md)에 등록된 textureId를 사용함. 같은 textureId는 두번 등록되지 않음.
* [Scene](Scene.md)에 직접 등록되는 경우는 id를 [addMaterial](Scene.md#addmaterial-idstring-materialmaterial-)시점에 평가함.
* [Mesh](Mesh.md)에서 직접 생성하여 삽입하는 경우는 [addChild](Scene.md#addchild-idstring-meshmesh-)시점에 평가함.
* 이미 직간접적으로 [Scene](Scene.md)에 포함된 경우는 메서드호출시점에 평가함.

**param**

1. type:string - 해당 텍스쳐가 어떠한 타입에 포함될 것인가를 결정함. 다음의 값이 올 수 있음.
    * [Texture.diffuse](Texture.md#diffuse) or 'diffuse' - 디퓨즈 맵으로 등록함.
    * [Texture.diffuseWrap](Texture.md#diffusewrap) or 'diffuseWrap' - 디퓨즈랩 맵으로 등록함. 디퓨즈랩이란 광원에 의해 명암이 표현될때 특정 램버트 값 이후의 어두운 부분에 적용될 맵임.
    * [Texture.normal](Texture.md#normal) or 'normal' - 노말 맵으로 등록함.
    * [Texture.specular](Texture.md#specular) or 'specular' - 스페큘러 맵으로 등록함.
    * [Texture.specularNormal](Texture.md#specularNormal) or 'diffuse' - 스페큘러노말 맵으로 등록함.
2. textureId:string - 최종 포함될 [Scene](Scene.md)에 등록된 texture의 id.
3. ?index:int - 중첩되는 이미지의 경우 순번을 정의함. 생략하거나 null 이면 마지막 인덱스 + 1. 각 인덱스는 맵의 타입별로 관리됨.
4. ?blendMode:string - 중첩되는 이미지의 경우 아래의 이미지와 합성되는 속성을 정의함. 첫번째 텍스쳐는 적용되지 않고 기본값은 'alpha' 이고 다음과 같은 값이 올 수 있음.
    * [BlendMode.add](BlendMode.md#add) or 'add' -  전면색을 배경색에 더하고 올림값 0xFF를 적용.
    * [BlendMode.alpha](BlendMode.md#alpha) or 'alpha' - 전면색의 알파값에 따라 배경색을 덮어가는 가장 일반적인 중첩.
    * [BlendMode.darken](BlendMode.md#darken) or 'darken' - 전면색과 배경색 중 보다 어두운 색상(값이 작은 색상)을 선택.
    * [BlendMode.difference](BlendMode.md#difference)or 'difference' - 전면색과 배경색을 비교하여 둘 중 밝은 색상 값에서 어두운 색상 값을 뺌.
    * [BlendMode.erase](BlendMode.md#erase) or 'erase' - 전면색의 알파만 적용하여 배경색을 지움.
    * [BlendMode.hardlight](BlendMode.md#hardlight) or 'hardlight' - 전면색의 어두운 정도를 기준으로 배경색을 조정.
    * [BlendMode.invert](BlendMode.md#invert) or 'invert' - 전면색을 이용하여 배경색을 반전시킴.
    * [BlendMode.lighten](BlendMode.md#lighten) or 'lighten' - 전면색과 배경색 중 보다 밝은 색(값이 큰 색상)으로 선택.
    * [BlendMode.multiply](BlendMode.md#multiply) or 'multiply' -  전면색에 배경색을 곱하고 0xFF로 나누어 정규화하여 보다 어두운 색을 만듬.
    * [BlendMode.screen](BlendMode.md#screen) or 'screen' - 전면색의 보수(역수)에 배경색 보수를 곱하여 표백 효과를 냄.
    * [BlendMode.subtract](BlendMode.md#subtract) or 'subtract' - 전면색의 값을 배경색에서 빼고 내림값 0을 적용


**exception**

* 'Material.addTexture:0' - 이미 등록된 경우 [Scene](Scene.md)에 존재하지 않는 textureId를 지정.
* 'Material.addTexture:1' - 이미 등록된 textureId를 다시 등록하려고 시도하는 경우.

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var lobby = world.getScene('lobby');

// 텍스쳐용 이미지 등록
lobby.addTexture( 'floor', document.getElementById('img0') );
lobby.addTexture( 'scratch', document.getElementById('img1') );

// Material 생성 및 Scene에 등록
var mat = lobby.addMaterial( 'floor', new Material()).getMaterial('floor');

try{
    //이미 Scene에 등록된 Material이므로 메서드 호출시점에 평가
    mat.addTexture(Texture.diffuse,'floor1');  //floor1가 존재하지 않으므로 에러발생
}catch(e){
    console.log( e ); // 'Material.addTexture:0'
    mat.addTexture(Texture.diffuse,'floor'); //floor는 존재하므로 문제없음.
}
//다중 texture 등록
mat.addTexture(Texture.diffuse,'scratch', null, BlendMode.multiply );

try{
    //이미 등록된 textureId를 다시 등록하려고 하면 에러발생.
    mat.addTexture(Texture.diffuse,'floor');
}catch(e){
    console.log(e); //'Material.addTexture:1'
}

//미등록된 Material이므로 무조건 통과됨.
var mat1 = new Material('#f00').addTexture(Texture.diffuse,'temp');
```

[top](#)
## getRefCount()

**description**

자신을 참조하고 있는 Mesh의 총수. 참조할 때마다 1씩 증가하고 해당 Mesh가 사라질때마다 감소함.
[MoGL.GC](MoGL.md#GC) 등을 이용하면 참조카운트가 0인 [Material](Material.md)이 일정 시간 이후 자동으로 제거됨.
* 참조카운트의 관리는 개별 인스턴스가 하는 것이 아니라 [Scene](Scene.md)에서 일괄적으로 처리하므로 단순히 [Mesh](Mesh.md)삽입된 것을 카운트로 보는 것이 아니라 [Scene](Scene.md)에 존재하는 [Mesh](Mesh.md)전체의 Material을 검사하여 Count를 체크함.

**param**

없음.

**return**

int - 자신을 참조하고 있는 카운트

**sample**

```javascript
var mat = new Material('#f00').addTexture(Texture.diffuse,'temp');
mat.getRefCount() == 0 //생성시점에 0

var mesh1 = new Mesh( 'cube', mat );
mat.getRefCount() == 0 //메시에 넣었으나 아직 메시가 장면에 추가되지 않음

world.getScene('lobby').addChild( 'box1', mesh1 );
mat.getRefCount() == 1 //메시가 장면에 추가되었으므로 1

world.getScene('lobby').addChild( 'box2', new Mesh( 'cube', mat ) );
mat.getRefCount() == 2 //또 추가되므로 2

world.getScene('lobby').removeChild( 'box1' );
mat.getRefCount() == 1 //1개를 제거했으므로 1
```

[top](#)
## removeTexture( textureId:string )

**description**

addTexture를 통해 등록된 텍스쳐를 제거함.

**param**

없음

**return**

this - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mat1 = new Material('#f00').addTexture(Texture.diffuse,'temp');
mat.removeTexture('temp');
```

[top](#)
## setBackgroundColor( color:string )
└ setBackgroundColor( r:number, g:bumber, b:number, a:number )

**description**

배경색을 변경함.

**param**

1. color:string - 재질의 기본적인 색상. 생략하면 색상 없음. 다음과 같은 형태가 올 수 있음.
    * '#FFF' - 3자리 16진수의 경우 자동으로 RRGGBB로 해석되고 알파는 1이 됨.
    * '#FFFFFF' - 6자리 16진수의 경우 알파는 1이 됨.
    * '#FFFFFF0.7' - 6자리 16진수 이후 오는 숫자는 알파로 해석되며 0~1사이의 소수가 올 수 있음.
2. r, g, b, a : 각각 0~1 사이의 소수를 받으며 각각 대응함.

**sample**

```javascript
var mat = new Material()
mat.setBackgroundColor('#f00');
mat.setBackgroundColor('#ff0000');
mat.setBackgroundColor('#ff00000.8');
mat.setBackgroundColor( 0xff/0xff, 0xaf/0xff, 0x45/0xff, 0.5 );
```

[top](#)
## setEdge( pixel:int[, color:*] )

**description**

외곽선에 대한 타입을 지정함. 기본값은 0으로 자연스러운 외곽선을 만듬.
만약 특정 픽셀의 두께를 원하는 경우 픽셀값을 지정하고 옵션으로 색상도 정의할 수 있음. 색상의 기본값은 검정색임.

**param**

1. pixel:int - 기본값은 0. 외곽선의 픽셀두께를 정의함.
2. ?color:* - setBackgroundColor와 마찬가지 형식의 컬러. 기본값은 검정.

**sample**

```javascript
var mat = new Material()
mat.setEdge( 1, '#f00' );
```

[top](#)
## setLambert( rate:number )

**description**

원래 계산되는 명암비율을 1로 봤을 때 level을 적용하여 rate를 곱해줌.
* 0.5를 넣으면 기존보다 덜 어둡게 되는 효과가 발생하고
* 1.5를 넣으면 보다 어둡게 되는 효과가 발생함.
* diffuseWrap 등의 맵과 효과적으로 매칭하여 입체적인 명암을 만들 수 있음.

**param**

1. rate:number - 원래 계산된 램버트명암에 곱해질 값. 기본값은 1.

**sample**

```javascript
var mat = new Material();
mat.setLambert( 0.5 );
```

[top](#)
## setShading( type:function )

**description**

재질에 적용될 빛에 대한 명암처리방식을 선택한다. 기본값은 빛에 반응하지 않는 상태인 [Shading.none](Shading.md#none)임.

**param**

1. type:function - 빛이 반영되는 타입. 이를 처리하는 함수를 인자로 받음.
    * [Shading.none](Shading.md#none) - 기본값으로 빛에 반응하지 않음.
    * [Shading.gouraud](Shading.md#none) - 고우라우드쉐이딩을 적용함.
    * [Shading.phong](Shading.md#none) - 퐁쉐이딩을 적용함.
    * [Shading.blinn](Shading.md#none) - 블린퐁쉐이딩을 적용함.
    * [Shading.flat](Shading.md#none) - 플랫쉐이딩을 적용함.
    * [Shading.toon](Shading.md#none) - 카툰쉐이딩을 적용함.

**sample**

```javascript
var mat = new Material();
mat.setShading( Shading.phong );
```

[top](#)
## setWireFrame( isVisible:boolean[, color:*] )

**description**

와이어프레임을 보일지 말지 결정함. 기본값은 false.
색상은 생략시 랜덤으로 적용됨.

**param**

1. isVisible:boolean - 와이어프레임표시여부.
2. ?color:* - setBackgroundColor와 마찬가지 형식의 컬러값.

**sample**

```javascript
var mat = new Material()
mat.setWireFrame( true );
```

