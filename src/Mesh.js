var Mesh = (function () {
    var geometry, material, culling;
    //private
    geometry = {},
    material = {},
    culling = {};
    //shared private
    $setPrivate('Mesh', {
        geometry : geometry,
        material : material,
        culling : culling
    });
    return Matrix.extend('Mesh', {
        description: [
            "기하구조와 재질을 포함할 수 있는 하나의 렌더링 단위인 Mesh를 생성함.",
            "* id를 인자로 지정하면 [Scene](Scene.md)에 [addChild](Scene.md#addchild-idstring-meshmesh-)하는 순간 id를 바인딩하며 실패하면 등록되지 않음.",
            "* 객체를 인자로 지정하면 [Scene](Scene.md)에 [addChild](Scene.md#addchild-idstring-meshmesh-)하는 순간 Mesh내부의 [Geometry](Geometry.md)나 [Material](Material.md)이 임의의 id로 자동등록되며, shader Id가 존재하지 않으면 예외가 발생함( [addChild](Scene.md#addchild-idstring-meshmesh-) 참조 )"
        ],
        param: [
            "1. geometry:* - 기하구조체를 받으며 다음과 같은 형식이 올 수 있음.",
            "   * string - Mesh가 등록될 [Scene](Scene.md)에 이미 등록되어있는 [Geometry](Geometry.md)의 id를 지정함.",
            "   * [Geometry](Geometry.md) - 직접 [Geometry](Geometry.md)객체를 지정함.",
            "   * null - null로 지정되면 [Scene](Scene.md)의 렌더링 대상에서 제외됨.",
            "2. material:* - 해당 기하구조에 적용할 재질을 받으며 다음과 같은 형식이 올 수 있음.",
            "   * string - Mesh가 등록될 [Scene](Scene.md)에 이미 등록되어있는 [Material](Material.md)의 id를 지정함.",
            "   * [Material](Material.md) - 직접 [Material](Material.md) 객체를 지정함.",
            "   * null - null로 지정되면 [Scene](Scene.md)의 렌더링 대상에서 제외됨."
        ],
        sample: [
            "var mesh1 = new Mesh(",
            "   new Geometry( vertex, index ),",
            "   new Material('#f00')",
            ");",
            "",
            "// 씬에 등록된 Geometry, Material 사용",
            "var mesh2 = new Mesh( scene.getGeometry(geometryID), scene.getMaterial(materialID) )",
            "",
            "//팩토리함수로도 사용가능",
            "var mesh3 = Mesh( scene.getGeometry(geometryID), scene.getMaterial(materialID) );"
        ],
        value:function Mesh(geometry, material) {
            this.geometry = geometry;
            this.material = material;
        }
    })
    .field('culling', {
        get:$getter(culling, false, 'cullingNone'),
        set:function cullingSet(v) {
            if (Mesh[v]) {
                culling[this] = v;
            } else {
                this.error(0);
            }
        }
    })
    .field('geometry', {
        description: "이 Mesh의 기하구조 정보를 가지는 [Geometry](Geometry.md) 객체",
        sample: [
            "// 씬에 등록된 기하구조로 교체할수 있음 - set",
            "mesh1.geometry = scene.getGeometry(geometryID);",
            "",
            "// 다른 Mesh에 기하구조 객체를 알려줄수 있음 - get",
            "mesh2.geometry = mesh1.geometry;"
        ],
        get:$getter(geometry),
        set:function geometrySet(v) {
            if (v instanceof Geometry) {
                geometry[this] = v;
            } else {
                this.error(0);
            }
        }
    })
    .field('material', {
        description: "이 Mesh의 재질을 표현하는 [Material](Material.md) 객체",
        sample: [
            "// 씬에 등록된 재질로 교체할수 있음 - set",
            "mesh1.material = scene.getMaterial(materialID);",
            "",
            "// 다른 Mesh에 재질 객체를 알려줄수 있음 - get",
            "mesh2.material = mesh1.material;"
        ],
        get:$getter(material),
        set:function materialSet(v) {
            if (v instanceof Material) {
                material[this] = v;
            } else {
                this.error(0);
            }
        }
    })
    .constant('cullingNone', 'cullingNone')
    .constant('cullingFront', 'cullingFront')
    .constant('cullingBack', 'cullingBack')
    .build();
})();