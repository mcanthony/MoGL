# MoGL.classes

[MoGL 0.3 버전](https://github.com/projectBS/MoGL/releases)부터 추가된 [MoGL.classes](https://github.com/projectBS/MoGL/blob/master/doc/0.3/MoGL.md#classes) 메서드에 대해서 알아봅니다.

MoGL은 임의의 네임스페이스를 사용하지 않습니다.

MoGL을 사용하는 개발자가 필요시 원하는 스코프 내에서 MoGL의 서브 클래스들을 복사하여 네임스페이스처럼 사용할 수 있습니다.

[MoGL.classes](https://github.com/projectBS/MoGL/blob/master/doc/0.3/MoGL.md#classes) 메서드는 전달받은 객체에 MoGL의 서브 클래스들을 복사하여 반환해주는 기능을 합니다.

```javascript
// hello 객체에 MoGL의 서브 클래스들을 복사
var hello = {};
MoGL.classes(hello);

// hello 객체를 네임스페이스처럼 사용.
var world = hello.World();
var mesh = hello.Mesh();
// ...
```

또는 서브 클래스들을 복사한 객체를 리턴받아서 사용도 가능합니다.

```javascript
// MoGL의 서브 클래스들이 복사된 객체를 hello 변수에 할당.
var hello = MoGL.classes();

// 반환된 객체를 네임스페이스처럼 사용.
var world = hello.World();
var mesh = hello.Mesh();
// ...
```

물론 window 객체에 서브 클래스들을 복사하여 전역으로 사용도 가능합니다.

```javascript
// window 객체에 서브 클래스들을 복사
MoGL.classes(window);

// 전역 클래스로 사용.
var world = World();
var mesh = Mesh();
// ...
```

**참고 API**

* [MoGL](https://github.com/projectBS/MoGL/blob/master/doc/MoGL.md)