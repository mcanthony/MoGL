#Texture
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [resizeType](#resizeType) - resize type get/set...
* [isLoaded](#isLoaded) - Load check field.
* [img](#img) - Image get/set field.

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

**constant**

* [zoomOut](#zoomOut) - zoom out constant
* [zoomIn](#zoomIn) - zoom in constant
* [specularNormal](#specularNormal) - specularNormal const...
* [specular](#specular) - specular constant
* [normal](#normal) - normal constant
* [diffuseWrap](#diffuseWrap) - diffuseWrap constant
* [diffuse](#diffuse) - diffuse constant
* [crop](#crop) - crop constant
* [addSpace](#addSpace) - addSpace constant

**event**

* [load](#load) - load event

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 텍스쳐 객체 클래스

**param**

none

**exception**

- none

**sample**

```javascript
var texture = new Texture();
```

[top](#)

<a name="resizeType"></a>
###resizeType

_field_


**description**


- resize type get/set field.

**setting**

- *writable*:true
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- null

**exception**


- none

**sample**

```javascript
var texture = new Texture();
texture.resizeType = Texture.zoomIn;
console.log(texture.resizeType);
```

[top](#)

<a name="isLoaded"></a>
###isLoaded

_field_


**description**


- Load check field.

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- null

**exception**


- none

**sample**

```javascript
var texture = new Texture();
texture.img = document.getElementID("imgElement");
console.log(texture.isLoaded);
```

[top](#)

<a name="img"></a>
###img

_field_


**description**


- Image get/set field.

**setting**

- *writable*:true
-  *enumerable*:false
-  *configurable*:false

**defaultValue**


- null

**exception**


- none

**sample**

```javascript
var texture = new Texture();
texture.img = document.getElementID("imgElement");
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
var instance = Mesh.getInstance(uuid);
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

<a name="zoomOut"></a>
###zoomOut

_const_


**description**


- zoom out constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- zoomOut

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.zoomOut;
```

[top](#)

<a name="zoomIn"></a>
###zoomIn

_const_


**description**


- zoom in constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- zoomIn

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.zoomIn;
```

[top](#)

<a name="specularNormal"></a>
###specularNormal

_const_


**description**


- specularNormal constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- specularNormal

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.specularNormal;
```

[top](#)

<a name="specular"></a>
###specular

_const_


**description**


- specular constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- specular

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.specular;
```

[top](#)

<a name="normal"></a>
###normal

_const_


**description**


- normal constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- normal

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.normal;
```

[top](#)

<a name="diffuseWrap"></a>
###diffuseWrap

_const_


**description**


- diffuseWrap constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- diffuseWrap

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.diffuseWrap;
```

[top](#)

<a name="diffuse"></a>
###diffuse

_const_


**description**


- diffuse constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- diffuse

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.diffuse;
```

[top](#)

<a name="crop"></a>
###crop

_const_


**description**


- crop constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- crop

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.crop;
```

[top](#)

<a name="addSpace"></a>
###addSpace

_const_


**description**


- addSpace constant

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- addSpace

**exception**


- none

**sample**

```javascript
var texture = new Texture();
// 리사이즈 타입 설정
texture.resizeType = Texture.addSpace;
```

[top](#)

<a name="load"></a>
###load

_event_


**description**


- load event

**setting**

- *writable*:false
-  *enumerable*:false
-  *configurable*:false

**value**


- load

**exception**


- none

**sample**

```javascript
//none
```

[top](#)