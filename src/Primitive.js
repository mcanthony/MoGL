var Primitive = (function () {
    'use strict';
    return MoGL.extend('Primitive', {
        description: "면, 정다각형, 정육면체 등 미리 정의된 기본 기하 객체를 static 방식으로 생성할 수 있게 해주는 객체",
        sample:[
            'var cube = Primitive.cube(2, 2);',
            'var geodesic = Primitive.geodesic(4);',
            'var plane = Primitive.plane(2, 2);'
        ],
        value:function Primitive(){}
    })
    .static('plane', {
        description: "면을 나타내는 Geometry 객체 반환",
        param: [
            'splitX - X축 방향 면의 분할수, 생략하면 기본값 1',
            'splitY - Y축 방향 면의 분할수, 생략하면 기본값 1'
        ],
        ret: [
            'Geometry - 점의 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var plane = Primitive.plane();",
            "var plane = Primitive.plane(2, 2);",
            "var plane = Primitive.plane(2, 3);",
            "var plane = Primitive.plane(10, 10);"
        ],
        exception: [
            "'Primitive.polygon:0' - splitX나 splitY의 값이 0일 때"
        ],
        value: function plane(splitX, splitY) {
            var _splitX = arguments[0] || 1, _splitY = arguments[1] || 1;
            var vs, is, x, y, base, tw;
            var index, numIndices;
            if (splitX == 0 || splitY == 0) this.error(0);
            tw = _splitX + 1, index = 0, numIndices = 0, vs = [], is = [];
            for (var yi = 0; yi <= _splitY; ++yi) {
                for (var xi = 0; xi <= _splitX; ++xi) {
                    x = (xi / _splitX - .5), //*_width;
                        y = (yi / _splitY - .5), //*_height;
                        vs[index++] = x, vs[index++] = 0, vs[index++] = y, // x,y,z
                        vs[index++] = (xi / _splitX), vs[index++] = yi / _splitY; // u,v
                    if (xi != _splitX && yi != _splitY) {
                        base = xi + yi * tw;
                        is[numIndices++] = base, is[numIndices++] = (base + tw), is[numIndices++] = (base + tw + 1), is[numIndices++] = base, is[numIndices++] = (base + tw + 1), is[numIndices++] = (base + 1);
                    }
                }
            }
            var result = new Geometry(vs, is, [Vertex.x, Vertex.y, Vertex.z, Vertex.u, Vertex.v]);

            return result;
        }
    })
    .static('polygon', {
        description: "정다각형 Geometry 객체 반환",
        param: [
            'n - 꼭지점의 수'
        ],
        ret: [
            'Geometry - 정다각형 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var triangle = Primitive.polygon(3);",
            "var square = Primitive.polygon(4);",
            "var pentagon = Primitive.polygon(5);",
        ],
        exception: [
            "'Primitive.polygon:0' - n이 3보다 작을 때"
        ],
        value: function polygon(n) {
            n = arguments[0] || 3;
            if (n < 3) this.error(0);

            var i, j, angle = 2 * PI / n, x, y, z, u, v,
                vs = [0.0, 1.0, 0.0, 0.5, 0.0], is = [], vertCoords = vs.length,
                result;

            for (i = 0; i < n - 1; i = i / vertCoords + 1) {
                x = vs[i *= vertCoords] * COS(angle) - vs[++i] * SIN(angle),
                    y = vs[--i] * SIN(angle) + vs[++i] * COS(angle),
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

            return result;
        }
    })
    .static('cube', {
        description: "정육면체 Geometry 객체 반환",
        param: [
            'splitX - 각 면의 X축 방향 분할값',
            'splitY - 각 면의 Y축 방향 분할값',
            'splitZ - 각 면의 Z축 방향 분할값'
        ],
        ret: [
            'Geometry - 정육면체 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var cube = Primitive.cube();"
        ],
        exception: [
            "'Primitive.cube:0' - 인자값에 0이 포함되어 있을 때"
        ],
        value: function cube(splitX, splitY, splitZ) {
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

            if (_segmentsW == 0 && _segmentsH == 0, _segmentsD == 0) this.error(0);

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
            return result;
        }
    })
    .static('sphere', {
        description: "구를 나타내는 Geometry 객체 반환",
        param: [
            'splitLatitude - 위도 방향 분할수',
            'splitLongitude - 경도 방향 분할수'
        ],
        ret: [
            'Geometry - 구의 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var sphere = Primitive.sphere();"
        ],
        exception: [
            "'Primitive.sphere:0' - 인자값에 0이 포함되어 있을 때"
        ],
        value: function sphere(splitLatitude, splitLongitude) {
            var vs = [];
            var is = [];
            var latitudeBands = splitLatitude;
            var longitudeBands = splitLongitude;
            var radius = 1.0;
            if (splitLatitude == 0 || splitLongitude == 0) this.error(0);

            for (var latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
                var theta = latNumber * PI / latitudeBands;
                var sinTheta = SIN(theta);
                var cosTheta = COS(theta);
                for (var longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
                    var phi = longNumber * 2 * PI / longitudeBands;
                    var sinPhi = SIN(phi);
                    var cosPhi = COS(phi);

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

            return result;
        }
    })
    .static('geodesic', {
        description: "geodesic Geometry 객체 반환",
        param: [
            'n - 구면을 분할하는 삼각형의 개수'
        ],
        ret: [
            'Geometry - 극점에서 삼각형이 집중되지 않는 geodesic sphere 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var geodesic = Primitive.geodesic();"
        ],
        exception: [
            "'Primitive.geodesic:0' - n이 3보다 작을 때"
        ],
        value: function geodesic() {
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
                dLon = 360 / nLon * D2R, lat = -PIH + (i + 1) * dLat, v = (PIH + lat) / PI, sinLat = SIN(lat), cosLat = COS(lat),z = radius * sinLat;
                for (j = 0; j <= nLon; j++) lon = j * dLon, sinLon = SIN(lon), cosLon = COS(lon), x = radius * cosLat * cosLon, y = radius * cosLat * sinLon, u = 1-lon / PID, yUp ? _vertices.push(x, -z, y, u, v) : _vertices.push(x, y, z, u, v);
            }
            //latitude 0 -> 90
            for (i = 1; i < hnLat; i++) {
                nLon = 4 * (hnLat - i), dLon = 360 / nLon * D2R, lat = dLat * i, v = (PIH + lat) / PI, sinLat = SIN(lat), cosLat = COS(lat), z = radius * sinLat;
                for (j = 0; j <= nLon; j++) lon = j * dLon, sinLon = SIN(lon), cosLon = COS(lon), x = radius * cosLat * cosLon, y = radius * cosLat * sinLon, u = 1-lon / PID, yUp ? _vertices.push(x, -z, y, u, v) : _vertices.push(x, y, z, u, v);
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

            return result;
        }
    })
    .static('skybox', {
        description: "3차원 배경이 되어주는 큐브 형태의 Geometry 객체 반환 - 아직 미구현",
        param: [
            'splitX - 각 면의 X축 방향 분할값',
            'splitY - 각 면의 Y축 방향 분할값',
            'splitZ - 각 면의 Z축 방향 분할값'
        ],
        ret: [
            'Geometry - 3차원 배경 기하 정보를 담고 있는 Geometry 객체.'
        ],
        sample: [
            "var geodesic = Primitive.skybox();"
        ],
        exception: [
            "'Primitive.skybox:0' - 인자값에 0이 들어있을 때"
        ],
        value: function skybox(splitX, splitY, splitZ) {
            if (splitX == 0 || splitY == 0 || splitZ == 0) this.error(0)
        }
    })
    .build();
})();
