# MoGL
* children : all of MoGL subClass
* [Constructor](#constructor)
* [UnitTest](http://projectbs.github.io/MoGL/test/MoGL.html)

**field**

* [isAlive](#isalive)
* [uuid](#uuid)
 
**method**

* [destroy](#destroy)
 
**static**

* [MoGL.count](#moglcount-classfunction-)
* [MoGL.error](#moglerror-classnamestring-methodnamestring-idint-)
* [MoGL.ext](#moglext-childfunction-parentfunction-)
* [MoGL.isAlive](#moglisalive-instance-)

[top](#)
## Constructor

```javascript
MoGL()
```

**description**

MoGL 라이브러리의 모든 클래스는 MoGL을 상속함. 보통 직접적으로 MoGL 클래스를 사용하는 경우는 없음.

**param**

없음.

**sample**

```javascript
var instance = new MoGL();
```

[top](#)
## isAlive

**description**

현재 인스턴스가 destroy를 통해 파괴된 객체인지 아닌지를 판별해줌.
* [MoGL.isAlive](#MoGL.isAlive) 참조

**sample**

```
var scene = new Scene();
console.log( scene.isAlive ); //true
```

[top](#)
## uuid

**description**

MoGL을 상속한 모든 클래스의 인스턴스는 식별할 수 있는 고유값인 uuid를 갖게 됨. uuid는 0이상의 정수임.

**sample**

```
var scene = new Scene();
console.log( scene.uuid );
```

[top](#)
## destroy()

**description**

생성된 객체를 파괴함.

**param**

없음.

**exception**

없음.

**return**

없음.

**sample**

```javascript
var city1 = Scene();
city1.destroy();
```

[top](#)
## MoGL.count( [class:function] )

**description**

해당 클래스로 생성된 인스턴스의 수를 반환함. 생략시 전체 인스턴스의 수를 반환함.

**param**

1. ?class:function - 파악하고자 하는 인스턴스의 클래스. 생략 시 전체 인스턴스 수가 반환됨.

**exception**

없음.

**return**

int - 인스턴스의 수.

**sample**

```javascript
console.log( MoGL.count(Scene) );
```

[top](#)
## MoGL.error( className:string, methodName:string, id:int )

**description**

표준 예외를 보고함.

**param**

1. className:string - 예외가 발생한 클래스의 이름.
2. methodName:string - 예외가 발생한 메서드의 이름.
3. id:int - 예외별 id.

**exception**

주어진 인자에 따라 className + '.' + methodName + ':' + id 형태로 예외메세지가 출력됨.

**return**

없음

**sample**

```javascript
MoGL.error( 'Scene', 'addChild', 2 );
```

[top](#)
## MoGL.ext( child:function, parent:function )

**description**

parent 클래스를 상속하는 child 클래스를 생성함.
* 프로토타입 체인 형식이 아니라 부모의 프로토타입속성을 자식에게 복사하는 형태로 상속됨.
* child의 함수는 유지되지 않고 새로운 함수로 반환됨.
* 새로 생성된 함수는 팩토리함수 기능을 자동으로 제공하고 생성자 체인을 자동으로 생성함.

**param**

1. child:function - parent로부터 상속받을 자식클래스로 미리 child.prototype에 원하는 메서드를 다 정의한 후 사용함.
2. parent:function - 반드시 MoGL.ext로부터 생성된 클래스나 최상위 MoGL클래스만 올 수 있음. 부모클래스의 prototype속성 일체는 새로 생성되는 자식 클래스의 prototype에 복사됨.

**exception**

* 'MoGL.ext:0' - parent가 MoGL.ext로 만들어진 클래스가 아니고 MoGL도 아닌 경우 발생.

**return**

function - 상속받은 새로운 클래스함수.

**sample**

```javascript
//일반적인 부모 클래스를 정의
var parent = function( a, b ){
	this.a = a;
	this.b = b;
};
parent.prototype.printA = function(){
	return this.a;
};
parent.prototype.printB = function(){
	return this.b;
};

//최상위 MoGL로 부터 상속받음.
parent = MoGL.ext( parent, MoGL );

//일반적인 자식클래스를 정의
var child = function( a, b, c ){
	this.c = c;
};
child.prototype.printC = function(){
	return this.c;
};

//MoGL.ext로 생성된 parent로 부터 상속
child = MoGL.ext( child, parent );

//일반적인 new구문으로 생성가능.
var instance1 = new child( 1, 2, 3 );
instance1.printA() == 1
instance1.printB() == 2
instance1.printC() == 3


//팩토리함수 형태로도 인스턴스 생성가능.
var instance2 = child( 4, 5, 6 );
instance2.printA() == 4
instance2.printB() == 5
instance2.printC() == 6
```

[top](#)
## MoGL.isAlive( instance:* )

**description**

특정 인스턴스의 isAlive속성이 true가 아니라면 예외가 발생함

**param**

1. instance:* - isAlive인지 체크할 인스턴스.

**exception**

isAlive가 true가 아니라면 'Destroyed Object:' + instance 형태로 예외발생

**return**

없음.

**sample**

```javascript
var lobby = new Scene();
MoGL.isAlive(lobby);
```

[top](#)
