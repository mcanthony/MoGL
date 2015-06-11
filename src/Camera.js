var Camera = (function () {
    var PERPIR, value, getter,
        prop;

    //lib
    PERPIR = PI / 180 * .5,
    //private
    prop = {},
    //shared private
    $setPrivate('Camera', {
    });
    return Matrix.extend( function Camera() {
        Object.seal(prop[this] = {
            r:0, g:0, b:0, a:1,
            fov:55, near:0.1, far:10000,
            fog:false, fogColor:null, fogNear:0, fogFar:0,
            visible:true,
            antialias:false,
            mode:Camera.perspective,
            //filters:{},
            cvs:null,
            renderArea:null,
            projectionMatrix:Matrix()
        }),
        this.z =10,
        this.lookAt(0,0,0);
    })
    .field('clipPlaneNear', $value(prop, 'near'))
    .field('clipPlaneFar', $value(prop, 'far'))
    .field('visible', {
        get: $getter(prop, 'visible'),
        set: function visibleSet(v) {
            if(typeof v =='number'){
                v = v ? true : false
            }
            prop[this].visible =v
        }
    })
    .field('antialias', {
        get: $getter(prop, 'antialias'),
        set: function antialiasSet(v) {
            if(typeof v =='number'){
                v = v ? true : false
            }
            prop[this].antialias =v
        }
    })
    .field('fogColor', {
        get:$getter(prop, 'fogColor'),
        set:function fogColorSet(v){
            var p = prop[this];
            p.fogColor = $color(v).slice(0),
            p.fog = true;
        }
    })
    .field('fogNear', {
        get:$getter(prop, 'fogNear'),
        set:function fogNearSet(v){
            var p = prop[this];
            p.fogNear = v,
            p.fog = true;
        }
    })
    .field('fogFar', {
        get:$getter(prop, 'fogFar'),
        set:function fogFarSet(v){
            var p = prop[this];
            p.fogFar = v,
            p.fog = true;
        }
    })
    .field('fov', {
        get:$getter(prop, 'fov'),
        set:function fovSet(v){
            var p = prop[this];
            if (typeof v == 'number') {
                p.fov = v;
            } else if ('0' in v && '1' in v) {
                p.fov = CEIL(2 * ATAN(TAN(v[2] * PERPIR) * (v[1] / v[0])) * PERPI);
            }
        }
    })
    .field('backgroundColor', {
        get:(function(){
            var a = [];
            return function backgroundColorGet() {
                var p = prop[this];
                a[0] = p.r, a[1] = p.g, a[2] = p.b, a[3] = p.a
                return a;
            };
        })(),
        set:function backgroundColorSet(v) {
            var p = prop[this];
            v = $color(v);
            p.r = v[0], p.g = v[1], p.b = v[2], p.a = v[3];
       }
    })
    .field('fog', {
        get:function fogGet(){
            return prop[this].fog ? true : false;
        }
    })
    .field('mode', {
        get:$getter(prop, 'mode'),
        set:function modeSet(v) {
            if (Camera[v]) {
                prop[this].mode = v;
            } else {
                this.error(0);
            }
        }
    })
    .field('cvs', {
        get:$getter(prop, 'cvs'),
        set:function modeSet(v) {
            prop[this].cvs = v;
        }
    })
    .field('renderArea', {
        get: $getter(prop, 'renderArea'),
        set: function renderAreaSet(v) {
            var tw, th,c;
            c = prop[this].cvs,
            tw = c.width,
            th = c.height,
            //console.log(typeof x == 'string' ? tw * x.replace('%', '') : x);
            prop[this].renderArea = [
                typeof v[0] == 'string' ? tw * v[0].replace('%', '') * 0.01 : v[0],
                typeof v[1] == 'string' ? th * v[1].replace('%', '') * 0.01 : v[1],
                typeof v[2] == 'string' ? tw * v[2].replace('%', '') * 0.01 : v[2],
                typeof v[3] == 'string' ? th * v[3].replace('%', '') * 0.01 : v[3],
            ];
        }
    })
    .field('projectionMatrix', {
        get : function projectionMatrixGet(){
            return prop[this].projectionMatrix
        }
    })
    .method('resetProjectionMatrix', function resetProjectionMatrix(){
        var tMatrix, tArea,p;
        p = prop[this]
        tMatrix = p.projectionMatrix,
        tArea = p.renderArea,
        tMatrix.matIdentity()
        if(this._mode == '2d'){
            tMatrix.raw[0] = 2 / tArea[2]
            tMatrix.raw[5] = -2 / tArea[3]
            tMatrix.raw[10] = 0
            tMatrix.raw[12] = -1
            tMatrix.raw[13] = 1
        }else {
            if (tArea) tMatrix.matPerspective(p.fov, tArea[2] / tArea[3], p.near, p.far);
            else tMatrix.matPerspective(p.fov, p.cvs.width/p.cvs.height, p.near, p.far);
        }
        return this;
    })
    .constant('resize', 'resize')
    .constant('othogonal', 'othogonal')
    .constant('perspective', 'perspective')
    .build();
    /*마일스톤0.5
    fn.getFilters = function getFilters(){
        var result = [],t = this._filters;
        for(var k in t) result.push(k);
        return result;
    },
    fn.setFilter = function setFilter(filter,needIe){
        var result;
        if(arguments[1]) result = arguments[1];
        else {
            switch (filter) {
                case Filter.anaglyph :
                    result = {
                        offsetL: 0.008,
                        offsetR: 0.008,
                        gIntensity: 0.7,
                        bIntensity: 0.7
                    };
                    break;
                case Filter.bevel :
                    result = {
                        distance: 4.0,
                        angle: 45,
                        highlightColor: '#FFF',
                        highlightAlpha: 1.0,
                        shadowColor: '#000',
                        shadowAlpha: 1.0,
                        blurX: 4.0,
                        blurY: 4.0,
                        strength: 1,
                        quality: 1,
                        type: "inner",
                        knockout: false
                    };
                    break;
                case Filter.bloom :
                    result = {
                        threshold: 0.3,
                        sourceSaturation: 1.0,
                        bloomSaturation: 1.3,
                        sourceIntensity: 1.0,
                        bloomIntensity: 1.0
                    };
                    break;
                case Filter.blur :
                    result = {
                        blurX: 4.0,
                        blurY: 4.0,
                        quality: 1
                    };
                    break;
                case Filter.colorMatrix :
                    result = {};
                    break;
                case Filter.convolution :
                    result = {
                        matrixX: 0,
                        matrixY: 0,
                        matrix: null,
                        divisor: 1.0,
                        bias: 0.0,
                        preserveAlpha: true,
                        clamp: true,
                        color: 0,
                        alpha: 0.0
                    };
                    break;
                case Filter.displacementMap :
                    result = {
                        mapTextureID: null,
                        mapPoint: null,
                        componentX: 0,
                        componentY: 0,
                        scaleX: 0.0,
                        scaleY: 0.0,
                        mode: "wrap",
                        color: 0,
                        alpha: 0.0
                    };
                    break;
                case Filter.fxaa :
                    result = {};
                    break;
                case Filter.glow :
                    result = {
                        color: '#F00',
                        alpha: 1.0,
                        blurX: 6.0,
                        blurY: 6.0,
                        strength: 2,
                        quality: 1,
                        inner: false,
                        knockout: false
                    };
                    break;
                case Filter.invert :
                    result = {};
                    break;
                case Filter.mono :
                    result = {};
                    break;
                case Filter.sepia :
                    result = {};
                    break;
                case Filter.shadow :
                    result = {
                        distance: 4.0,
                        angle: 45,
                        color: 0,
                        alpha: 1.0,
                        blurX: 4.0,
                        blurY: 4.0,
                        strength: 1.0,
                        quality: 1,
                        inner: false,
                        knockout: false,
                        hideObject: false
                    };
                    break;
            }
        }
        this._filters[filter] = result;
        return this;
    },
    fn.removeFilter = function removeFilter(filter){
        delete this._filters[filter];
        return this;
    },
    */
})();

