/**
 * Created by redcamel on 2015-05-08.
 */
// TODO 기본으로 버텍스좌표, 노말좌표 정도까지는 알아야되는겐가?
var Primitive = (function () {
    var mS = Math.sin, mC = Math.cos, PI = Math.PI, RADIAN = PI / 180, mSqt = Math.sqrt, D2R = Math.PI / 180, R2D = 180 / Math.PI, TPI = Math.PI * 2, HPI = Math.PI / 2;
    return {
        cube: function cube(/*splitX, splitY, splitZ*/) {
            var _segmentsW,_segmentsH,_segmentsD;
            var vs,is;
            var tl, tr, bl, br, i, j, inc = 0;
            var vidx, fidx; // is
            var hw, hh, hd; // halves
            var dw, dh, dd; // deltas
            var outer_pos;
            var u_tile_dim, v_tile_dim, u_tile_step, v_tile_step;
            var tl0u, tl0v, tl1u, tl1v,du, dv;
            _segmentsW = arguments[0] || 1, _segmentsH = arguments[1] || 1, _segmentsD = arguments[2] || 1,
            vs = [],is = [],
            vidx = 0, fidx = 0,// is
            hw = 1 / 2, hh = 1 / 2, hd = 1 / 2,// half cube dimensions
            dw = 1 / _segmentsW, dh = 1 / _segmentsH, dd = 1 / _segmentsD,// Segment dimensions
            u_tile_dim = 1, v_tile_dim = 1, u_tile_step = 0, v_tile_step = 0;
            tl0u = u_tile_step, tl0v = v_tile_step, tl1u = 2 * u_tile_step, tl1v = 0, du = u_tile_dim / _segmentsW, dv = v_tile_dim / _segmentsH;
            for (i = 0; i <= _segmentsW; i++) {
                outer_pos = -hw + i*dw;
                for (j = 0; j <= _segmentsH; j++) {
                    // front
                    vs[vidx++] = outer_pos,vs[vidx++] = -hh + j*dh,vs[vidx++] = -hd,
                    vs[vidx++] = 1-( tl0u + i*du ),vs[vidx++] = ( tl0v + (v_tile_dim - j*dv)),
                    // back
                    vs[vidx++] = outer_pos, vs[vidx++] = -hh + j * dh, vs[vidx++] = hd,
                    vs[vidx++] = 1-( tl1u + (u_tile_dim - i * du)), vs[vidx++] = ( tl1v + (v_tile_dim - j * dv));
                    if (i && j) tl = 2 * ((i - 1) * (_segmentsH + 1) + (j - 1)), tr = 2 * (i * (_segmentsH + 1) + (j - 1)), bl = tl + 2, br = tr + 2, is[fidx++] = tl, is[fidx++] = bl, is[fidx++] = br, is[fidx++] = tl, is[fidx++] = br, is[fidx++] = tr, is[fidx++] = tr + 1, is[fidx++] = br + 1, is[fidx++] = bl + 1, is[fidx++] = tr + 1, is[fidx++] = bl + 1, is[fidx++] = tl + 1;
                }
            }
            inc += 2 * (_segmentsW + 1) * (_segmentsH + 1), tl0u = u_tile_step, tl0v = 0, tl1u = 0, tl1v = 0, du = u_tile_dim / _segmentsW, dv = v_tile_dim / _segmentsD;
            for (i = 0; i <= _segmentsW; i++) {
                outer_pos = -hw + i*dw;
                for (j = 0; j <= _segmentsD; j++) {
                    // top
                    vs[vidx++] = outer_pos, vs[vidx++] = hh, vs[vidx++] = -hd + j * dd,
                    vs[vidx++] = 1-( tl0u + i * du), vs[vidx++] = ( tl0v + (v_tile_dim - j * dv)),
                    // bottom
                    vs[vidx++] = outer_pos, vs[vidx++] = -hh, vs[vidx++] = -hd + j * dd,
                    vs[vidx++] = 1-( tl1u + i * du), vs[vidx++] = ( tl1v + j * dv);
                    if (i && j) tl = inc + 2 * ((i - 1) * (_segmentsD + 1) + (j - 1)), tr = inc + 2 * (i * (_segmentsD + 1) + (j - 1)), bl = tl + 2, br = tr + 2, is[fidx++] = tl, is[fidx++] = bl, is[fidx++] = br, is[fidx++] = tl, is[fidx++] = br, is[fidx++] = tr, is[fidx++] = tr + 1, is[fidx++] = br + 1, is[fidx++] = bl + 1, is[fidx++] = tr + 1, is[fidx++] = bl + 1, is[fidx++] = tl + 1;
                }
            }
            inc += 2 * (_segmentsW + 1) * (_segmentsD + 1), tl0u = 0, tl0v = v_tile_step, tl1u = 2 * u_tile_step, tl1v = v_tile_step, du = u_tile_dim / _segmentsD, dv = v_tile_dim / _segmentsH;
            for (i = 0; i <= _segmentsD; i++) {
                outer_pos = hd - i*dd;
                for (j = 0; j <= _segmentsH; j++) {
                    // left
                    vs[vidx++] = -hw, vs[vidx++] = -hh + j * dh, vs[vidx++] = outer_pos,
                    vs[vidx++] = 1-( tl0u + i*du),vs[vidx++] = ( tl0v + (v_tile_dim - j*dv));
                    // right
                    vs[vidx++] = hw, vs[vidx++] = -hh + j * dh, vs[vidx++] = outer_pos;
                    vs[vidx++] = 1-( tl1u + (u_tile_dim - i * du)), vs[vidx++] = ( tl1v + (v_tile_dim - j * dv));
                    if (i && j) tl = inc + 2 * ((i - 1) * (_segmentsH + 1) + (j - 1)), tr = inc + 2 * (i * (_segmentsH + 1) + (j - 1)), bl = tl + 2, br = tr + 2, is[fidx++] = tl, is[fidx++] = bl, is[fidx++] = br, is[fidx++] = tl, is[fidx++] = br, is[fidx++] = tr, is[fidx++] = tr + 1, is[fidx++] = br + 1, is[fidx++] = bl + 1, is[fidx++] = tr + 1, is[fidx++] = bl + 1, is[fidx++] = tl + 1;
                }
            }
            var result = new Geometry(vs, is, [Vertex.x, Vertex.y, Vertex.z, Vertex.u, Vertex.v]);
            result._key = 'cube' + ( arguments[0] || 1) + '_' + (arguments[1] || 1);
            return result;
        },
        geodesic: function geodesic(/*split*/) {
            var radius = 0.5, fractures = arguments[0] || 30, yUp = true;
            var hnLat = fractures; //위도 방향 쪼갠수/2
            var nLat = 2*hnLat; //위도 방향 쪼갠수
            var nLon; //위도에 대한 경도 방향 쪼갠수 
            var lon; //경도 (단위:라디안)
            var lat; //위도(단위:라디안)
            var dLat = 180 / nLat * D2R; //위도 간격(단위:라디안)
            var dLon; //경도  간격(단위:라디안)
            var i, j, x, y, z, sinLat, cosLat, sinLon, cosLon, u, v;
            var _vertices=[], _indices = [];
            // latitude -90->0 :
            x = 0, y = 0, z = -radius;
            yUp ? _vertices.push(x, -z, y, 0, 0) : _vertices.push(x, y, z, 0, 0);
            for (i = 0; i < hnLat; i++) {
                nLon = 4 * (i + 1); //경도방향 꼭지점수 4, 8, 12, 16, 20...
                dLon = 360 / nLon * D2R, lat = -HPI + (i + 1) * dLat, v = (HPI + lat) / PI, sinLat = mS(lat), cosLat = mC(lat),z = radius * sinLat;
                for (j = 0; j <= nLon; j++) lon = j * dLon, sinLon = mS(lon), cosLon = mC(lon), x = radius * cosLat * cosLon, y = radius * cosLat * sinLon, u = 1-lon / TPI, yUp ? _vertices.push(x, -z, y, u, v) : _vertices.push(x, y, z, u, v);
            }
            //latitude 0 -> 90
            for (i = 1; i < hnLat; i++) {
                nLon = 4 * (hnLat - i), dLon = 360 / nLon * D2R, lat = dLat * i, v = (HPI + lat) / PI, sinLat = mS(lat), cosLat = mC(lat), z = radius * sinLat;
                for (j = 0; j <= nLon; j++) lon = j * dLon, sinLon = mS(lon), cosLon = mC(lon), x = radius * cosLat * cosLon, y = radius * cosLat * sinLon, u = 1-lon / TPI, yUp ? _vertices.push(x, -z, y, u, v) : _vertices.push(x, y, z, u, v);
            }
            x = 0, y = 0, z = radius, yUp ? _vertices.push(x, -z, y, u, v) : _vertices.push(x, y, z, u, v);
            var k, pt0, pt1, pt2, u_idx_start, u_idx_end, u_idx, l_idx_start, l_idx_end, l_idx, isUp, tris, triIdx;
            //Latitude -90->0
            tris = 1, u_idx_start = 0, u_idx_end = 0;
            for (i = 0; i < hnLat; ++i) {
                l_idx_start = u_idx_start, l_idx_end = u_idx_end, u_idx_start += 4 * i + 1, u_idx_end += 4 * (i + 1) + 1, l_idx = l_idx_start, u_idx = u_idx_start;
                //4분면을 따라 Face를 만들도록 한다.
                for (k = 0; k < 4; ++k) {
                    isUp = 1;
                    for (triIdx = 0; triIdx < tris; ++triIdx) {
                        if (isUp === 1) pt0 = l_idx, pt2 = u_idx, u_idx++, pt1 = u_idx, isUp = 0;
                        else pt0 = u_idx, pt1 = l_idx, l_idx++, pt2 = l_idx, isUp = 1;
                        _indices.push(pt0, pt1, pt2);
                    }
                }
                tris += 2; //한개의 분면에서 해당 적위에 대한 면의 수는 2씩 증가한다.
            }
            //Latitude 0 -> 90
            for (i = hnLat - 1; i >= 0; i--) {
                l_idx_start = u_idx_start,
                l_idx_end = u_idx_end,
                u_idx_start = u_idx_start + 4 * (i + 1) + 1,
                u_idx_end = u_idx_end + 4 * i + 1,
                tris -= 2,
                u_idx = u_idx_start,
                l_idx = l_idx_start;
                for (k = 0; k < 4; ++k) {
                    isUp = 0;
                    for (triIdx = 0; triIdx < tris; triIdx++) {
                        if (isUp === 1) pt0 = l_idx, pt2 = u_idx, u_idx++, pt1 = u_idx, isUp = 0;
                        else pt0 = u_idx, pt1 = l_idx, l_idx++, pt2 = l_idx, isUp = 1;
                        _indices.push(pt0, pt1, pt2);
                    }
                }
            }
            var result = new Geometry(_vertices, _indices, [Vertex.x, Vertex.y, Vertex.z,Vertex.u,Vertex.v]);
            result.setId('geodesic' + ( arguments[0] || 1))
            return result;
        },
        line: function line(x1, y1, z1, x2, y2, z2 /*,width*/) {
            // TODO 내장된 Geometry. 두 점을 지나는 직선.
            // TODO x1, y1, z1, x2, y2, z2 - 직선이 지나갈 두점(x1, y1, z1 에서 x2, y2, z2)
            // TODO ?width - 직선의 두께. 생략하면 1.
            // TODO scene.addChild( 'l', new Mesh( Primitive.line( 0,0,0, 10,10,10, 2 ), new Material() );
            var result;
            return result;
        },
        plane: function plane(/*_segmentsW, _segmentsH*/) {
            var _segmentsW = arguments[0] || 1, _segmentsH = arguments[1] || 1;
            var vs, is, x, y, base, tw;
            var index, numIndices;
            tw = _segmentsW + 1, index = 0, numIndices = 0, vs = [], is = [];
            for (var yi = 0; yi <= _segmentsH; ++yi) {
                for (var xi = 0; xi <= _segmentsW; ++xi) {
                    x = (xi / _segmentsW - .5), //*_width;
                    y = (yi / _segmentsH - .5), //*_height;
                    vs[index++] = x, vs[index++] = 0, vs[index++] = y, // x,y,z
                    vs[index++] = (xi / _segmentsW), vs[index++] = yi / _segmentsH; // u,v
                    if (xi != _segmentsW && yi != _segmentsH) {
                        base = xi + yi * tw;
                        is[numIndices++] = base, is[numIndices++] = (base + tw), is[numIndices++] = (base + tw + 1), is[numIndices++] = base, is[numIndices++] = (base + tw + 1), is[numIndices++] = (base + 1);
                    }
                }
            }
            var result = new Geometry(vs, is, [Vertex.x, Vertex.y, Vertex.z, Vertex.u, Vertex.v]);
            result._key = 'plane_' + _segmentsW + '_' + _segmentsH;
            return result;
        },
        point: function point(/*width*/) {
            // TODO 내장된 Geometry. 하나의 점을 나타내는 구조.
            // TODO ?width - 점의 지름. 생략하면 1.
            // TODO scene.addChild( 'p', new Mesh( Primitive.point(5), new Material() );
            var result;
            return result;
        },
        sphere: function sphere(/*split*/) {
            var vs = [];
            var is = [];
            var latitudeBands = 8;
            var longitudeBands = 8;
            var radius = 1.0;
            for (var latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = mS(theta);
                var cosTheta = mC(theta);
                for (var longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                    var sinPhi = mS(phi);
                    var cosPhi = mC(phi);

                    var x = cosPhi * sinTheta;
                    var y = cosTheta;
                    var z = sinPhi * sinTheta;
                    var u = 1 - longNumber / longitudeBands;
                    var v = 1 - latNumber / latitudeBands;
                    vs.push(radius * x, radius * y, radius * z, u, v);
                }
            }
            for (latNumber = 0; latNumber < latitudeBands; ++latNumber) {
                for (longNumber = 0; longNumber < longitudeBands; ++longNumber) {
                    var first = latNumber * (longitudeBands + 1) + longNumber;
                    var second = first + longitudeBands + 1;
                    is.push(second, first, first + 1, second + 1, second, first + 1);
                }
            }
            var result = new Geometry(vs, is, [Vertex.x, Vertex.y, Vertex.z, Vertex.u, Vertex.v]);
            result._key = 'sphere_' + ( arguments[0] || 1);
            return result;
        },
        skybox: function skybox(/*splitX, splitY, splitZ*/) {
            // TODO 내장된 Geometry. 큐브형태의 구조로 각 평면이 내부를 바라보도록 되어있음.
            // TODO ?splitX, splitY, splitZ - 각 면당 분할할 수. 생략시 1로 지정됨.
            // TODO scene.addChild( 'box', new Mesh( Primitive.skybox( 5, 5, 5 ), new Material() );
            var result;
            return result;
        },
        polygon: function polygon(n) {
            n = arguments[0] || 3;
            if (n < 3) this.error(0);

            var i, j, angle = 2 * PI / n, x, y, z, u, v,
                vs = [0.0, 1.0, 0.0, 0.5, 0.0], is = [], vertCoords = vs.length,
                result;

            for (i = 0; i < n - 1; i = i / vertCoords + 1) {
                x = vs[i *= vertCoords] * mC(angle) - vs[++i] * mS(angle),
                    y = vs[--i] * mS(angle) + vs[++i] * mC(angle),
                    z = vs[--i + 2],
                    u = 0.5 + (x / 1.0) / 2,
                    v = 0.5 - (y / 1.0) / 2,
                    vs.push(x, y, z, u, v);
                if (i > 0) {
                    j = i / vertCoords;
                    is.push(0, j, j + 1); // 최상단 최초 꼭지점 기준
                }
            }
            result = new Geometry(vs, is, [Vertex.x, Vertex.y, Vertex.z, Vertex.u, Vertex.v]);
            result._key = 'polygon_' + (arguments[0] || 1);
            return result;
        }
    }
})();
