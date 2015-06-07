var Mesh = (function () {
    var geometry, material, culling,
        Mesh, fn, fnProp;
    
    //private
    geometry = {},
    material = {},
    culling = {};
    //shared private
    $setPrivate('Mesh', {
    }),
    
    Mesh = function Mesh(geometry, material) {
        this.geometry = geometry
        this.material = material
        culling[this] = Mesh.cullingNone;
    },
    fn = Mesh.prototype,
    fnProp = {
        culling:{
            get:$getter(culling, false, Mesh.cullingNone),
            set:function cullingSet(v) {
                if (Mesh[v]) {
                    culling[this] = v;
                } else {
                    this.error(0);
                }
            }
        },
        geometry:{
            get:$getter(geometry),
            set:function geometrySet(v) {
                if (v instanceof Geometry) {
                    geometry[this] = v;
                } else {
                    this.error(0);
                }
            }
        },
        material:{
            get:$getter(material),
            set:function materialSet(v) {
                if (v instanceof Material) {
                    material[this] = v;
                } else {
                    this.error(0);
                }
            }
        }
    },
    (function(){
        var key = 'cullingNone,cullingFront,cullingBack'.split(','), i = key.length;
        while (i--) Mesh[key[i]] = key[i];
    })();
    return Matrix.ext(Mesh, fnProp);
})();