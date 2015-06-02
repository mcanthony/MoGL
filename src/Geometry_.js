var Geometry = (function () {
    var calcNormal, infoCheck,
        position, vertexCount, triangleCount, vertexShaders, normal, uv, color, volume, key,
        arr,
        Geometry, fn;

    //private
    position = {}, vertexCount = {}, triangleCount = {}, 
    vertexShaders = {}, normal = {}, uv = {}, color = {}, 
    volume = {}, key = {};
        
    //공용상수정의
    $setPrivate( 'Geometry',  {
        position:position,
        vertexCount:vertexCount,
        triangleCount:triangleCount,
        vertexShaders:vertexShaders,
        normal:normal,
        uv:uv,
        color:color,
        volume:volume,
        key:key
    });
  
    //lib
    calcNormal = (function(){
        var sqr, v1, v2;
        sqr = Math.sqrt,
        v1 = {x:0,y:0,z:0}, v2 = {x:0,y:0,z:0};
        return function normal(ns, pos, idx) {
            var i, j, k, l;
            
            for (ns.length = 0, i = 0, j = pos.length; i < j; i++) ns[i] = 0.0;
            
            for(i = 0, j = idx.length; i < j; i += 3){
                k = 3 * idx[i + 1], 
                l = 3 * idx[i],
                v1.x = pos[k] - pos[l], 
                v1.y = pos[k+1] - pos[l+1], 
                v1.z = pos[k+2] - pos[l+2],
                
                l = 3 * idx[i + 2],
                v2.x = pos[l] - pos[k], 
                v2.y = pos[l+1] - pos[k+1], 
                v2.z = pos[l+2] - pos[k+2];
    
                for (k = 0; k < 3; k++) {
                    l = 3 * idx[i + k],
                    ns[l] += v1.y * v2.z - v1.z * v2.y, 
                    ns[l+1] += v1.z * v2.x - v1.x * v2.z, 
                    ns[l+2] += v1.x * v2.y - v1.y * v2.x;
                }
            }
            for (i = 0, j = pos.length; i < j; i += 3) {
                v1.x = ns[i], 
                v1.y = ns[i+1], 
                v1.z = ns[i+2],
                k = sqr(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) || 0.00001;
                ns[i] = v1.x / k, 
                ns[i+1] = v1.y / k, 
                ns[i+2] = v1.z / k;
            }
            return ns;
        };
    })(),
    infoCheck = function(v){
        return Vertex[v];
    },
    pos = [],
    Geometry = (function(){
        var pos, nm, uv, co;
        pos = [], nm = [], uv = [], co = [];
        return function Geometry(vertex, index, info) {
            var len, i, j, k, isNormal, isUV, isColor;
            
            if (!Array.isArray(vertex) || !(vertex instanceof Float32Array)) {
                this.error(0);
            } else if (!Array.isArray(index) || !(index instanceof Uint16Array)) {
                this.error(1);
            }
            pos.length = nm.length = uv.length = co.length = 0;
            if (info) {
                if (!Array.isArray(info)) {
                    this.error(3);
                } else if (!info.some(infoCheck)) {
                    this.error(4);
                }
                
                len = info.length;
                if (vertex.length % len) this.error(2);
                
                i = len;
                while (i--) info[info[i]] = i;

                isNormal = info.normalX && info.normalY && info.normalZ,
                isUV = info.u && info.v,
                isColor = info.r && info.g && info.b && info.a;

                for (i = 0, j = vertex.length / len; i < j; i++) {
                    k = len * i,
                    pos.push(vertex[k+info.x], vertex[k+info.y], vertex[k+info.z]);
                    if (isNormal) nm.push(vertex[k+info.normalX], vertex[k+info.normalY], vertex[k+info.normalZ]);
                    if (isUV) uv.push(vertex[k+info.u], vertex[k+info.v]);
                    if (isColor) co.push(vertex[k+info.r], vertex[k+info.g], vertex[k+info.b], vertex[k+info.a]);
                }
                
                position[this] = new Float32Array(pos);
            } else {
                len = 3;
                position[this] = vertex instanceof Float32Array ? vertex : new Float32Array(vertex);
            }
            if (!isNormal) calcNormal(nm, info ? pos : vertex, index);
            normal[this] = new Float32Array(nm);
            vertexCount[this] = vertex.length / len,
            triangleCount[this] = index.length / 3,
            uv[this] = new Float32Array(uv),
            color[this] = new Float32Array(co),
            index[this] = index instanceof Uint16Array ? index : new Uint16Array(index);
        };
    })(),
    fn = Geometry.prototype,
    fn.addVertexShader = function addVertexShader(id) {
        // TODO 마일스톤0.5
        this._vertexShaders[id] = id;
        return this;
    },
    fn.getVertexCount = function getVertexCount() {
        return this._vertexCount;
    },
    fn.getTriangleCount = function getTriangleCount() {
        return this._triangleCount;
    },
    fn.getVolume = function getVolume() {
        if (!this._volume) {
            var minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0;
            var t0, t1, t2, t = this._position, i = t.length;
            while (i--) {
                t0 = i * 3, t1 = t0 + 1, t2 = t0 + 2;
                minX = t[t0] < minX ? t[t0] : minX,
                    maxX = t[t0] > maxX ? t[t0] : maxX,
                    minY = t[t1] < minY ? t[t1] : minY,
                    maxY = t[t1] > maxY ? t[t1] : maxY,
                    minZ = t[t2] < minZ ? t[t2] : minZ,
                    maxZ = t[t2] > maxZ ? t[t2] : maxZ;
            }
            this._volume = [maxX - minX, maxY - minY, maxZ - minZ];
        }
        return this._volume;
    },
    fn.removeVertexShader = function removeVertexShader(id) {
        // TODO 마일스톤0.5
        return delete this._vertexShaders[id], this;
    };
    return MoGL.ext(Geometry, MoGL);
})();