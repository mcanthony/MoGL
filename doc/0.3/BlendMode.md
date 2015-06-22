#BlendMode
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**static**

* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...

**constant**

* [add](#add) - 전면색을 배경색에 더하고 올림값 0x...
* [alpha](#alpha) - 전면색의 알파값에 따라 배경색을 덮어...
* [darken](#darken) - 전면색과 배경색 중 보다 어두운 색상...
* [difference](#difference) - 전면색과 배경색을 비교하여 둘 중 밝...
* [erase](#erase) - 전면색의 알파만 적용하여 배경색을 지...
* [hardlight](#hardlight) - 전면색의 어두운 정도를 기준으로 배경...
* [invert](#invert) - 전면색을 이용하여 배경색을 반전시킴
* [lighten](#lighten) - 전면색과 배경색 중 보다 밝은 색(값...
* [multiply](#multiply) - 전면색에 배경색을 곱하고 0xFF로...
* [screen](#screen) - 전면색의 보수(역수)에 배경색 보수를...
* [subtract](#subtract) - 전면색의 값을 배경색에서 빼고 내림값...

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- BlendMode

**param**

- none

**exception**

- none

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

<a name="count"></a>
###count()

_static_


**description**

- 이 클래스로 부터 만들어져 활성화된 인스턴스의 수

**param**

none

**exception**

- none

**return**

- int - 활성화된 인스턴스의 수

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

<a name="getMD"></a>
###getMD()

_static_


**description**

- 해당 클래스를 마크다운 형식으로 문서화하여 출력함

**param**

none

**exception**

- none

**return**

- string - 클래스에 대한 문서 마크다운

**sample**

```javascript
//none
```

[top](#)

<a name="add"></a>
###add

_const_


**description**

- 전면색을 배경색에 더하고 올림값 0xFF를 적용

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

add

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="alpha"></a>
###alpha

_const_


**description**

- 전면색의 알파값에 따라 배경색을 덮어가는 가장 일반적인 중첩

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

alpha

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="darken"></a>
###darken

_const_


**description**

- 전면색과 배경색 중 보다 어두운 색상(값이 작은 색상)을 선택

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

darken

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="difference"></a>
###difference

_const_


**description**

- 전면색과 배경색을 비교하여 둘 중 밝은 색상 값에서 어두운 색상 값을 뺌

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

difference

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="erase"></a>
###erase

_const_


**description**

- 전면색의 알파만 적용하여 배경색을 지움

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

erase

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="hardlight"></a>
###hardlight

_const_


**description**

- 전면색의 어두운 정도를 기준으로 배경색을 조정

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

hardlight

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="invert"></a>
###invert

_const_


**description**

- 전면색을 이용하여 배경색을 반전시킴

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

invert

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="lighten"></a>
###lighten

_const_


**description**

- 전면색과 배경색 중 보다 밝은 색(값이 큰 색상)으로 선택

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

lighten

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="multiply"></a>
###multiply

_const_


**description**

- 전면색에 배경색을 곱하고 0xFF로 나누어 정규화하여 보다 어두운 색을 만듬

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

multiply

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="screen"></a>
###screen

_const_


**description**

- 전면색의 보수(역수)에 배경색 보수를 곱하여 표백 효과를 냄

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

screen

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="subtract"></a>
###subtract

_const_


**description**

- 전면색의 값을 배경색에서 빼고 내림값 0을 적용

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

subtract

**exception**

- none

**sample**

```javascript
//none
```

[top](#)