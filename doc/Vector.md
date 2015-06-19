#Vector
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**method**

* [subtractXYZ](#subtractXYZ) - 현재 Vector 객체의 x, y 및...
* [subtract](#subtract) - 현재 Vector 객체의 x, y 및...
* [scaleBy](#scaleBy) - 현재 Vector 객체의 크기를 스칼...
* [normalize](#normalize) - 현재 Vector의 단위벡터화된 길이...
* [negate](#negate) - 현재 Vector 객체를 역수로 설정...
* [dot](#dot) - 내적값 반환
* [distance](#distance) - 현재 벡터와 대상 벡터 객체 사이의...
* [cross](#cross) - 두벡터에 수직인 벡터를 반환
* [addXYZ](#addXYZ) - 현재 Vector 객체의 x, y 및...
* [add](#add) - 현재 Vector 객체의 x, y 및...

**static**

* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- 벡터3D 클래스

**param**

- x:number, y:number, z:number - 벡터 초기값을 넘버형으로 입력할 수 있음
- [x,y,z]:Array - 첫번째 인자에 배열(Float32Array or Array)형태로 입력 할 수 있음
- 인자가 없을경우 0,0,0으로 초기화

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="subtractXYZ"></a>
###subtractXYZ(x:number, y:number, z:number)

_method_


**description**

- 현재 Vector 객체의 x, y 및 z 요소 값을 다른 인자 x, y ,z 요소 값에서 뺍니다.

**param**

1. x:number - x값
2. y:number - y값
3. z:number - z값

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
vec1.subtractXYZ(10,20,30)
```

[top](#)

<a name="subtract"></a>
###subtract(vector:Vector)

_method_


**description**

- 현재 Vector 객체의 x, y 및 z 요소 값을 다른 Vector 객체의 x, y 및 z 요소 값에서 뺍니다.

**param**

1. vector:Vector

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
var vec2 = new Vector()
vec1.subtract(vec2)
```

[top](#)

<a name="scaleBy"></a>
###scaleBy(scale:number)

_method_


**description**

- 현재 Vector 객체의 크기를 스칼라 값만큼 조절합니다.

**param**

1. scale:number - scale값

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
vec1.scaleBy(10)
```

[top](#)

<a name="normalize"></a>
###normalize()

_method_


**description**

- 현재 Vector의 단위벡터화된 길이입니다.

**param**


**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
vec1.normalize()
```

[top](#)

<a name="negate"></a>
###negate(vector:Vector)

_method_


**description**

- 현재 Vector 객체를 역수로 설정합니다.

**param**

1. vector:Vector

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
vec1.negate()
```

[top](#)

<a name="dot"></a>
###dot(vector:Vector)

_method_


**description**

- 내적값 반환

**param**

1. vector:Vector

**exception**

- none

**return**

- number

**sample**

```javascript
var vec1 = new Vector()
var vec2 = new Vector()
vec1.dot(vec2)
```

[top](#)

<a name="distance"></a>
###distance(vector:Vector)

_method_


**description**

- 현재 벡터와 대상 벡터 객체 사이의 거리를 반환합니다.

**param**

1. vector:Vector

**exception**

- none

**return**

- number

**sample**

```javascript
var vec1 = new Vector()
var vec2 = new Vector()
vec1.distance(vec2)
```

[top](#)

<a name="cross"></a>
###cross(vector:Vector)

_method_


**description**

- 두벡터에 수직인 벡터를 반환

**param**

1. vector:Vector

**exception**

- none

**return**

- Vector

**sample**

```javascript
var vec1 = new Vector()
var vec2 = new Vector()
vec1.cross(vec2)
```

[top](#)

<a name="addXYZ"></a>
###addXYZ(x:number, y:number, z:number)

_method_


**description**

- 현재 Vector 객체의 x, y 및 z 요소 값에 인자 x,y,z값을 더합니다.

**param**

1. x:number - x값
2. y:number - y값
3. z:number - z값

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
vec1.addXYZ(10,20,30)
```

[top](#)

<a name="add"></a>
###add(vector:Vector)

_method_


**description**

- 현재 Vector 객체의 x, y 및 z 요소 값에 대상 객체의 x,y,z값을 더합니다

**param**

1. vector:Vector

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함

**sample**

```javascript
var vec1 = new Vector()
var vec2 = new Vector()
vec1.add(vec2)
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
- 
**Defineder class의 메소드**

- * 각 메서드는 체이닝됨
- * Matrix = MoGL.extend('Matrix', function(){..}).static(..).field(..).build(); 형태로 사용
- * field('x',{value:30}) - 속성을 정의함
- * method('rotate',{value:function(){}}) - 메서드를 정의함
- * constant('normalX',{value:'normalX'}) - 상수를 정의함
- * event('updated',{value:'updated'}) - 이벤트를 정의함
- * static('toString',{value:function(){}}) - 정적메서드를 정의함
- * build() - 입력된 결과를 종합하여 클래스를 생성함

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
