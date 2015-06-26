var Geometry = (function () {
    'use strict';
    var position, vertexCount, triangleCount, vertexShaders, normal,index, uv, color, volume, key;

    //private
    position = {}, normal = {}, uv = {}, color = {},index = {},
    vertexCount = {}, triangleCount = {}, vertexShaders = {},
    volume = {};
    //shared private
    $setPrivate('Geometry', {
    });
    return MoGL.extend('Geometry',{
        description: "Geometry 클래스",
        param : [
            "vertex : 지오메트리를 구성할 버텍스 배열 정보 (Array or Float32Array)",
            "index : 지오메트리를 구성할 인덱스 배열 정보 (Array or Uint16Array)"
        ],
        sample: [
            "var geo = new Geometry([],[]);"
        ],
        exception:[
            "'Geometry.vertexSet:0' - 첫번째 인자가 Array나 Float32Array가 아닌 경우",
            "'Geometry.indexSet:1' - 두번째 인자가 Array나 Uint16Array가 아닌 경우",
            "'Geometry.infoSet:2' - 첫번째 인자가 세번째 인자의 갯수로 나누어 떨어지지 않는 경우 ",
            "'Geometry.infoSet:3' - 세번째 인자가 Array가 아닌 경우",
            "'Geometry.infoSet:4' - 세번째 인자내 요소가 올바른 상수가 아닌 경우"
        ],
        value:(function(){
            var calcNormal, infoCheck, pos, nm, tUV, tCo;
            calcNormal = (function () {
                var sqr, v1, v2;
                sqr = Math.sqrt,
                v1 = {x: 0, y: 0, z: 0}, v2 = {x: 0, y: 0, z: 0};
                return function calcNormal(ns, pos, idx) {
                    var i, j, k, l;
                    for (ns.length = 0, i = 0, j = pos.length; i < j; i++) ns[i] = 0.0;
                    for (i = 0, j = idx.length; i < j; i += 3) {
                        k = 3 * idx[i + 1],
                        l = 3 * idx[i],
                        v1.x = pos[k] - pos[l],
                        v1.y = pos[k + 1] - pos[l + 1],
                        v1.z = pos[k + 2] - pos[l + 2],
                        l = 3 * idx[i + 2],
                        v2.x = pos[l] - pos[k],
                        v2.y = pos[l + 1] - pos[k + 1],
                        v2.z = pos[l + 2] - pos[k + 2];
                        for (k = 0; k < 3; k++) {
                            l = 3 * idx[i + k],
                            ns[l] += v1.y * v2.z - v1.z * v2.y,
                            ns[l + 1] += v1.z * v2.x - v1.x * v2.z,
                            ns[l + 2] += v1.x * v2.y - v1.y * v2.x;
                        }
                    }
                    for (i = 0, j = pos.length; i < j; i += 3) {
                        v1.x = ns[i],
                        v1.y = ns[i + 1],
                        v1.z = ns[i + 2],
                        k = sqr(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) || 0.00001,
                        ns[i] = v1.x / k,
                        ns[i + 1] = v1.y / k,
                        ns[i + 2] = v1.z / k;
                    }
                    return ns;
                };
            })(),
            infoCheck = function (v) {
                return Vertex[v];
            },
            pos = [], nm = [], tUV = [], tCo = [];
            return function Geometry(vertex, tIndex, info) {
                var len, i, j, k, isNormal, isUV, isColor;
                if (!Array.isArray(vertex) && !(vertex instanceof Float32Array)) {
                    this.error(0);
                } else if (!Array.isArray(tIndex) && !(tIndex instanceof Uint16Array)) {
                    this.error(1);
                }
                pos.length = nm.length = tUV.length = tCo.length = 0;
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
                        if (isUV) tUV.push(vertex[k+info.u], vertex[k+info.v]);
                        if (isColor) tCo.push(vertex[k+info.r], vertex[k+info.g], vertex[k+info.b], vertex[k+info.a]);
                    }
                    position[this] = new Float32Array(pos);
                } else {
                    len = 3;
                    position[this] = vertex instanceof Float32Array ? vertex : new Float32Array(vertex);
                }
                if (!isNormal) calcNormal(nm, info ? pos : vertex, tIndex);
                normal[this] = new Float32Array(nm);
                vertexCount[this] = vertex.length / len,
                triangleCount[this] = tIndex.length / 3,
                uv[this] = new Float32Array(tUV),
                color[this] = new Float32Array(tCo),
                index[this] = tIndex instanceof Uint16Array ? tIndex : new Uint16Array(tIndex);
            };
        })()
    })
    .field('vertexCount', {
            description: "지오메트리를 구성하는 버텍스 갯수",
            sample: [
                'console.log(geometry.vertexCount);'
            ],
            defaultValue:'null',
            get:$getter(vertexCount)
        }
    )
    .field('triangleCount', {
            description: "지오메트리를 구성하는 삼각형 갯수",
            sample: [
                'console.log(geometry.triangleCount);'
            ],
            defaultValue:'null',
            get:$getter(triangleCount)
        }
    )
    .field('volume', {
        description: "지오메트리의 최대 부피값.",
        sample: [
            'console.log(geometry.volume);'
        ],
        defaultValue:'null',
        get:function volumeGet() {
            var minX, minY, minZ, maxX, maxY, maxZ, t0, t1, t2, t, i;
            if (!volume[this]) {
                minX = minY = minZ = maxX = maxY = maxZ = 0,
                t = position[this], i = t.length;
                while (i--) {
                    t0 = i * 3, t1 = t0 + 1, t2 = t0 + 2,
                    minX = t[t0] < minX ? t[t0] : minX,
                    maxX = t[t0] > maxX ? t[t0] : maxX,
                    minY = t[t1] < minY ? t[t1] : minY,
                    maxY = t[t1] > maxY ? t[t1] : maxY,
                    minZ = t[t2] < minZ ? t[t2] : minZ,
                    maxZ = t[t2] > maxZ ? t[t2] : maxZ;
                }
                volume[this] = [maxX - minX, maxY - minY, maxZ - minZ];
            }
            return volume[this];
        }
    })
    .field('position', {
            description: "지오메트리를 구성하는 버텍스의 포지션 배열을 반환",
            sample: [
                'console.log(geometry.position);'
            ],
            defaultValue:'null',
            get: $getter(position)
        }
    )
    .field('normal', {
            description: "지오메트리를 구성하는 버텍스의 노멀 배열을 반환",
            sample: [
                'console.log(geometry.normal);'
            ],
            get: $getter(normal)
        }
    )
    .field('uv', {
            description: "지오메트리를 구성하는 버텍스의 UV 배열을 반환",
            sample: [
                'console.log(geometry.uv);'
            ],
            get: $getter(uv)
        }
    )
    .field('color', {
            description: "지오메트리를 구성하는 버텍스의 컬러 배열을 반환",
            sample: [
                'console.log(geometry.color);'
            ],
            get: $getter(color)
        }
    )
    .field('index', {
            description: "지오메트리를 인덱스 배열을 반환",
            sample: [
                'console.log(geometry.index);'
            ],
            get: $getter(index)
        }
    )
    .build();
})();