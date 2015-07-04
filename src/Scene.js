'use strict'
var Scene = (function () {
    'use strict';
    var vertexShaderParser, fragmentShaderParser,
        children,childrenArray, cameras, textures, materials, geometrys, vertexShaders, fragmentShaders, updateList,baseLightRotate;
    //private
    children = {},
    childrenArray = {},
    cameras = {},
    baseLightRotate={},
    textures = {},
    materials = {},
    geometrys = {},
    vertexShaders = {},
    fragmentShaders = {},
    updateList = {},
    //shared private
    $setPrivate('Scene', {
        children : children,
        childrenArray : childrenArray
    }),
    //lib
    vertexShaderParser = makeUtil.vertexShaderParser,
    fragmentShaderParser = makeUtil.fragmentShaderParser;
    return MoGL.extend('Scene', {
        description:'실제 렌더링될 구조체는 Scene별로 집결됨.\n- ' +
        'Scene은 렌더링과 관련된 [Mesh](Mesh.md), [Camera](Camera.md), [Light](Light.md) 등을 포함하고 이들 객체가 공유하며 활용하는 기초 자원으로서 vertex shader, fragment shader, [Texture](Texture.md), [Material](Material.md), [Geometry](Geometry.md) 등을 등록하여 관리한다',
        sample:[
            'var scene = new Scene();'
        ],
        value:function Scene() {
            // for JS
            children[this] = {},
            childrenArray[this] = [],
            cameras[this] = {},
            textures[this] = {},
            materials[this] = {},
            geometrys[this] = {},
            vertexShaders[this] = {},
            fragmentShaders[this] = {},
            updateList[this] = {
                mesh : [],
                material : [],
                camera : [],
                merged : [],
                removeMerged : [],
                update : []
            },
            baseLightRotate[this] = [0, -1, -1];

            this.addVertexShader(Shader.colorMergeVShader), this.addFragmentShader(Shader.colorMergeFShader),
            this.addVertexShader(Shader.colorVertexShader), this.addFragmentShader(Shader.colorFragmentShader),
            this.addVertexShader(Shader.wireFrameVertexShader), this.addFragmentShader(Shader.wireFrameFragmentShader),
            this.addVertexShader(Shader.bitmapVertexShader), this.addFragmentShader(Shader.bitmapFragmentShader),
            this.addVertexShader(Shader.bitmapVertexShaderGouraud), this.addFragmentShader(Shader.bitmapFragmentShaderGouraud),
            this.addVertexShader(Shader.colorVertexShaderGouraud), this.addFragmentShader(Shader.colorFragmentShaderGouraud),
            this.addVertexShader(Shader.colorVertexShaderPhong), this.addFragmentShader(Shader.colorFragmentShaderPhong),
            this.addVertexShader(Shader.toonVertexShaderPhong), this.addFragmentShader(Shader.toonFragmentShaderPhong),
            this.addVertexShader(Shader.bitmapVertexShaderPhong), this.addFragmentShader(Shader.bitmapFragmentShaderPhong),
            this.addVertexShader(Shader.bitmapVertexShaderBlinn), this.addFragmentShader(Shader.bitmapFragmentShaderBlinn),
            this.addVertexShader(Shader.postBaseVertexShader), this.addFragmentShader(Shader.postBaseFragmentShader);
        }
    })
    .field('updateList', {
            description: "world가 render 함수를 실행하기전 GPU업데이트가 되어야할 목록.",
            sample: [
                "console.log(scene.updateList);"
            ],
            defaultValue: '{ mesh : [], material : [], camera : [] }\n- 업데이트 완료후 각 리스트는 초기화 됨.',
            get: $getter(updateList)
        }
    )
    .field('vertexShaders', {
            description: "현재 씬이 가지고있는 버텍스 쉐이더 자바스크립트 정보",
            sample: [
                "console.log(scene.vertexShaders);"
            ],
            defaultValue: "{}",
            get: $getter(vertexShaders)
        }
    )
    .field('fragmentShaders', {
            description: "현재 씬이 가지고 있는 프레그먼트 쉐이더 자바스크립트 정보",
            sample: [
                "console.log(scene.fragmentShaders);"
            ],
            defaultValue: "{}",
            get: $getter(fragmentShaders)
        }
    )
    .field('baseLightRotate', {
            description: "디렉셔널 라이트 방향 설정, -1~1 사이값으로 입력(0.4에서 노멀라이즈처리)",
            sample: [
                "var scene = new Scene();",
                "scene.baseLightRotate = [0,1,0];",
                "console.log(scene.baseLightRotate);"
            ],
            defaultValue: "[0, -1, -1]",
            set: $setter(baseLightRotate),
            get: $getter(baseLightRotate)
        }
    )
    .field('cameras', {
            description: "씬에 등록된 카메라 리스트",
            sample: [
                "var scene = new Scene();",
                "scene.addChild(new Camera);",
                "console.log(scene.cameras); // 오브젝트 형식의 카메라 리스트를 반환"
            ],
            defaultValue: "{}",
            get: $getter(cameras)
        }
    )
    .field('children', {
            description: "씬에 등록된 자식 리스트를 오브젝트 형식으로 반환",
            sample: [
                "console.log(scene.children);"
            ],
            defaultValue: "{}",
            get: $getter(children)
        }
    )
    .field('childrenArray', {
            description: "씬에 등록된 자식 리스트를 배열 형식으로 반환",
            sample: [
                "console.log(scene.childrenArray);"
            ],
            defaultValue: "[]",
            get: $getter(childrenArray)
        }
    )
    .method('addMesh', {
            description: [
                'Mesh객체를 추가함.'
            ],
            param: [
                'mesh:Mesh - 메쉬객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var geo = new Geometry([],[]);",
                "var mat = new Material();",
                "var mesh = new Mesh(geo,mat);",
                "scene.addMesh(mesh);"
            ],
            exception: [
                "'Scene.addMesh:0' - 이미 등록된 메쉬객체를 등록하려고 할 때",
                "'Scene.addMesh:1' - 메쉬가 아닌 객체를 등록하려고 할 때"
            ],
            value : function(v){
                var p = children[this], p2 = updateList[this], mat;
                if (p[v]) this.error(0);
                if (!(v instanceof Mesh)) this.error(1);
                p[v] = v;
                p2.mesh.push(v);
                mat = v.material;
                mat.addEventListener(Material.load, function() {
                    //console.log('메쉬의 재질이 변경되었다!')
                    var t = this.diffuse;
                    if(t){
                        var i = t.length;
                        while(i--){
                            if(p2.material.indexOf(t[i].tex) == -1) {
                                p2.material.push(t[i].tex);
                                //console.log('새로운 텍스쳐 업데이트 추가',t[i].tex.isLoaded)
                            }
                        }
                    }
                    t = this.normal;
                    if(t){
                        var i = t.length;
                        while(i--){
                            if(p2.material.indexOf(t[i].tex) == -1) {
                                p2.material.push(t[i].tex);
                                //console.log('새로운 텍스쳐 업데이트 추가',t[i].tex.isLoaded)
                            }
                        }
                    }
                });
                v.addEventListener(Mesh.changed, function() {
                    p2.mesh.push(v);
                });

                v.addEventListener(MoGL.updated, function () {
                    p2.update.push(this)
                });


                mat.dispatch(Material.load,mat);
                if(childrenArray[this].indexOf(v) == -1) {
                    childrenArray[this].push(v);
                }
                p2.merged.push(v)
                return this;
            }
        }
    )
    .method('addCamera', {
            description: [
                '카메라 객체를 추가함.'
            ],
            param: [
                'camera:Camera - 카메라 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var camera = new Camera();",
                "scene.addCamera(camera);"
            ],
            exception: [
                "'Scene.addCamera:0' : 이미 등록된 카메라객체를 등록하려고 할 때",
                "'Scene.addCamera:1' : 카메라가 아닌 객체를 등록하려고 할 때"
            ],
            value: function addCamera(v) {
                var p = cameras[this];
                if (p[v]) this.error(0);
                if (!(v instanceof Camera)) this.error(1);
                p[v] = v;
                updateList[this].camera.push(v);
                return this;
            }
        }
    )
    .method('addChild', {
            description: [
                '자식 객체를 추가함. 메쉬나 카메라 객체가 자식으로 올 수 있음'
            ],
            param: [
                'mesh:Mesh - 메쉬 객체',
                'camera:Camera - 카메라 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var camera = new Camera();",
                "scene.addChild(camera);"
            ],
            exception: [
                "'Scene.addChild:0' - 카메라나 메쉬객체가 아닌 객체를 추가하려고 할 때"
            ],
            value: function addChild(v) {
                if (v instanceof Mesh)  this.addMesh(v);
                else if (v instanceof Camera)  this.addCamera(v);
                else this.error(0);
                return this;
            }
        }
    )
    .method('addGeometry', {
            description: [
                '지오메트리 객체를 추가함'
            ],
            param: [
                'geometry:Geometry - 지오메트리 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var geo = new Geometry([],[]);",
                "scene.addGeometry(camera);"
            ],
            exception: [
                "'Scene.addGeometry:0' - 이미 등록된 지오메트리를 등록하려 할 때",
                "'Scene.addGeometry:1' - 지오메트리 타입이 아닌 객체를 등록하려 할 때"
            ],
            value: function (v) {
                var p = geometrys[this];
                if (p[v]) this.error(0);
                if (!(v instanceof Geometry)) this.error(1);
                p[v] = v;
                return this;
            }
        }
    )
    .method('addMaterial', {
            description: [
                '재질 객체를 추가함'
            ],
            param: [
                'material:Material - 재질 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var mat = new Material();",
                "scene.addMaterial(mat);"
            ],
            exception: [
                "'Scene.addMaterial:0' - 이미 등록된 재질을 등록하려 할 때",
                "'Scene.addMaterial:1' - Material 타입이 아닌 객체를 등록하려 할 때"
            ],
            value: function addMaterial(v) {
                var p = materials[this];
                if (p[v]) this.error(0);
                if (!(v instanceof Material)) this.error(1);
                p[v] = v;
                return this;
            }
        }
    )
    .method('addTexture', {
            description: [
                '텍스쳐 객체를 추가함'
            ],
            param: [
                'texture:Texture - 텍스쳐 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "var scene = new Scene();",
                "var texture = new Texture();",
                "scene.addTexture(texture);"
            ],
            exception: [
                "'Scene.addTexture:0' - 이미 등록된 텍스쳐를 등록하려 할 때",
                "'Scene.addTexture:1' - Texture 타입이 아닌 객체를 등록하려 할 때"
            ],
            value: function addTexture(v) {
                var p = textures[this];
                if (p[v]) this.error(0);
                if (!(v instanceof Texture)) this.error(1);
                p[v] = v;
                return this;
            }
        }
    )
    .method('addFragmentShader', {
            description: [
                '프레그먼트 쉐이더 객체를 추가함'
            ],
            param: [
                'fragmentShader:Shader - 프레그먼트 쉐이더 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "scene.addFragmentShader(fragmentShader);"
            ],
            exception: [
                "'Scene.addFragmentShader:0' - 이미 등록된 프레그먼트 쉐이더를 등록하려 할 때"
            ],
            value: function addFragmentShader(v) {
                var p = fragmentShaders[this];
                if (p[v.code.id]) this.error(0);
                p[v.code.id] = fragmentShaderParser(v);
                return this;
        }
    })
    .method('addVertexShader', {
            description: [
                '버텍스 쉐이더 객체를 추가함'
            ],
            param: [
                'vertexShader:Shader - 버텍스 쉐이더 객체'
            ],
            ret: [
                'this - 메서드체이닝을 위해 자신을 반환함.'
            ],
            sample: [
                "scene.addVertexShader(vertexShader);"
            ],
            exception: [
                "'Scene.addVertexShader:0' - 이미 등록된 버텍스 쉐이더를 등록하려 할 때"
            ],
            value: function addVertexShader(v) {
                var p = vertexShaders[this];
                if (p[v.code.id]) this.error(0);
                p[v.code.id] = vertexShaderParser(v);
                return this;
            }
    })
    .method('getMesh',{
            description: [
                '씬에 등록된 Mesh객체를 검색'
            ],
            param: [
                'id:String - 찾고자 하는 메쉬의 id;'
            ],
            ret: [
                'Mesh or null'
            ],
            sample: [
                "scene.getMesh('MeshID')"
            ],
            value: function getMesh(id) {
                var p = children[this],k;
                for(k in p){
                    if(p[k].id == id){
                        return p[k];
                    }
                }
                return null;
            }
        }
    )
    .method('getCamera', {
            description: [
                '씬에 등록된 Camera객체를 검색'
            ],
            param: [
                'id:String - 찾고자 하는 Camera의 id'
            ],
            ret: [
                'Camera or null'
            ],
            sample: [
                "scene.getCamera('CameraID');"
            ],
            value: function getCamera(id) {
                var p = cameras[this], k;
                for (k in p) {
                    if (p[k].id == id) {
                        return p[k];
                    }
                }
                return null;
            }
        }
    )
    .method('getChild', {
            description: [
                '씬에 등록된 자식객체(Camera or Mesh) 검색'
            ],
            param: [
                'id:String - 찾고자 하는 자식의 id'
            ],
            ret: [
                'Mesh/Camera or null'
            ],
            sample: [
                "scene.getChild('CameraID');"
            ],
            value : function getChild(id) {
                var t;
                if(t = this.getMesh(id)) return t;
                if(t = this.getCamera(id)) return t;
                return null;
            }
        }
    )
    .method('getGeometry', {
            description: [
                '씬에 등록된 지오메트리 객체를 검색'
            ],
            param: [
                'id:String - 찾고자 하는 지오메트리 객체의 id'
            ],
            ret: [
                'Geometry or null'
            ],
            sample: [
                "scene.getGeometry('GeometryID');"
            ],
            value: function getGeometry(id) {
                var p = geometrys[this], k;
                for (k in p) {
                    if (p[k].id == id) {
                        return p[k];
                    }
                }
                return null;
            }
        }
    )
    .method('getMaterial', {
            description: [
                '씬에 등록된 재질 객체를 검색'
            ],
            param: [
                'id:String - 찾고자 하는 재질 객체의 id'
            ],
            ret: [
                'Material or null'
            ],
            sample: [
                "scene.getMaterial('MaterialID');"
            ],
            value: function getMaterial(id) {
                var p = materials[this], k;
                for (k in p) {
                    if (p[k].id == id) {
                        return p[k];
                    }
                }
                return null;
            }
        }
    )
    .method('getTexture', {
            description: [
                '씬에 등록된 텍스쳐 객체를 검색'
            ],
            param: [
                'id:String - 찾고자 하는 텍스쳐 객체의 id'
            ],
            ret: [
                'Texture or null'
            ],
            sample: [
                "scene.getTexture('TextureID');"
            ],
            value: function getTexture(id) {
                var p = textures[this], k;
                for (k in p) {
                    if (p[k].id == id) {
                        return p[k];
                    }
                }
                return null;
            }
        }
    )
    .method('removeChild', {
            description: [
                '씬에 등록된 객체를 자식리스트에서 삭제'
            ],
            param: [
                'id:String - 삭제 대상 객체의 id'
            ],
            ret: [
                'true or false - 삭제성공시 true 반환'
            ],
            sample: [
                "scene.removeChild('targetID');"
            ],
            value: function removeChild(id) {
                var p,p2, k, result;
                p2 = updateList[this]
                p = children[this],
                    result = false;
                for (k in p) {
                    if (p[k].id == id) {
                        childrenArray[this].splice(childrenArray[this].indexOf(p[k]), 1);
                        p[k].removeEventListener(MoGL.updated)
                        p2.removeMerged.push(p[k])
                        delete p[k],
                        result = true;
                    }
                }

                return result;
            }
        }
    )
    .method('removeGeometry', {
            description: [
                '씬에 등록된 지오메트리 객체를 리스트에서 삭제'
            ],
            param: [
                'id:String - 삭제 대상 객체의 id'
            ],
            ret: [
                'true or false - 삭제성공시 true 반환'
            ],
            sample: [
                "scene.removeGeometry('targetID');"
            ],
            value: function removeGeometry(id) {
                var p, k, result;
                p = geometrys[this],
                    result = false;
                for (k in p) {
                    if (p[k].id == id) {
                        delete p[k],
                        result = true;
                    }
                }
                return result;
            }
        }
    )
    .method('removeMaterial', {
            description: [
                '씬에 등록된 재질 객체를 리스트에서 삭제'
            ],
            param: [
                'id:String - 삭제 대상 객체의 id'
            ],
            ret: [
                'true or false - 삭제성공시 true 반환'
            ],
            sample: [
                "scene.removeMaterial('targetID');"
            ],
            value: function removeMaterial(id) {
                var p, k, result;
                p = materials[this],
                    result = false;
                for (k in p) {
                    if (p[k].id == id) {
                        delete p[k],
                        result = true;
                    }
                }
                return result;
            }
        }
    )
    .method('removeTexture', {
            description: [
                '씬에 등록된 텍스쳐 객체를 리스트에서 삭제'
            ],
            param: [
                'id:String - 삭제 대상 객체의 id'
            ],
            ret: [
                'true or false - 삭제성공시 true 반환'
            ],
            sample: [
                "scene.removeTexture('targetID');"
            ],
            value: function removeTexture(id) {
                var p, result;
                p = textures[this],
                    result = false;
                if (p[id]) {
                    delete p[id],
                    result = true;
                }
                return result;
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
