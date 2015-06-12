var Material = (function () {
    var textureLoaded, texType,
        diffuse, normal, specular, diffuseWrap, specularNormal, 
        shading, lambert,  wireFrame, wireFrameColor, count,color;
    
    //private
    shading = {},
    lambert = {},
    diffuse = {},
    normal = {},
    specular = {},
    diffuseWrap = {},
    specularNormal = {},
    wireFrame = {},
    wireFrameColor = {},
    count = {},
    color = {},
    //shared private
    $setPrivate('Material', {
        color:color,
        wireFrame:wireFrame,
        wireFrameColor:wireFrameColor,
        shading:shading,
        lambert:lambert,
        diffuse:diffuse
    }),
    //lib
    textureLoaded = function(mat){
        this.removeEventListener(Texture.load, textureLoaded),
        mat.dispatch(Material.changed);
        if (mat.isLoaded) mat.dispatch(Material.load);
    },
    texType = {
        diffuse:diffuse,
        specular:specular,
        diffuseWrap:diffuseWrap,
        normal:normal,
        specularNormal:specularNormal
    };
    return MoGL.extend('Material',{
        description:[
            "모든 재질의 부모가 되는 클래스로 Material 자체는 아무런 빛의 속성을 적용받지 않는 재질임.",
            "* Material의 메서드는 대부분 메서드체이닝을 지원함."
        ],
        param:[
            '?color:string - 재질의 기본적인 색상. 생략하면 색상 없음. 다음과 같은 형태가 올 수 있음.',
            'r, g, b, a : 각각 0~1 사이의 소수를 받으며 각각 대응함.'
        ],
        sample:[
            "var mat1 = new Material('#f00');",
            "var mat2 = new Material('#ff0000');",
            "var mat3 = new Material('#ff00000.8');",
            "var mat4 = new Material( 0xff/0xff, 0xaf/0xff, 0x45/0xff, 0.5 );",
            "",
            "//팩토리함수로도 사용가능",
            "var mat5 = Material('#ff00000.8');"
        ],
        value:function Material() {
            color[this] = [1,1,1,1]
            if (arguments.length) {
                this.color = arguments.length > 1 ? arguments : arguments[0]
            }
            wireFrameColor[this] = [Math.random(),Math.random(),Math.random(),1]
            wireFrame[this] = false;
            lambert[this] = 1
            shading[this] = Shading.none
        }
    })
    .field('count', $getter(count, false, 0))
    .field('color', {
        get:$getter(color),
        set:function colorSet(v) {
            var p = color[this];
            v = $color(v);
            p[0] = v[0], p[1] = v[1], p[2] = v[2], p[3] = v[3];
       }
    })
    .field('wireFrame', $value(wireFrame))
    .field('wireFrameColor', {
        get:$getter(wireFrameColor),
        set:function wireFrameColorSet(v) {
            var p = wireFrameColor[this];
            v = $color(v);
            p[0] = v[0], p[1] = v[1], p[2] = v[2], p[3] = v[3];
       }
    })
    .field('shading', $value(shading))
    .field('lambert', $value(lambert))
    .field('diffuse', $value(diffuse))
    .field('isLoaded', {
        get:function(mat) {
            var type, tex, i;
            for (type in texType) {
                if (tex = texType[type][mat]) {
                    i = tex.length;
                    while (i--) {
                        if(!tex[i].tex.isLoaded) return false;
                    }
                }
            }
            return true;
        }
    })
    .method('addTexture', {
        description:[
            '[Mesh](Mesh.md)를 통해 최종적으로 포함될 [Scene](Scene.md)에 등록된 textureId를 사용함. 같은 textureId는 두번 등록되지 않음.',
            '* [Scene](Scene.md)에 직접 등록되는 경우는 id를 [addMaterial](Scene.md#addmaterial-idstring-materialmaterial-)시점에 평가함.',
            '* [Mesh](Mesh.md)에서 직접 생성하여 삽입하는 경우는 [addChild](Scene.md#addchild-idstring-meshmesh-)시점에 평가함.',
            '* 이미 직간접적으로 [Scene](Scene.md)에 포함된 경우는 메서드호출시점에 평가함.'
        ],
        param:[
            'type:string - 해당 텍스쳐가 어떠한 타입에 포함될 것인가를 결정함. 다음의 값이 올 수 있음.',
            'textureId:string - 최종 포함될 [Scene](Scene.md)에 등록된 texture의 id.',
            '?index:int - 중첩되는 이미지의 경우 순번을 정의함. 생략하거나 null 이면 마지막 인덱스 + 1.',
            '?blendMode:string - 중첩되는 이미지의 경우 아래의 이미지와 합성되는 속성을 정의함. 첫번째 텍스쳐는 적용되지 않고 기본값은 \'alpha\' 이고 다음과 같은 값이 올 수 있음.'
        ],
        exception:[
            '* \'Material.addTexture:0\' - 이미 등록된 경우 [Scene](Scene.md)에 존재하지 않는 textureId를 지정.',
            '* \'Material.addTexture:1\' - 이미 등록된 textureId를 다시 등록하려고 시도하는 경우.'
        ],
        ret:[
            'this - 메서드체이닝을 위해 자신을 반환함.'
        ],
        sample:[
            "var lobby = world.getScene('lobby');",
            "",
            "// 텍스쳐용 이미지 등록",
            "lobby.addTexture( 'floor', document.getElementById('img0') );",
            "lobby.addTexture( 'scratch', document.getElementById('img1') );",
            "",
            "// Material 생성 및 Scene에 등록",
            "var mat = lobby.addMaterial( 'floor', new Material()).getMaterial('floor');",
            "",
            "try{",
            "    //이미 Scene에 등록된 Material이므로 메서드 호출시점에 평가",
            "    mat.addTexture('floor1');  //floor1가 존재하지 않으므로 에러발생",
            "}catch(e){",
            "    console.log( e ); // 'Material.addTexture:0'",
            "    mat.addTexture('floor'); //floor는 존재하므로 문제없음.",
            "}",
            "//다중 texture 등록",
            "mat.addTexture('scratch', null, BlendMode.multiply );",
            "",
            "try{",
            "    //이미 등록된 textureId를 다시 등록하려고 하면 에러발생.",
            "    mat.addTexture('floor');",
            "}catch(e){",
            "    console.log(e); //'Material.addTexture:1'",
            "}",
            "",
            "//미등록된 Material이므로 무조건 통과됨.",
            "var mat1 = new Material('#f00').addTexture('temp');"
        ],
        value:function addTexture(type, texture/*,index,blendMode*/) {
            var p;
            if (!texType[type]) this.error(0);
            if (!(texture instanceof Texture)) this.error(1);

            //lazy초기화
            p = texType[type];
            if (this in p) {
                p = p[this];
                if (p[texture]) this.error(2); //이미 있는 텍스쳐
            } else {
                p = p[this] = [];
            }

            //중복검사용 마킹
            p[texture] = 1;
            //로딩전 텍스쳐에게는 이벤트리스너를 걸어줌
            if(!texture.isLoaded) {
                texture.addEventListener(Texture.load, textureLoaded, null, this);
            }

            //실제 텍스쳐구조체에는 텍스쳐와 블랜드모드가 포함됨
            texture = {tex:texture};

            //블랜드모드가 들어온 경우의 처리
            if (arguments.length > 3) {
                texture.blendMode = arguments[3];
            }
            //인덱스 제공 여부에 따라 텍스쳐리스트에 삽입
            if (arguments.length > 2 && typeof arguments[2] !== 'number') {
                p.splice(arguments[2], 0, texture);
            }else{
                p[p.length] = texture;
            }
            //changed이벤트는 무조건 발생함.
            this.dispatch(Material.changed);
            if (this.isLoaded) this.dispatch(Material.load);
            return this;
        }
    })
    .method('removeTexture', {
        description:[
            'addTexture를 통해 등록된 텍스쳐를 제거함.'
        ],
        ret:[
            'this - 메서드체이닝을 위해 자신을 반환함.'
        ],
        sample:[
            "var mat1 = new Material('#f00').addTexture('temp');",
            "mat.removeTexture('temp');"
        ],
        value:function removeTexture(type, texture){
            var p, key, i;
            if (texType[type]) {
                p = texType[type][this];
                if (p[texture]) {
                    p[texture] = 0;
                    i = p.length;

                    p.splice(p.indexOf(texture), 1);
                }
            } else {
                for (key in texType) {
                    p = texType[key][this];
                    if (p[texture]) {
                        p[texture] = 0;
                        p.splice(p.indexOf(texture), 1);
                    }
                }
            }
            this.dispatch(Material.changed);
            return this;
        }
    })
    .event('changed', 'changed')
    .build();
})();