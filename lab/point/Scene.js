var Scene = (function () {
    'use strict';
    var vertexShaderParser, fragmentShaderParser, mkGet, mkAdd, mkAddShader, mkRemove,addRenderList,removeRenderItem,renderList,
        children,childrenArray, cameras, textures, materials, geometrys, vertexShaders, fragmentShaders, updateList,baseLightRotate,cameraLength;
    //private
    children = {},
        childrenArray = {},
        renderList = {},
        cameras = {},
        baseLightRotate={},
        textures = {},
        materials = {},
        geometrys = {},
        vertexShaders = {},
        fragmentShaders = {},
        updateList = {},
        cameraLength = {},
        //shared private
        $setPrivate('Scene', {
            children:children,
            childrenArray:childrenArray,
            renderList : renderList,
            cameraLength : cameraLength
        }),
        //lib
        vertexShaderParser = makeUtil.vertexShaderParser,
        fragmentShaderParser = makeUtil.fragmentShaderParser;
    mkGet = function(target){
        return function(v) {
            var t = target[this], k;
            for(k in t){
                if (v == k || t[k].id == v) return t[k];
            }
            return null;
        };
    },
        mkAdd = function(target, type){
            return function(v){
                var t;
                if (!(v instanceof type)) this.error(1);
                t = target[this],
                    t[v] ? this.error(0) : t[v] = v;
                return this;
            };
        },
        mkAddShader = function(target, parser){
            return function(v) {
                var t;
                t = target[this];
                if (t[v.code.id]) {
                    this.error(0);
                } else {
                    t[v.code.id] = parser(v);
                }
                return this;
            };
        },
        mkRemove = function(target){
            return function(v) {
                var p, k;
                p = target[this];
                for (k in p) {
                    if (k == v || p[k].id == v) {
                        delete p[k];
                        return true;
                    }
                }
                return false;
            }
        },
        (function(){
            var sort = [['culling',0],['geometry',0],['diffuse',0],['shading',0]], data = {};
            var target, ref, i, j
            var curr, sep, key, diffuse;

            data = {
                culling:$getPrivate('Mesh', 'culling'),
                geometry:$getPrivate('Mesh', 'geometry'),
                material:$getPrivate('Mesh', 'material'),
                diffuse:$getPrivate('Material', 'diffuse'),
                shading:$getPrivate('Material', 'shading')
            },
                addRenderList = function (v, list) {
                    target = list;
                    for (i = 0, j = sort.length; i < j; i++) {
                        curr = sort[i],
                            ref = v,
                            key = ''
                        if (i > 1) {
                            ref = data.material[ref.uuid]
                        }
                        if (i == 2) {
                            diffuse = data.diffuse[ref.uuid]
                            if (diffuse) key = 'useTexture_' + diffuse[0].tex.uuid
                            else key = 'noTexture'
                            sep = key
                            if (ref.sprite) sep = 'sprite_' + sep
                        } else {
                            sep = ref[curr[0]]
                        }
                        if (!target[sep]) target[sep] = i == j - 1 ? [] : {};
                        target = target[sep];
                    }
                    if(target.indexOf(v)==-1) target[target.length] = v;
                },
                removeRenderItem = function(v,list) {
                    var checkList, k, tList;
                    var tGeo, tMat,tShading;
                    tGeo = data.geometry[v.uuid],
                        tMat = data.material[v.uuid],
                        tShading = data.shading[tMat]
                    checkList = list[v.culling][tGeo]
                    for (k in checkList) {
                        tList = checkList[k][tShading],
                            tList.splice(tList.indexOf(v),1)
                    }
                }
        })()

    return MoGL.extend('Scene', {
        description:[
            '실제 렌더링될 구조체는 Scene별로 집결됨.',
            'Scene은 렌더링과 관련된 [Mesh](Mesh.md), [Camera](Camera.md), [Light](Light.md) 등을 포함하고 이들 객체가 공유하며 활용하는 기초 자원으로서 vertex shader, fragment shader, [Texture](Texture.md), [Material](Material.md), [Geometry](Geometry.md) 등을 등록하여 관리한다'
        ],
        sample:'var scene = new Scene();',
        value:function Scene() {
            // for JS
            children[this] = {},
                childrenArray[this] = [],
                cameras[this] = {},
                cameraLength[this] = 0,
                textures[this] = {},
                materials[this] = {},
                geometrys[this] = {},
                vertexShaders[this] = {},
                fragmentShaders[this] = {},
                renderList[this] = {},
                updateList[this] = {
                    geometry:[],
                    texture:[],
                    camera:[],
                    merged:[],
                    updatePropertys:[]
                },
                baseLightRotate[this] = [0, -1, -1],
                this.updateList = updateList[this],
                this.addVertexShader(Shader.mouseVertexShader), this.addFragmentShader(Shader.mouseFragmentShader),
                this.addVertexShader(Shader.colorVertexShader), this.addFragmentShader(Shader.colorFragmentShader),
                this.addVertexShader(Shader.wireFrameVertexShader), this.addFragmentShader(Shader.wireFrameFragmentShader),
                this.addVertexShader(Shader.bitmapVertexShader), this.addFragmentShader(Shader.bitmapFragmentShader),
                this.addVertexShader(Shader.bitmapVertexShaderGouraud), this.addFragmentShader(Shader.bitmapFragmentShaderGouraud),
                this.addVertexShader(Shader.colorVertexShaderGouraud), this.addFragmentShader(Shader.colorFragmentShaderGouraud),
                this.addVertexShader(Shader.colorVertexShaderPhong), this.addFragmentShader(Shader.colorFragmentShaderPhong),
                this.addVertexShader(Shader.toonVertexShaderPhong), this.addFragmentShader(Shader.toonFragmentShaderPhong),
                this.addVertexShader(Shader.bitmapVertexShaderPhong), this.addFragmentShader(Shader.bitmapFragmentShaderPhong),
                this.addVertexShader(Shader.postBaseVertexShader), this.addFragmentShader(Shader.postBaseFragmentShader);
        }
    })
        .field('vertexShaders', {
            description:"현재 씬이 가지고있는 버텍스 쉐이더 자바스크립트 정보",
            sample:"console.log(scene.vertexShaders);",
            defaultValue:"{}",
            get:$getter(vertexShaders)
        })
        .field('fragmentShaders', {
            description:"현재 씬이 가지고 있는 프레그먼트 쉐이더 자바스크립트 정보",
            sample:"console.log(scene.fragmentShaders);",
            defaultValue:"{}",
            get:$getter(fragmentShaders)
        })
        .field('baseLightRotate', {
            description:"디렉셔널 라이트 방향 설정, -1~1 사이값으로 입력(0.4에서 노멀라이즈처리)",
            sample:[
                "var scene = new Scene();",
                "scene.baseLightRotate = [0,1,0];",
                "console.log(scene.baseLightRotate);"
            ],
            defaultValue:"[0, -1, -1]",
            set:$setter(baseLightRotate),
            get:$getter(baseLightRotate)
        })
        .field('cameras', {
            description:"씬에 등록된 카메라 리스트",
            sample:[
                "var scene = new Scene();",
                "scene.addChild(new Camera);",
                "console.log(scene.cameras); //오브젝트 형식의 카메라 리스트를 반환"
            ],
            defaultValue:"{}",
            get:$getter(cameras)
        })
        .field('children', {
            description:"씬에 등록된 자식 리스트를 오브젝트 형식으로 반환",
            sample:"console.log(scene.children);",
            defaultValue:"{}",
            get:$getter(children)
        })
        .method('addChild', {
            description:'자식 객체를 추가함. 메쉬나 카메라 객체가 자식으로 올 수 있음',
            param: '1. child:[Mesh](Mesh.md) or [Camera](Camera.md) - Mesh 또는 Camera',
            ret:'this',
            sample: [
                "var scene = new Scene();",
                "var camera = new Camera();",
                "scene.addChild(camera);"
            ],
            exception:"'Scene.addChild:0' - 카메라나 메쉬객체가 아닌 객체를 추가하려고 할 때",
            value: function addChild(v) {
                if (v instanceof Mesh) {
                    this.addMesh(v);
                } else if (v instanceof Camera) {
                    this.addCamera(v);
                } else this.error(0);
                return this;
            }
        })
        .method('addCamera', {
            description:'카메라 객체를 추가함.',
            param:'1. camera:[Camera](Camera.md) - 등록할 카메라',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "var camera = new Camera();",
                "scene.addCamera(camera);"
            ],
            exception:[
                "'Scene.addCamera:0' - 이미 등록된 카메라객체를 등록하려고 할 때",
                "'Scene.addCamera:1' - 카메라가 아닌 객체를 등록하려고 할 때"
            ],
            value:function addCamera(v){
                var target;
                if (!(v instanceof Camera)) this.error(1);
                target = cameras[this];
                if (target[v]) {
                    this.error(0);
                } else {
                    updateList[this].camera.push(target[v] = v);
                    cameraLength[this]++
                }
                return this;
            }
        })
        .method('addMesh', {
            description:'Mesh객체를 추가함.',
            param:'1. mesh:Mesh - 메쉬객체',
            ret:'this - 메서드체이닝을 위해 자신을 반환함.',
            sample:[
                "var scene = new Scene();",
                "var geo = new Geometry([],[]);",
                "var mat = new Material();",
                "var mesh = new Mesh(geo,mat);",
                "scene.addMesh(mesh);"
            ],
            exception:[
                "'Scene.addMesh:0' - 이미 등록된 메쉬객체를 등록하려고 할 때",
                "'Scene.addMesh:1' - 메쉬가 아닌 객체를 등록하려고 할 때"
            ],
            value:(function(){
                var maps = 'diffuse,normal,specular'.split(','), loaded = function(update) {
                    var k = maps.length, target, texture, i;
                    while (k--) {
                        if (target = this[maps[k]]) {
                            i = target.length;
                            while(i--){
                                texture = target[i];
                                if (update.indexOf(texture)==-1) update.push(texture);
                            }
                        }
                    }
                };
                return function addMesh(v){
                    var target, update,render;

                    if (!(v instanceof Mesh)) this.error(1);

                    target = children[this];
                    if (target[v]) {
                        this.error(0);
                    } else {
                        target[v] = v;
                    }

                    target = childrenArray[this];
                    if (target.indexOf(v) == -1) target[target.length] = v;

                    update = updateList[this],
                        update.geometry.push(v.geometry),
                        update.merged.push(v),

                        render = renderList[this]
                    v.addEventListener(Mesh.changed, function() {
                        if (update.geometry.indexOf(v.geometry)==-1) update.geometry.push(v.geometry);
                        target = v.material;
                        if (target.isLoaded) {
                            loaded.call(target, update.texture);
                        }
                        removeRenderItem(v,render)
                        addRenderList(v,render)
                    });

                    target = v.material;
                    if (target.isLoaded) {
                        loaded.call(target, update.texture);
                    }
                    target.addEventListener(Material.changed, loaded, null, update.texture);
                    addRenderList(v,renderList[this])
                    return this;
                };
            })()
        })
        .method('addGeometry', {
            description:'지오메트리 객체를 추가함. 지역변수를 쓰지 않고 scene을 컨테이너로 사용할 수 있음.',
            param:'1. geometry:[Geometry](Geometry.md) - 지오메트리 객체',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "var geo = new Geometry([],[]);",
                "scene.addGeometry(geo);"
            ],
            exception:[
                "'Scene.addGeometry:0' - 이미 등록된 지오메트리를 등록하려 할 때",
                "'Scene.addGeometry:1' - 지오메트리 타입이 아닌 객체를 등록하려 할 때"
            ],
            value:mkAdd(geometrys, Geometry)
        })
        .method('addMaterial', {
            description:'재질 객체를 추가함. 지역변수를 쓰지 않고 scene을 컨테이너로 사용할 수 있음.',
            param:'1. material:[Material](Material.md) - 재질 객체',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "var mat = new Material();",
                "scene.addMaterial(mat);"
            ],
            exception:[
                "'Scene.addMaterial:0' - 이미 등록된 재질을 등록하려 할 때",
                "'Scene.addMaterial:1' - Material 타입이 아닌 객체를 등록하려 할 때"
            ],
            value:mkAdd(materials, Material)
        })
        .method('addTexture', {
            description:'텍스쳐 객체를 추가함',
            param:'1. texture:[Texture](Texture.md) - 텍스쳐 객체',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "var texture = new Texture();",
                "scene.addTexture(texture);"
            ],
            exception:[
                "'Scene.addTexture:0' - 이미 등록된 텍스쳐를 등록하려 할 때",
                "'Scene.addTexture:1' - Texture 타입이 아닌 객체를 등록하려 할 때"
            ],
            value:mkAdd(textures, Texture)
        })
        .method('addFragmentShader', {
            description:'프레그먼트 쉐이더 객체를 추가함',
            param:'1. fragmentShader:[Shader](Shader.md) - 프레그먼트 쉐이더 객체',
            ret:'this',
            sample:"scene.addFragmentShader(fragmentShader);",
            exception:"'Scene.addFragmentShader:0' - 이미 등록된 프레그먼트 쉐이더를 등록하려 할 때",
            value:mkAddShader(fragmentShaders, fragmentShaderParser)
        })
        .method('addVertexShader', {
            description:'버텍스 쉐이더 객체를 추가함',
            param:'1. vertexShader:[Shader](Shader.md) - 버텍스 쉐이더 객체',
            ret:'this',
            sample:"scene.addVertexShader(vertexShader);",
            exception:"'Scene.addVertexShader:0' - 이미 등록된 버텍스 쉐이더를 등록하려 할 때",
            value:mkAddShader(vertexShaders, vertexShaderParser)
        })
        .method('getChild', {
            description:'씬에 등록된 자식객체 전체를 검색',
            param:'id:String - 찾고자 하는 자식의 id 또는 uuid',
            ret:'[Mesh](Mesh.md) or [Camera](Camera.md) or null',
            sample:"scene.getChild('CameraID');",
            value:function getChild(id) {
                return this.getMesh(id) || this.getCamera(id) || null;
            }
        })
        .method('getMesh',{
            description:'씬에 등록된 [Mesh](Mesh.md)객체를 검색',
            param:'1. id:String - 찾고자 하는 id 또는 uuid',
            ret:'[Mesh](Mesh.md) or null',
            sample:"scene.getMesh('MeshID')",
            value:mkGet(children)
        })
        .method('getCamera', {
            description:'씬에 등록된 [Camera](Camera.md)객체를 검색',
            param:'1. id:String - 찾고자 하는 id 또는 uuid',
            ret:'[Camera](Camera.md) or null',
            sample:"var cam = scene.getCamera('CameraID');",
            value:mkGet(cameras)
        })
        .method('getGeometry', {
            description:'씬에 등록된 지오메트리 객체를 검색',
            param:'1. id:String - 찾고자 하는 id 또는 uuid',
            ret:'[Geometry](Geometry.md) or null',
            sample:"var geo = scene.getGeometry('GeometryID');",
            value:mkGet(geometrys)
        })
        .method('getMaterial', {
            description:'씬에 등록된 재질 객체를 검색',
            param:'1. id:String - 찾고자 하는 id 또는 uuid',
            ret:'[Material](Material.md) or null',
            sample:"var mat = scene.getMaterial('MaterialID');",
            value:mkGet(materials)
        })
        .method('getTexture', {
            description:'씬에 등록된 텍스쳐 객체를 검색',
            param:'1. id:String - 찾고자 하는 id 또는 uuid',
            ret:'[Texture](Texture.md) or null',
            sample:"var tex = scene.getTexture('TextureID');",
            value:mkGet(textures)
        })
        .method('removeChild', {
            description:'씬에 등록된 객체를 자식리스트에서 삭제',
            param:'1. id:String - 삭제하려는 id 또는 uuid',
            ret:'true or false - 삭제 성공시 true 반환',
            sample:"scene.removeChild('targetID');",
            value:function removeChild(v) {
                var p = children[this], k;
                for (k in p) {
                    if (k == v || p[k].id == v) {
                        childrenArray[this].splice(childrenArray[this].indexOf(p[k]), 1),
                            p[k].removeEventListener(MoGL.changed),
                            removeRenderItem(v, renderList[this]);
                        delete p[k];
                        return true;
                    }
                }
                return false;
            }
        })
        .method('removeGeometry', {
            description:'씬에 등록된 지오메트리 객체를 리스트에서 삭제',
            param:'1. id:String - 삭제하려는 id 또는 uuid',
            ret:'true or false - 삭제 성공시 true 반환',
            sample:"scene.removeGeometry('targetID');",
            value:mkRemove(geometrys)
        })
        .method('removeMaterial', {
            description:'씬에 등록된 재질 객체를 리스트에서 삭제',
            param:'1. id:String - 삭제하려는 id 또는 uuid',
            ret:'true or false - 삭제 성공시 true 반환',
            sample:"scene.removeMaterial('targetID');",
            value:mkRemove(materials)
        })
        .method('removeTexture', {
            description:'씬에 등록된 텍스쳐 객체를 리스트에서 삭제',
            param:'1. id:String - 삭제하려는 id 또는 uuid',
            ret:'true or false - 삭제 성공시 true 반환',
            sample:"scene.removeTexture('targetID');",
            value: function removeTexture(id) {
                var p = textures[this];
                if (p[id]) {
                    delete p[id];
                    return true;
                }
                return false;
            }
        }
    )
        .build();
//fn.getFragmentShader = function (id) {
//    // TODO 마일스톤0.5
//    return this._fragmentShaders[id];
//},
//fn.getVertexShader = function (id) {
//    // TODO 마일스톤0.5
//    return this._vertexShaders[id];
//},
///////////////////////////////////////////////////////////////////////////
// Remove
//fn.removeFragmentShader = function removeFragmentShader() {
//    // TODO 마일스톤0.5
//    return this;
//},
//fn.removeVertexShader = function VertexShader() {
//    // TODO 마일스톤0.5
//    return this;
//}
})();
