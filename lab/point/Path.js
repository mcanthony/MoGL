var Path = (function () {
    'use strict';
    // var geometry, material, pointSize;
    var pathtype, typetable;
    
    // geometry = {},
    // material = {},
    pathtype = {};
    //typetable = {
    //    "solid" : 3,
    //    "dash" : 1,
    //};
      
    $setPrivate('Path', {
        // geometry : geometry,
        // material : material,
        pathtype : pathtype,
        //typetable : typetable,
    });
    // return Matrix.extend('Point',{
    return Mesh.extend('Path',{
        description:"선을 이루는 Mesh",
        param:[

        ],
        sample:[
            "var path = new Path(geometry, material);",
            "//팩토리함수로도 사용가능",
            "var path2 = Path(geometry, material);"
        ],
        value:function Path(geometry, material) {
            pathtype[this] = 2;
        }
    })
    .field('pathtype', {
        description: "선의 종류",
        sample: [
            '// dash, solid'
        ],
        defaultValue: 2,
        get:$getter(pathtype),
        set:function pathTypeSet(v) {
            pathtype[this] = v;
        }
    })
    // .field('geometry', {
    //     description: "이 Point의 기하구조 정보를 가지는 [Geometry](Geometry.md) 객체",
    //     sample: [
    //         ""
    //     ],
    //     exception: "* 'Mesh.geometrySet:0' - geometry 아닌 값를 필드에 입력하려는 경우",
    //     get:$getter(geometry),
    //     set:function geometrySet(v) {
    //         if (v instanceof Geometry) {
    //             geometry[this] = v;
    //             this.dispatch('changed')
    //         } else {
    //             this.error(0);
    //         }
    //     }
    // })
    // .field('material', {
    //     description: "이 Point의 재질을 표현하는 [Material](Material.md) 객체",
    //     sample: [
    //         ""
    //     ],
    //     exception:"* 'Mesh.materialSet:0' - material객체가 아닌 값를 필드에 입력하려는 경우",
    //     get:$getter(material),
    //     set:function materialSet(v) {
    //         if (v instanceof Material) {
    //             material[this] = v;
    //             this.dispatch('changed')
    //         } else {
    //             this.error(0);
    //         }
    //     }
    // })
    .build();
})();