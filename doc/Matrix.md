#Matrix
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**field**

* [scale](#scale) - scale값을 배열로 반환하거나 입력
* [rotate](#rotate) - rotate값을 배열로 반환하거나 입...
* [raw](#raw) - 현재 매트릭스 객체의 rawData를...
* [position](#position) - x,y,z값을 배열로 반환하거나 입력
* [matrix](#matrix) - 현재 객체내의 position,rot...

**method**

* [matRotateX](#matRotateX) - 현재 매트릭스를 X축 기준 증분 회전...
* [matStr](#matStr) - 현재 매트릭스를 문자화한다.
* [matTranslate](#matTranslate) - 현재매트릭스에 x,y,z축 증분 평행...
* [matRotateZ](#matRotateZ) - 현재 매트릭스를 Z축 기준 증분 회전...
* [matCopy](#matCopy) - 대상 매트릭스에 현재 매트릭스의 상태...
* [matLookAt](#matLookAt) - 
* [matScale](#matScale) - 현재매트릭스에 x,y,z축 증분 확대...
* [matIdentity](#matIdentity) - 현재 매트릭스를 초기화한다.
* [matRotateY](#matRotateY) - 현재 매트릭스를 Y축 기준 증분 회전...
* [matMultiply](#matMultiply) - 현재매트릭스에 대상 매트릭스를 곱한다...
* [matRotate](#matRotate) - 현재 매트릭스를 특정축을 기준으로 증...
* [matPerspective](#matPerspective) - 퍼스펙티브 매트릭스
* [matClone](#matClone) - 현재 매트릭스를 복제
* [lookAt](#lookAt) - 현재매트릭스를 대상지점을 바라보도록...
* [_frustum](#_frustum) - Method of Matrix

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

- 매트릭스 객체로서 사용되며,
- position(x, y, z),
- scale(scaleX, scaleY, scaleZ),
- rotate(rotateX, rotateY, rotateZ)
-  관련된 속성도 포함한다. 

**param**

- none

**exception**

- none

**sample**

```javascript
var mtx = new Matrix()
console.log(mtx.x)
console.log(mtx.position) // [x,y,z]
```

[top](#)

<a name="scale"></a>
###scale

_field_


**description**

- scale값을 배열로 반환하거나 입력

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
var mtx = new Matrix()
mtx.scale = [10,20,30]
console.log(mtx.scale) // [10,20,30]
```

[top](#)

<a name="rotate"></a>
###rotate

_field_


**description**

- rotate값을 배열로 반환하거나 입력

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
var mtx = new Matrix()
mtx.rotate = [10,20,30]
console.log(mtx.rotate) // [10,20,30]
```

[top](#)

<a name="raw"></a>
###raw

_field_


**description**

- 현재 매트릭스 객체의 rawData를 Float32Array 형식으로 반환

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
var mtx = new Matrix()
console.log(mtx.raw)
```

[top](#)

<a name="position"></a>
###position

_field_


**description**

- x,y,z값을 배열로 반환하거나 입력

**setting**

- *writable*:true
- *enumerable*:false
- *configurable*:false

**defaultValue**

- none

**exception**

- none

**sample**

```javascript
var mtx = new Matrix()
mtx.position = [10,20,30]
console.log(mtx.position) // [10,20,30]
```

[top](#)

<a name="matrix"></a>
###matrix

_field_


**description**

- 현재 객체내의 position,rotate,scale을 반영한 후 자신을 반환

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
var mtx = new Matrix()
console.log(mtx.matrix)
```

[top](#)

<a name="matRotateX"></a>
###matRotateX(rad:number)

_method_


**description**

- 현재 매트릭스를 X축 기준 증분 회전 

**param**

1. rad:number - x축 증분 회전 값, radian단위로 입력

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matRotateX(0.3)
```

[top](#)

<a name="matStr"></a>
###matStr()

_method_


**description**

- 현재 매트릭스를 문자화한다.

**param**


**exception**

- none

**return**

- String - 문자화된 매트릭스 raw를 반환

**sample**

```javascript
var mtx = new Matrix()
console.log(mtx.matStr())
```

[top](#)

<a name="matTranslate"></a>
###matTranslate(x:number, y:number, z:number)

_method_


**description**

- 현재매트릭스에 x,y,z축 증분 평행이동 

**param**

1. x:number - x축 증분 이동
2. y:number - y축 증분 이동
3. z:number - z축 증분 이동

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matTranslate(10,20,30)
```

[top](#)

<a name="matRotateZ"></a>
###matRotateZ(rad:number)

_method_


**description**

- 현재 매트릭스를 Z축 기준 증분 회전 

**param**

1. rad:number - z축 증분 회전 값, radian단위로 입력

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matRotateZ(0.3)
```

[top](#)

<a name="matCopy"></a>
###matCopy(matrix:Matrix)

_method_


**description**

- 대상 매트릭스에 현재 매트릭스의 상태를 복사

**param**

1. matrix:Matrix - 복사 대상 매트릭스

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
var mtx2 = new Matrix()
mtx.matClone(mtx2)// mtx2에 mtx의 속성이 복사됨.
```

[top](#)

<a name="matLookAt"></a>
###matLookAt(eye, center, up)

_method_


**description**

- 

**param**

1. eye
2. center
3. up

**exception**

- none

**return**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="matScale"></a>
###matScale(x:number, y:number, z:number)

_method_


**description**

- 현재매트릭스에 x,y,z축 증분 확대 

**param**

1. x:number - x축 증분 확대
2. y:number - y축 증분 확대
3. z:number - z축 증분 확대

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matScale(10,20,30)
```

[top](#)

<a name="matIdentity"></a>
###matIdentity()

_method_


**description**

- 현재 매트릭스를 초기화한다.

**param**


**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matIdentity()
```

[top](#)

<a name="matRotateY"></a>
###matRotateY(rad:number)

_method_


**description**

- 현재 매트릭스를 Y축 기준 증분 회전 

**param**

1. rad:number - y축 증분 회전 값, radian단위로 입력

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matRotateY(0.3)
```

[top](#)

<a name="matMultiply"></a>
###matMultiply(matrix:Matrix)

_method_


**description**

- 현재매트릭스에 대상 매트릭스를 곱한다. 

**param**

1. matrix:Matrix - 곱할 매트릭스

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
var mtx2 = new Matrix()
mtx.matMultiply(mtx2)// mtx에 mtx2를 곱한 결과를 반환
```

[top](#)

<a name="matRotate"></a>
###matRotate(rad:number, axis:Array)

_method_


**description**

- 현재 매트릭스를 특정축을 기준으로 증분 회전 

**param**

1. rad:number - z축 증분 회전 값, radian단위로 입력
2. axis:Array - 기준 회전축을 입력

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matRotate(0.3,[0,1,2])
```

[top](#)

<a name="matPerspective"></a>
###matPerspective(fov:number, aspect:number, near:number, far:number)

_method_


**description**

- 퍼스펙티브 매트릭스

**param**

1. fov:number - 시야각, degree 단위로 입력
2. aspect:number - 가로/세로비율
3. near:number - 절두체의 최소z값, 0.0보다 큰값으로 설정
4. far:number - 절두체의 최대z값

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.matPerspective(55, 4/3,0.1,1000)
```

[top](#)

<a name="matClone"></a>
###matClone()

_method_


**description**

- 현재 매트릭스를 복제

**param**


**exception**

- none

**return**

- Matrix - 복제한 매트릭스를 반환.

**sample**

```javascript
var mtx = new Matrix()
mtx.matClone()
```

[top](#)

<a name="lookAt"></a>
###lookAt(x:number, y:number, z:number)

_method_


**description**

- 현재매트릭스를 대상지점을 바라보도록 변경
- 현재 매트릭스의 rotateX,rotateY,rotateZ, 속성을 자동으로 변경

**param**

1. x:number - 바라볼 x위치
2. y:number - 바라볼 y위치
3. z:number - 바라볼 z위치

**exception**

- none

**return**

- this - 메소드체이닝을 위해 자신을 반환함 - 메서드체이닝을 위해 자신을 반환함.

**sample**

```javascript
var mtx = new Matrix()
mtx.lookAt(0,0,0) // 현재위치에서 0,0,0을 바라보는 상태로 rotateX, rotateY, rotateZ가 변경됨
```

[top](#)

<a name="_frustum"></a>
###_frustum(a, b, c, d, e, g)

_method_


**description**

- Method of Matrix

**param**

1. a
2. b
3. c
4. d
5. e
6. g

**exception**

- none

**return**

- ?

**sample**

```javascript
//none
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
