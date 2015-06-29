# MoGL.getMD

[MoGL 0.3 버전](https://github.com/projectBS/MoGL/releases)부터 추가된 [MoGL.getMD](https://github.com/projectBS/MoGL/blob/master/doc/0.3/MoGL.md#getMD) 메서드에 대해서 알아봅니다.

## MoGL 문서 시스템

MoGL은 강력한 문서 시스템을 사용하고 있습니다.

바로 문서가 소스 코드 안에 직접 존재하는 구조입니다.

```javascript
// 예시
// 클래스 안에 문서의 description, param, sample, exception 등이 존재함.
Matrix.extend('Mesh', {
    description: "기하구조와 재질을 포함할 수 있는 하나의 렌더링 단위인 Mesh를 생성함.",
    param: [
        "1. geometry: 직접 [Geometry](Geometry.md)객체를 지정함.",
        "2. material: 직접 [Material](Material.md) 객체를 지정함."
    ],
    sample: [
        "var mesh1 = new Mesh(",
        "  new Geometry( vertex, index ),",
        "  new Material('#f00')",
        ");",
        "",
        "// scene에 등록된 Geometry, Material 사용",
        "var mesh2 = new Mesh( scene.getGeometry(geometryID), scene.getMaterial(materialID) );",
        "",
        "// 팩토리함수로도 사용가능",
        "var mesh3 = Mesh( scene.getGeometry(geometryID), scene.getMaterial(materialID) );"
    ],
    exception:[
        "* 'Mesh.geometrySet:0' - 첫번째 인자가 geometry 객체가 아닌 경우",
        "* 'Mesh.materialSet:0' - 두번째 인자가 material 객체가 아닌 경우"
    ],
    value:function Mesh(geometry, material) {
        this.geometry = geometry;
        this.material = material;
    }
})
```

[MoGL.getMD](https://github.com/projectBS/MoGL/blob/master/doc/0.3/MoGL.md#getMD) 메서드를 통해서 소스 코드 안에 있는 문서를 마크다운 형태로 얻어낼 수가 있습니다.

MoGL의 모든 서브 클래스들은 getMD 메서드를 가지고 있습니다.

따라서 MoGL의 모든 클래스에서 getMD 메서드를 호출하면 마크다운 형태의 문서를 얻어낼 수 있습니다.

```javascript
console.log(MoGL.getMD());
console.log(Mesh.getMD());
// ...
```

실제로 getMD 메서드로 얻어낸 마크다운 문서를 확인할 수 있는 [링크](http://projectbs.github.io/MoGL/test.0.3/document.html)를 참고해 주세요.

MoGL은 소스 코드 안에 문서가 포함되어있기 때문에 코드 작업시 바로바로 문서를 참고할 수 있으며,

또한 소스 코드 수정시 바로바로 문서를 업데이트할 수 있기 때문에 문서가 항상 최신 상태임을 보장할 수 있습니다.

## MoGL 문서

[MoGL.getMD](https://github.com/projectBS/MoGL/blob/master/doc/0.3/MoGL.md#getMD) 메서드로 생성된 마크다운 문서는 [MoGL doc](https://github.com/projectBS/MoGL/tree/master/doc)에서 확인 가능합니다.

## MoGL 버전

MoGL 라이브러리는 개발용, 배포용 2가지 버전을 가지고 있습니다.

개발용인 [mogl.js](https://github.com/projectBS/MoGL/blob/master/mogl.js) 에는 문서 시스템이 포함되어 있습니다.

배포용인 [mogl.min.js](https://github.com/projectBS/MoGL/blob/master/mogl.min.js) 에는 문서 시스템이 제거되어 있으며 배포에 최적화되어 용량이 작습니다.

따라서 개발시에는 문서 시스템이 포함된 [mogl.js](https://github.com/projectBS/MoGL/blob/master/mogl.js)을 사용하여 개발을 완료한 후, 배포는 [mogl.min.js](https://github.com/projectBS/MoGL/blob/master/mogl.min.js)을 사용하는 것을 권장합니다.

**참고 API**

* [MoGL](https://github.com/projectBS/MoGL/blob/master/doc/MoGL.md)

**참고 LINK**

* [MoGL doc](https://github.com/projectBS/MoGL/tree/master/doc)
* [document](http://projectbs.github.io/MoGL/test.0.3/document.html)