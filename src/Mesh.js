var Mesh = (function () {
    'use strict';
    var geometry, material, culling,pickingColors,pickingMeshs,billBoard;
    //private
    geometry = {},
    material = {},
    culling = {};
    pickingColors = {}
    pickingMeshs = {}
    billBoard = {}
    //shared private
    $setPrivate('Mesh', {
        geometry : geometry,
        material : material,
        culling : culling,
        pickingColors : pickingColors,
        pickingMeshs : pickingMeshs,
        billBoard : billBoard
    });
    var getUniqueColor = (function () {
        var color = 1677215, r = 0, g = 0, b = 0, r1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, r, g, b, t0;
        return function () {
            return t0 = r1.exec(color.toString(16)), color--, r = parseInt(t0[1], 16), g = parseInt(t0[2], 16), b = parseInt(t0[3], 16),
                [r/255, g/255 , b/255, 1]
        }
    })()
    return Matrix.extend('Mesh', {
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
            this.geometry = geometry,
            this.material = material,
            pickingColors[this] = getUniqueColor(),
            billBoard[this] = false;

            var self = this;
            (function () {
                var result = 0
                self.addEventListener(MoGL.eventChanged, function (ev, cnt, allCnt) {
                    //console.log('테스트', ev, cnt, allCnt);
                    var t = pickingColors[self]
                    var temp = pickingMeshs[[t[0] * 255, t[1] * 255, t[2] * 255, 255].join('')]
                    result=0
                    for(var k in allCnt){
                        result += allCnt[k]
                    }
                    if(result<3){
                        //console.log('마우스이벤트를 그리면안됨',result)
                        delete pickingMeshs[[t[0] * 255, t[1] * 255, t[2] * 255, 255].join('')]
                    }else{
                        pickingMeshs[[t[0] * 255, t[1] * 255, t[2] * 255, 255].join('')] = {mesh: this}
                    }
                });
            })()
        }
    })

    .field('billBoard', {
        description: "현재 Mesh의 billBoard 정보",
        sample: [
            'mesh1.billBoard = true;'
        ],
        defaultValue:"false",
        get:$getter(billBoard),
        set:function billBoardSet(v) {
            billBoard[this] = v;
        }
    })
    .field('culling', {
        description: "현재 Mesh의 Face Culling 정보",
        sample: [
            "// Mesh에 정의 된 상수 입력",
            "var mesh1 = new Mesh(geometry, material);",
            "mesh1.culling = Mesh.cullingNone; // 페이스 컬링을 하지않음",
            "mesh1.culling = Mesh.cullingFront; // 앞면 페이스 컬링을 함",
            "mesh1.culling = Mesh.cullingBack; // 뒷면 페이스 컬링을 함",
            "",
            "// Mesh에 정의 된 상수의 값을 직접 입력",
            'mesh1.culling = "cullingNone"; // 페이스 컬링을 하지않음',
            'mesh1.culling = "cullingFront"; // 앞면 페이스 컬링을 함',
            'mesh1.culling = "cullingBack"; // 뒷면 페이스 컬링을 함'
        ],
        defaultValue:"cullingNone",
        exception:"* 'Mesh.cullingSet:0' - Mesh에 정의된 culling상수값들과 다른 값을 입력 할 경우",
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
            "// scene에 등록된 기하구조로 교체할수 있음 - set",
            "mesh1.geometry = scene.getGeometry(geometryID);",
            "",
            "// 다른 Mesh에 기하구조 객체를 알려줄수 있음 - get",
            "mesh2.geometry = mesh1.geometry;"
        ],
        exception: "* 'Mesh.geometrySet:0' - geometry 아닌 값를 필드에 입력하려는 경우",
        get:$getter(geometry),
        set:function geometrySet(v) {
            if (v instanceof Geometry) {
                geometry[this] = v;
                this.dispatch('changed')
            } else {
                this.error(0);
            }
        }
    })
    .field('material', {
        description: "이 Mesh의 재질을 표현하는 [Material](Material.md) 객체",
        sample: [
            "// scene에 등록된 재질로 교체할수 있음 - set",
            "mesh1.material = scene.getMaterial(materialID);",
            "",
            "// 다른 Mesh에 재질 객체를 알려줄수 있음 - get",
            "mesh2.material = mesh1.material;"
        ],
        exception:"* 'Mesh.materialSet:0' - material객체가 아닌 값를 필드에 입력하려는 경우",
        get:$getter(material),
        set:function materialSet(v) {
            if (v instanceof Material) {
                material[this] = v;
                this.dispatch('changed')
            } else {
                this.error(0);
            }
        }
    })
    .constant('cullingNone', {
        description: "Mesh Face Culling을 하지 않음.",
        type:'string',
        sample: [
            "var mesh1 = new Mesh(geometry, material);",
            "mesh1.culling = Mesh.cullingNone;",
        ],
        value:"cullingNone"
    })
    .constant('cullingFront',  {
        description: "Mesh FrontFace를 그리지 않음.",
        type:'string',
        sample: [
            "var mesh1 = new Mesh(geometry, material);",
            "mesh1.culling = Mesh.cullingFront;",
        ],
        value:"cullingFront"
    })
    .constant('cullingBack', {
        description: "Mesh BackFace를 그리지않음",
        type:'string',
        sample: [
            "var mesh1 = new Mesh(geometry, material);",
            "mesh1.culling = Mesh.cullingBack;",
        ],
        value:"cullingBack"
    })
    .event('changed', {
        description:[
            '체인지 이벤트',
            '* 메쉬의 재질이나 지오메트리가 변경될때 발생하는 이벤트'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.changed, function(){",
            "  // 필드값 변경되었을때 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "change", function(){',
            "  // 필드값 변경되었을때 처리 코드",
            "});"
        ],
        value : 'changed'
    })
    .event('over', {
        description:[
            '오버이벤트',
            '* 모바일일 경우 터치로 이벤트가 걸림'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.over, function(){",
            "  // over 발생시 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "over", function(){',
            "  // over 발생시 처리 코드",
            "});"
        ],
        value : 'over'
    })
    .event('out', {
        description:[
            '아웃이벤트',
            '* 모바일일 경우 터치로 이벤트가 걸림'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.out, function(){",
            "  // out 발생시 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "out", function(){',
            "  // out 발생시 처리 코드",
            "});"
        ],
        value : 'out'
    })
    .event('down', {
        description:[
            '다운이벤트',
            '* 모바일일 경우 터치로 이벤트가 걸림'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.down, function(){",
            "  // down 발생시 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "down", function(){',
            "  // down 발생시 처리 코드",
            "});"
        ],
        value : 'down'
    })
    .event('up', {
        description:[
            '업이벤트',
            '* 모바일일 경우 터치로 이벤트가 걸림'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.up, function(){",
            "  // up 발생시 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "up", function(){',
            "  // up 발생시 처리 코드",
            "});"
        ],
        value : 'up'
    })
    .event('move', {
        description:[
            '무브이벤트',
            '* 모바일일 경우 터치로 이벤트가 걸림'
        ],
        type:'string',
        sample: [
            "var mesh = new Mesh();",
            "mesh.addEventListener( Mesh.move, function(){",
            "  // move 발생시 처리 코드",
            "  console.log(this)",
            "});",
            "",
            "// 이벤트명 직접 입력",
            'mesh.addEventListener( "move", function(){',
            "  // move 발생시 처리 코드",
            "});"
        ],
        value : 'move'
    })
    .build();
})();