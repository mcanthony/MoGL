var Material = (function () {
    var textureLoaded, texType,
        diffuse, normal, specular, diffuseWrap, specularNormal, 
        shading, lambert,  wireFrame, wireFrameColor, count,color,
        Material, fn, fnProp,prop;
    
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
        wireFrameColor:wireFrameColor
    }),
    prop = {},
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
    },

    Material = function Material() {
        color[this] = {'0':1,'1':1,'2':1,'3':1}
        if (arguments.length) {
            this.color = arguments.length > 1 ? arguments : arguments[0]
        }
        wireFrameColor[this] = {'0':1,'1':1,'2':1,'3':1}
        wireFrame[this] = false;
    },
    fnProp = {
        count:$getter(count, false, 0),
        color:{
            get:$getter(color),
            set:function colorSet(v) {
                var p = color[this];
                v = $color(v);
                p[0] = v[0], p[1] = v[1], p[2] = v[2], p[3] = v[3];
           }
        },
        wireFrame:$value(wireFrame),
        wireFrameColor:{
            get:$getter(wireFrameColor),
            set:function wireFrameColorSet(v) {
                var p = wireFrameColor[this];
                v = $color(v);
                p[0] = v[0], p[1] = v[1], p[2] = v[2], p[3] = v[3];
           }
        },
        shading:$value(shading, false, Shading.none),
        lambert:$value(lambert, false, 1),
        diffuse:$value(diffuse),
        isLoaded:{
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
        }
    },
    fn = Material.prototype,
    fn.addTexture = function addTexture(type, texture/*,index,blendMode*/) {
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
        //console.log('재질에서 텍스쳐 로딩이벤트 완료',this.isLoaded)
        if (this.isLoaded) this.dispatch(Material.load);
        return this;
    },
    fn.removeTexture = function removeTexture(type, texture){
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
    },
    Material.changed = 'changed';
    return MoGL.ext(Material, fnProp);
})();