#Texture
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [resizeType](#resizeType) - resize type get/set...
* [isLoaded](#isLoaded) - Load check field.
* [img](#img) - Image get/set field.

**static**

* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...

**constant**

* [zoomOut](#zoomOut) - texture.img에 지정될 이미지...
* [zoomIn](#zoomIn) - texture.img에 지정될 이미지...
* [crop](#crop) - texture.img에 지정될 이미지...
* [addSpace](#addSpace) - texture.img에 지정될 이미지...
* [diffuse](#diffuse) - 일반적으로 표면에 입혀지는 텍스쳐를...
* [specular](#specular) - 표면에서 빛에 직접적으로 반사되는 면...
* [diffuseWrap](#diffuseWrap) - 빛에 의한 음영을 표현할 때 음영에...
* [normal](#normal) - 표면의 울퉁불퉁한 부분을 표현하기 위...
* [specularNormal](#specularNormal) - diffuse에 대해 normal이...

**event**

* [load](#load) - Texture에 img지정된 이미지가...

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 텍스쳐 객체 클래스

**param**

1. ?img:* - texture.img를 초기화할 수 있는 이미지
2. ?resizeType:string - 이미지의 리사이즈타입

**exception**

- none

**sample**

```javascript
var texture0 = new Texture();
var texture1 = new Texture(document.getElementById('txt1'));
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
texture.img = document.getElementById("imgElement");
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
texture.img = document.getElementById("imgElement");
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

<a name="zoomOut"></a>
###zoomOut

_const_


**description**


- texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 수에 축소하여 맞춤

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
texture.resizeType = Texture.zoomOut;
texture.img = document.getElementById("img1"); //2000 → 1024
```

[top](#)

<a name="zoomIn"></a>
###zoomIn

_const_


**description**


- texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 수에 확대하여 맞춤

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
texture.resizeType = Texture.zoomIn;
texture.img = document.getElementById("img1"); //2000 → 2048
```

[top](#)

<a name="crop"></a>
###crop

_const_


**description**


- texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 작은 수에 맞춰 자름

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
texture.resizeType = Texture.crop;
texture.img = document.getElementById("img1"); //2000 → 1024로 좌상단기준으로 잘림
```

[top](#)

<a name="addSpace"></a>
###addSpace

_const_


**description**


- texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 큰 수에 맞춰 공백을 넣음

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
texture.resizeType = Texture.addSpace;
texture.img = document.getElementById("img1"); //2000 → 2048로 우하단이 공백으로 늘어남
```

[top](#)

<a name="diffuse"></a>
###diffuse

_const_


**description**


- 일반적으로 표면에 입혀지는 텍스쳐를 의미함
Material의 addTexture에서 diffuse타입으로 Texture를 등록할 때 사용

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
var material = new Material("#fff");
material.addTexture(Texture.diffuse, texture);
```

[top](#)

<a name="specular"></a>
###specular

_const_


**description**


- 표면에서 빛에 직접적으로 반사되는 면을 표현하는 텍스쳐
Material의 addTexture에서 specular타입으로 Texture를 등록할 때 사용

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
var material = new Material("#fff");
material.addTexture(Texture.specular, texture);
```

[top](#)

<a name="diffuseWrap"></a>
###diffuseWrap

_const_


**description**


- 빛에 의한 음영을 표현할 때 음영에 해당되는 색상을 직접 이미지에서 지정하는 텍스쳐
Material의 addTexture에서 diffuseWrap타입으로 Texture를 등록할 때 사용

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
var material = new Material("#fff");
material.addTexture(Texture.diffuseWrap, texture);
```

[top](#)

<a name="normal"></a>
###normal

_const_


**description**


- 표면의 울퉁불퉁한 부분을 표현하기 위해 사용하는 텍스쳐
Material의 addTexture에서 normal타입으로 Texture를 등록할 때 사용

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
var material = new Material("#fff");
material.addTexture(Texture.normal, texture);
```

[top](#)

<a name="specularNormal"></a>
###specularNormal

_const_


**description**


- diffuse에 대해 normal이 있듯이 specular도 울퉁불퉁한 면을 표현하려는 경우 사용
Material의 addTexture에서 specularNormal타입으로 Texture를 등록할 때 사용

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
var material = new Material("#fff");
material.addTexture(Texture.specularNormal, texture);
```

[top](#)

<a name="load"></a>
###load

_event_


**description**


- Texture에 img지정된 이미지가 로딩완료시 발생함. 이미 로딩이 완료된 이미지인 경우는 img지정시 즉시 발생함.
* 리스너에게는 아무런 인자도 전달되지 않음

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
var tex = new Texture();
tex.addEventListener(Texture.load, function(){
    //로딩완료!
});
tex.img = document.getElementById("img1");
```

[top](#)
