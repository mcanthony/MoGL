#MoGL
* [constructor](#constructor)


**field**

* [uuid](#uuid) - 현재 인스턴스의 고유한 uuid
* [isUpdated](#isUpdated) - 현재 인스턴스의 업데이트여부를 관리하...
* [id](#id) - 사용자가 임의로 정의한 id
* [className](#className) - 인스턴스의 클래스이름
* [classId](#classId) - 인스턴스의 클래스uuid

**method**

* [toString](#toString) - MoGL을 상속하는 모든 인스턴스는...
* [setProperties](#setProperties) - vo로 넘어온 속성을 일시에 설정함...
* [setId](#setId) - id는 본래 속성값이나 메서드체이닝목...
* [removeEventListener](#removeEventListener) - 해당 이벤트에 리스너를 제거함
* [error](#error) - MoGL 표준 예외처리를 함
주어진...
* [dispatch](#dispatch) - 해당 event의 리스너들에게 이벤트...
* [destroy](#destroy) - 해당 event의 리스너들에게 이벤트...
* [addEventListener](#addEventListener) - 해당 이벤트에 리스너를 추가함

**static**

* [totalCount](#totalCount) - 전체 인스턴스의 수를 반환함
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [classes](#classes) - MoGL로 생성된 모든 서브클래스를...

**constant**

* [ease](#ease) - setProperties의 애니메이션...

**event**

* [updated](#updated) - isUpdated 속성이 변경될 때마...
* [propertyChanged](#propertyChanged) - setProperties 호출시 설정...

[top](#)

<a name="constructor"></a>
##Constructor

**description**

MoGL 라이브러리의 모든 클래스는 MoGL을 상속함
* 보통 직접적으로 MoGL 클래스를 사용하는 경우는 없음

**param**

none

**exception**

none

**sample**

```javascript
var instance = new MoGL();
```

[top](#)

<a name="uuid"></a>
###uuid

_field_


**description**

현재 인스턴스의 고유한 uuid

**setting**

*writable*:undefined, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
var scene = new Scene();
scene.uuid // 'uuid:24'
```

[top](#)

<a name="isUpdated"></a>
###isUpdated

_field_


**description**

현재 인스턴스의 업데이트여부를 관리하는 플래그
* 상태가 바뀌면 MoGL.updated 이벤트가 발생함

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

false

**sample**

```javascript
var scene = new Scene();
scene.addEventListener( 'updated', function(v){
  console.log(v); //2. 리스너가 발동함 - true
} );
console.log( scene.isUpdated ); //false
scene.isUpdated = true; //1. 값을 바꾸면
```

[top](#)

<a name="id"></a>
###id

_field_


**description**

사용자가 임의로 정의한 id

**setting**

*writable*:true, *enumerable*:false, *configurable*:false

**defaultValue**

null

**sample**

```javascript
var scene = new Scene();
scene.id = 'test1';
console.log( scene.id ); //'test1'
```

[top](#)

<a name="className"></a>
###className

_field_


**description**

인스턴스의 클래스이름

**setting**

*writable*:undefined, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
var scene = new Scene();
scene.className // 'Scene'
```

[top](#)

<a name="classId"></a>
###classId

_field_


**description**

인스턴스의 클래스uuid

**setting**

*writable*:undefined, *enumerable*:false, *configurable*:false

**defaultValue**

none

**sample**

```javascript
var scene = new Scene();
scene.classId // 'uuid:22'
```

[top](#)

<a name="toString"></a>
###toString()

_method_


**description**

MoGL을 상속하는 모든 인스턴스는 toString상황에서 'uuid:고유번호' 형태의 문자열을 반환함

**param**

none

**exception**


**return**

string - this - 메소드체이닝을 위해 자신을 반환함.uuid에 해당되는 'uuid:고유번호' 형태의 문자열

**sample**

```javascript
var mat = new Matrix();
console.log( mat + '' ); // 'uuid:22'
```

[top](#)

<a name="setProperties"></a>
###setProperties(vo:Object)

_method_


**description**

vo로 넘어온 속성을 일시에 설정함
* vo에 MoGL.time이 포함되면 애니메이션으로 간주하여 보간애니메이션으로 처리됨

**param**

1. vo:Object

**exception**

none

**return**

this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var mat = Matrix();
//즉시반영
mat.setProperties( {x:10, y:20, z:30} );

//보간애니메이션실행
var vo = {x:0, y:0, z:0};
var ani = {time:1, delay:2, repeat:1, ease:MoGL.easing.sineOut}
mat.setProperties( vo, ani );
```

[top](#)

<a name="setId"></a>
###setId(id:string)

_method_


**description**

id는 본래 속성값이나 메서드체이닝목적으로 사용하는 경우 setId를 쓰면 편리함

**param**

1. id:string

**exception**

none

**return**

this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var city1 = Scene().setId('city1');
```

[top](#)

<a name="removeEventListener"></a>
###removeEventListener(event:string, ?listener:string or function)

_method_


**description**

해당 이벤트에 리스너를 제거함

**param**

1. event:string
2. ?listener:string or function

**exception**

none

**return**

this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
scene.removeEventListener(MoGL.updated, listener);
```

[top](#)

<a name="error"></a>
###error(id:int)

_method_


**description**

MoGL 표준 예외처리를 함
주어진 인자에 따라 className + '.' + methodName + ':' + id 형태로 예외메세지가 출력됨
클래스의 메서드 내에서 사용함

**param**

1. id:int

**exception**


**return**

Object - 인자로보낸 context 또는 생략시 임의로 생성된 오브젝트

**sample**

```javascript
fn.action = function(a){
  if(!a) this.error(0);
}
```

[top](#)

<a name="dispatch"></a>
###dispatch(event:string, ?...arg)

_method_


**description**

해당 event의 리스너들에게 이벤트를 통지함. 추가인자를 기술하면 그 인자도 전달됨

**param**

1. event:string
2. ?...arg

**exception**

none

**return**

this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var scene = new Scene();
city1.dispatch( 'updated', city.isUpdated );
```

[top](#)

<a name="destroy"></a>
###destroy()

_method_


**description**

해당 event의 리스너들에게 이벤트를 통지함. 추가인자를 기술하면 그 인자도 전달됨

**param**

none

**exception**

none

**return**

none

**sample**

```javascript
var city1 = Scene();
city1.destroy();
```

[top](#)

<a name="addEventListener"></a>
###addEventListener(event:string, listener:function, ?context:*, ?...arg)

_method_


**description**

해당 이벤트에 리스너를 추가함

**param**

1. event:string
2. listener:function
3. ?context:*
4. ?...arg

**exception**

none

**return**

this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var city1 = Scene();
city1.addEventListener( 'updated', function(v){
  console.log(v);
});
var city2 = Scene();
city1.addEventListener( 'updated', function(v, added){
  this == city2
  added == 10
}, city2, 10);
```

[top](#)

<a name="totalCount"></a>
###totalCount()

_static_


**description**

전체 인스턴스의 수를 반환함

**param**

none

**exception**

none

**return**

int - 활성화된 인스턴스의 수

**sample**

```javascript
console.log( MoGL.count() );
```

[top](#)

<a name="getMD"></a>
###getMD()

_static_


**description**

해당 클래스를 마크다운 형식으로 문서화하여 출력함

**param**

none

**exception**

none

**return**

string - 클래스에 대한 문서 마크다운

**sample**

```javascript
//none
```

[top](#)

<a name="getInstance"></a>
###getInstance(uuid:string)

_static_


**description**

uuid 또는 id를 기반으로 인스턴스를 얻어냄

**param**

1. uuid:string

**exception**

undefined.getInstance:u

**return**

Object - 해당되는 인스턴스

**sample**

```javascript
//none
```

[top](#)

<a name="extend"></a>
###extend(className:string, constructor:function)

_static_


**description**

이 클래스를 상속하는 자식클래스를 만들 수 있는 정의자(Defineder)를 얻음

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

1. className:string
2. constructor:function

**exception**

none

**return**

Defineder - 클래스를 정의할 수 있는 생성전용객체

**sample**

```javascript
//none
```

[top](#)

<a name="error"></a>
###error(method:string, id:int)

_static_


**description**

정적함수에서 표준화된 예외를 처리함(정적함수 내부에서 사용)

**param**

1. method:string
2. id:int

**exception**

none

**return**

none

**sample**

```javascript
//none
```

[top](#)

<a name="count"></a>
###count()

_static_


**description**

이 클래스로 부터 만들어져 활성화된 인스턴스의 수

**param**

none

**exception**

none

**return**

int - 활성화된 인스턴스의 수

**sample**

```javascript
//none
```

[top](#)

<a name="classes"></a>
###classes(context:Object)

_static_


**description**

MoGL로 생성된 모든 서브클래스를 해당 객체에 키로 복사함
* new MoGL.Mesh 등의 코드가 길고 귀찮은 경우 임의의 네임스페이스나 window에 복사하는 기능

**param**

1. context:Object

**exception**

none

**return**

Object - 인자로보낸 context 또는 생략시 임의로 생성된 오브젝트

**sample**

```javascript
//특정객체로 복사
var $ = MoGL.classes();
var scene = new $.Scene();

//전역에 복사
MoGL.classes(window);
var scene = new Scene();
```

[top](#)

<a name="ease"></a>
###ease

_const_


**description**

setProperties의 애니메이션에 사용될 보간함수
다음과 같은 값이 올 수 있음
* MoGL.ease.linear
* MoGL.ease.backIn
* MoGL.ease.backOut
* MoGL.ease.backInOut
* MoGL.ease.bounceOut
* MoGL.ease.sineIn
* MoGL.ease.sineOut
* MoGL.ease.sineInOut
* MoGL.ease.circleIn
* MoGL.ease.circleOut
* MoGL.ease.circleInOut
* MoGL.ease.quadraticIn
* MoGL.ease.quadraticOut

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

[object Object]

**sample**

```javascript
var mat = new Matrix();
mat.setProperties({x:50}, {time:1, ease:MoGL.ease.sineOut});
```

[top](#)

<a name="updated"></a>
###updated

_event_


**description**

isUpdated 속성이 변경될 때마다 발생함
* 리스너에는 첫 번째 인자로 현재의 isUpdated상태가 주어짐

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

updated

**sample**

```javascript
var scene = new Scene();
scene.addEventListener( MoGL.updated, function(v){
  console.log(v);
} );
```

[top](#)

<a name="propertyChanged"></a>
###propertyChanged

_event_


**description**

setProperties 호출시 설정이 완료되면 발생함
* 애니메이션인 경우는 애니메이션 완료 후 발생
* 리스너에 주어지는 인자는 없음

**setting**

*writable*:false, *enumerable*:false, *configurable*:false

**value**

propertyChanged

**sample**

```javascript
var mat = new Matrix();
mat.addEventListener( MoGL.propertyChanged, function(){
  console.log('changed');
} );
mat.setProperties({x:50}, {time:1});
```

[top](#)
