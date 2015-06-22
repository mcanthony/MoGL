#Shading
* parent : [MoGL](MoGL.md)
* [constructor](#constructor)


**static**

* [extend](#extend) - 이 클래스를 상속하는 자식클래스를 만...
* [getInstance](#getInstance) - uuid 또는 id를 기반으로 인스턴...
* [count](#count) - 이 클래스로 부터 만들어져 활성화된...
* [error](#error) - 정적함수에서 표준화된 예외를 처리함(...
* [getMD](#getMD) - 해당 클래스를 마크다운 형식으로 문서...

**constant**

* [none](#none) - none constant
* [gouraud](#gouraud) - gouraud constant
* [phong](#phong) - phong constant
* [blinn](#blinn) - blinn constant
* [flat](#flat) - flat constant
* [toon](#toon) - toon

[top](#)

<a name="constructor"></a>
##Constructor

**description**

- Shading

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

<a name="none"></a>
###none

_const_


**description**

- none constant

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

none

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="gouraud"></a>
###gouraud

_const_


**description**

- gouraud constant

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

gouraud

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="phong"></a>
###phong

_const_


**description**

- phong constant

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

phong

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="blinn"></a>
###blinn

_const_


**description**

- blinn constant

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

blinn

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="flat"></a>
###flat

_const_


**description**

- flat constant

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

flat

**exception**

- none

**sample**

```javascript
//none
```

[top](#)

<a name="toon"></a>
###toon

_const_


**description**

- toon

**setting**

- *writable*:false
- *enumerable*:false
- *configurable*:false

**value**

toon

**exception**

- none

**sample**

```javascript
//none
```

[top](#)