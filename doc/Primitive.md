#Primitive
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**static**

* [skybox](#skybox) - 3차원 배경이 되어주는 큐브 형태의...
* [plane](#plane) - 면을 나타내는 Geometry 객체...
* [polygon](#polygon) - 정다각형 Geometry 객체 반환
* [sphere](#sphere) - 구를 나타내는 Geometry 객체...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [geodesic](#geodesic) - geodesic Geometry 객체...
* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [cube](#cube) - 정육면체 Geometry 객체 반환
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...

[top](#)
 
<a name="constructor"></a>
##Constructor

**description**

- 면, 정다각형, 정육면체 등 미리 정의된 기본 기하 객체를 static 방식으로 생성할 수 있게 해주는 객체

**param**

- none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="skybox"></a>
###skybox(splitX: 각 면의 X축 방향 분할값, splitY: 각 면의 Y축 방향 분할값, splitZ: 각 면의 Z축 방향 분할값)

_static_


**description**

- 3차원 배경이 되어주는 큐브 형태의 Geometry 객체 반환 - 아직 미구현

**param**

1. splitX: 각 면의 X축 방향 분할값
2. splitY: 각 면의 Y축 방향 분할값
3. splitZ: 각 면의 Z축 방향 분할값

**exception**

- 'Primitive.skybox:0' - 인자값에 0이 들어있을 때

**return**

- Geometry - 3차원 배경 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var geodesic = Primitive.skybox();
```

[top](#)

<a name="plane"></a>
###plane(splitX: X축 방향 면의 분할수, 생략하면 기본값 1, splitY: Y축 방향 면의 분할수, 생략하면 기본값 1)

_static_


**description**

- 면을 나타내는 Geometry 객체 반환

**param**

1. splitX: X축 방향 면의 분할수, 생략하면 기본값 1
2. splitY: Y축 방향 면의 분할수, 생략하면 기본값 1

**exception**

- 'Primitive.polygon:0' - splitX나 splitY의 값이 0일 때

**return**

- Geometry - 점의 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var plane = Primitive.plane();
var plane = Primitive.plane(2, 2);
var plane = Primitive.plane(2, 3);
var plane = Primitive.plane(10, 10);
```

[top](#)

<a name="polygon"></a>
###polygon(n: 꼭지점의 수)

_static_


**description**

- 정다각형 Geometry 객체 반환

**param**

1. n: 꼭지점의 수

**exception**

- 'Primitive.polygon:0' - n이 3보다 작을 때

**return**

- Geometry - 정다각형 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var triangle = Primitive.polygon(3);
var square = Primitive.polygon(4);
var pentagon = Primitive.polygon(5);
```

[top](#)

<a name="sphere"></a>
###sphere(splitLatitude: 위도 방향 분할수, splitLongitude: 경도 방향 분할수)

_static_


**description**

- 구를 나타내는 Geometry 객체 반환

**param**

1. splitLatitude: 위도 방향 분할수
2. splitLongitude: 경도 방향 분할수

**exception**

- 'Primitive.sphere:0' - 인자값에 0이 포함되어 있을 때

**return**

- Geometry - 구의 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var sphere = Primitive.sphere();
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

<a name="geodesic"></a>
###geodesic(n: 구면을 분할하는 삼각형의 개수)

_static_


**description**

- geodesic Geometry 객체 반환

**param**

1. n: 구면을 분할하는 삼각형의 개수

**exception**

- 'Primitive.geodesic:0' - n이 3보다 작을 때

**return**

- Geometry - 극점에서 삼각형이 집중되지 않는 geodesic sphere 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var geodesic = Primitive.geodesic();
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

<a name="cube"></a>
###cube(splitX: 각 면의 X축 방향 분할값, splitY: 각 면의 Y축 방향 분할값, splitZ: 각 면의 Z축 방향 분할값)

_static_


**description**

- 정육면체 Geometry 객체 반환

**param**

1. splitX: 각 면의 X축 방향 분할값
2. splitY: 각 면의 Y축 방향 분할값
3. splitZ: 각 면의 Z축 방향 분할값

**exception**

- 'Primitive.cube:0' - 인자값에 0이 포함되어 있을 때

**return**

- Geometry - 정육면체 기하 정보를 담고 있는 Geometry 객체.

**sample**

```javascript
var cube = Primitive.cube();
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
