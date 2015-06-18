#Material
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [wireFrameColor](#wireFrameColor) - 와이어 프레임 컬러
* [wireFrame](#wireFrame) - 와이어 프레임 표현여부
* [shading](#shading) - 재질 쉐이딩 적용
* [lambert](#lambert) - 재질 쉐이딩 적용 강도 설정
* [isLoaded](#isLoaded) - 재질에 적용된 텍스쳐들이 모두 로딩되...
* [diffuse](#diffuse) - 재질에 적용된 디퓨즈 리스트 반환
* [count](#count) - 재질이 사용된 횟수
* [color](#color) - 재질 컬러색

**method**

* [removeTexture](#removeTexture) - removeTexture를 통해 등록...
* [addTexture](#addTexture) - [Mesh](Mesh.md)를 통해...

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**event**

* [changed](#changed) - Event of Material

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 모든 재질의 부모가 되는 클래스로 Material 자체는 아무런 빛의 속성을 적용받지 않는 재질임.
* Material의 메서드는 대부분 메서드체이닝을 지원함.

**param**

- ?color:string - 재질의 기본적인 색상. 생략하면 색상 없음. 다음과 같은 형태가 올 수 있음.
r, g, b, a : 각각 0~1 사이의 소수를 받으며 각각 대응함.

**exception**

- none

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

<a name="wireFrameColor"></a>
###wireFrameColor

_field_


**description**

- 와이어 프레임 컬러

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- [Math.random(),Math.random(),Math.random(),1]

**exception**

- none

**sample**

```javascript
material.wireFrameColor = [1,0.5,1,1] // r,g,b,a
console.log(material.wireFrameColor)
```

[top](#)

<a name="wireFrame"></a>
###wireFrame

_field_


**description**

- 와이어 프레임 표현여부

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
material.wireFrame = true
console.log(material.wireFrame)
```

[top](#)

<a name="shading"></a>
###shading

_field_


**description**

- 재질 쉐이딩 적용

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- Shading.none

**exception**

- none

**sample**

```javascript
material.shading = Shading.phong
console.log(material.shading)
```

[top](#)

<a name="lambert"></a>
###lambert

_field_


**description**

- 재질 쉐이딩 적용 강도 설정

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- 1.0

**exception**

- none

**sample**

```javascript
material.lambert = 1.5
console.log(material.lambert)
```

[top](#)

<a name="isLoaded"></a>
###isLoaded

_field_


**description**

- 재질에 적용된 텍스쳐들이 모두 로딩되었는지 확인

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
console.log(material.isLoaded)
```

[top](#)

<a name="diffuse"></a>
###diffuse

_field_


**description**

- 재질에 적용된 디퓨즈 리스트 반환

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**defaultValue**

- []

**exception**

- none

**sample**

```javascript
console.log(material.diffuse)
```

[top](#)

<a name="count"></a>
###count

_field_


**description**

- 재질이 사용된 횟수

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
// 미구현상태임
console.log(material.count)
```

[top](#)

<a name="color"></a>
###color

_field_


**description**

- 재질 컬러색

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- [1,1,1,1]

**exception**

- none

**sample**

```javascript
material.color = [0,1,2,1] // 배열형식으로 입력
material.color = "#ff2233 // 16진수로 입력"
console.log(material.color)
```

[top](#)

<a name="removeTexture"></a>
###removeTexture(type:string, [Texture](Texture.md))

_method_


**description**

- removeTexture를 통해 등록된 텍스쳐를 제거함.

**param**

1. type:string - 어떠한 타입에 텍스쳐가 제거 될 것인가를 결정함.
    * [Texture.diffuse](Texture.md#diffuse) or 'diffuse' - 디퓨즈 맵으로 등록함.
    * [Texture.specular](Texture.md#specular) or 'specular' - 스페큘러 맵으로 등록함.
    * [Texture.diffuseWrap](Texture.md#diffusewrap) or 'diffuseWrap' - 디퓨즈랩 맵으로 등록함.
    * [Texture.normal](Texture.md#normal) or 'normal' - 노말 맵으로 등록함.
    * [Texture.specularNormal](Texture.md#specularNormal) or 'diffuse' - 스페큘러노말 맵으로 등록함.
7. [Texture](Texture.md) - 제거 될 Texture instance.

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
material.addTexture(Texture.diffuse, indexTexture3, null, BlendMode.darken);
material.removeTexture(Texture.diffuse, indexTexture3);
```

[top](#)

<a name="addTexture"></a>
###addTexture(type:string, [Texture](Texture.md), index:int or [Texture](Texture.md), ?blendMode:string)

_method_


**description**

- [Mesh](Mesh.md)를 통해 최종적으로 포함될 Texture를 등록
* [Scene](Scene.md)에 직접 등록되는 경우는 id를 [addMaterial](Scene.md#addmaterial-idstring-materialmaterial-)시점에 평가함.
* [Mesh](Mesh.md)에서 직접 생성하여 삽입하는 경우는 [addChild](Scene.md#addchild-idstring-meshmesh-)시점에 평가함.
* 이미 직간접적으로 [Scene](Scene.md)에 포함된 경우는 메서드호출시점에 평가함.

**param**

1. type:string - 해당 텍스쳐가 어떠한 타입에 포함될 것인가를 결정함. 다음의 값이 올 수 있음.
    * [Texture.diffuse](Texture.md#diffuse) or 'diffuse' - 디퓨즈 맵으로 등록함.
    * [Texture.specular](Texture.md#specular) or 'specular' - 스페큘러 맵으로 등록함.
    * [Texture.diffuseWrap](Texture.md#diffusewrap) or 'diffuseWrap' - 디퓨즈랩 맵으로 등록함.
    * [Texture.normal](Texture.md#normal) or 'normal' - 노말 맵으로 등록함.
    * [Texture.specularNormal](Texture.md#specularNormal) or 'diffuse' - 스페큘러노말 맵으로 등록함.
7. [Texture](Texture.md) - 추가 될 Texture instance.
8. index:int or [Texture](Texture.md) - 중첩되는 이미지의 경우 순번을 정의함. 생략하거나 null 이면 마지막 인덱스 + 1.
9. ?blendMode:string - 중첩되는 이미지의 경우 아래의 이미지와 합성되는 속성을 정의함. 첫번째 텍스쳐는 적용되지 않고 기본값은 'alpha' 이고 다음과 같은 값이 올 수 있음.
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
    * [BlendMode.subtract](BlendMode.md#subtract) or 'subtract' - 전면색의 값을 배경색에서 빼고 내림값 0을

**exception**

- * 'Material.addTexture:0' - 1번째 param 값이 Texture 타입이 아닐 경우.
- * 'Material.addTexture:1' - 2번째 param 값이 Texture 인스턴스가 아닐 경우.
- * 'Material.addTexture:2' - 2번째 param 값이 이미 등록 되어있는 Texture 일 경우.
- * 'Material.addTexture:3' - 3번째 param 값이 index:int or Texture 외 다른 형식이 들어오는 경우.
- * 'Material.addTexture:4' - 3번째 param 값이 index:int 일 경우 0 보다 작거나 등록되어 있는 Texture 수보다 많을 경우.
- * 'Material.addTexture:5' - 3번째 param 값이 Texture 일 경우 미리 등록된 Texture 가 아닐 경우.

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var indexTestMaterial = Material('#ffffff127.8');

var indexTexture1 = new Texture();
indexTestMaterial.addTexture(Texture.diffuse, indexTexture1, null, BlendMode.add);

var indexTexture2 = new Texture()
indexTestMaterial.addTexture(Texture.diffuse, indexTexture2, undefined, BlendMode.screen);

var indexTexture3 = new Texture()
indexTestMaterial.addTexture(Texture.diffuse, indexTexture3, 1, BlendMode.darken)

var indexTexture4 = new Texture()
indexTestMaterial.addTexture(Texture.diffuse, indexTexture4)

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

<a name="changed"></a>
###changed

_event_


**description**

- Event of Material

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

changed

**exception**

- none

**sample**

```javascript
//none
```

[top](#)
