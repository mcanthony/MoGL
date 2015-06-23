var Vector = MoGL.extend('Vector', {
    description:'벡터3D 클래스',
    param:[
        'x:number, y:number, z:number - 벡터 초기값을 넘버형으로 입력할 수 있음\n- '+
        '[x,y,z]:Array - 첫번째 인자에 배열(Float32Array or Array)형태로 입력 할 수 있음\n- '+
        '인자가 없을경우 0,0,0으로 초기화'
    ],
    sample:[
        'var vector = new Vector(1, 2, 3);',
        'var vector = new Vector([1, 2, 3]);',
        'var vector = new Vector(new Float32Array([1, 2, 3]));',
        'var vector = new Vector();',
        '',
        '// 팩토리 함수로도 사용 가능.',
        'var vector = Vector(1, 2, 3);'
    ],
    value: function Vector(x, y, z) {
        if (x instanceof Float32Array || Array.isArray(x)) {
            this.x = x[0], this.y = x[1], this.z = x[2]
        }
        else if (x == undefined) {
            this.x = this.y = this.z = 0
        } else {
            this.x = x, this.y = y, this.z = z
        }
    }
})
.method('add', {
    description:"현재 Vector 객체의 x, y 및 z 요소 값에 대상 객체의 x,y,z값을 더합니다",
    param:['vector:Vector'],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'var vec2 = new Vector();',
        'vec1.add(vec2);'
    ],
    value:function add(v) {
        var a = this;
        a.x += v.x, a.y += v.y, a.z += v.z;
        return this;
    }
})
.method('addXYZ', {
    description:"현재 Vector 객체의 x, y 및 z 요소 값에 인자 x,y,z값을 더합니다.",
    param:[
        'x:number - x값',
        'y:number - y값',
        'z:number - z값'
    ],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'vec1.addXYZ(10,20,30);'
    ],
    value:function addXYZ(x, y, z) {
        var a = this;
        a.x += (x || 0), a.y += (y || 0), a.z += (z || 0);
        return this;
    }
})
.method('subtract', {
    description:"현재 Vector 객체의 x, y 및 z 요소 값을 다른 Vector 객체의 x, y 및 z 요소 값에서 뺍니다.",
    param:['vector:Vector'],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'var vec2 = new Vector();',
        'vec1.subtract(vec2);'
    ],
    value:function subtract(v) {
        var a = this;
        a.x -= v.x, a.y -= v.y, a.z -= v.z;
        return this;
    }
})
.method('subtractXYZ', {
    description:"현재 Vector 객체의 x, y 및 z 요소 값을 다른 인자 x, y ,z 요소 값에서 뺍니다.",
    param:[
        'x:number - x값',
        'y:number - y값',
        'z:number - z값'
    ],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'vec1.subtractXYZ(10, 20, 30);'
    ],
    value:function subtractXYZ(x, y, z) {
        var a = this;
        a.x -= (x || 0), a.y -= (y || 0), a.z -= (z || 0);
        return this;
    }
})
.method('scaleBy', {
    description:"현재 Vector 객체의 크기를 스칼라 값만큼 조절합니다.",
    param:[
        'scale:number - scale값'
    ],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'vec1.scaleBy(10);'
    ],
    value:function scaleBy(s) {
        var a = this;
        a.x *= s, a.y *= s, a.z *= s;
        return this;
    }
})
.method('distance', {
    description:"현재 벡터와 대상 벡터 객체 사이의 거리를 반환합니다.",
    param:['vector:Vector'],
    ret : ['number'],
    sample:[
        'var vec1 = new Vector();',
        'var vec2 = new Vector();',
        'vec1.distance(vec2);'
    ],
    value:function distance(v) {
        var a = this;
        var x = v.x - a.x, y = v.y - a.y, z = v.z - a.z;
        return SQRT(x * x + y * y + z * z);
    }
})
.method('negate', {
    description:"현재 Vector 객체를 역수로 설정합니다.",
    param:['vector:Vector'],
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'vec1.negate();'
    ],
    value:function negate() {
        var a = this;
        a.x = -a.x, a.y = -a.y, a.z = -a.z;
        return this;
    }
})
.method('normalize', {
    description:"현재 Vector의 단위벡터화된 길이입니다.",
    ret : ['this'],
    sample:[
        'var vec1 = new Vector();',
        'vec1.normalize();'
    ],
    value:function normalize() {
        var a = this;
        var x = a.x, y = a.y, z = a.z;
        var len = x * x + y * y + z * z;
        if (len > 0) len = 1 / SQRT(len), a.x *= len, a.y *= len, a.z *= len;
        return this;
    }
})
.method('dot', {
    description:"내적값 반환",
    param:['vector:Vector'],
    ret : ['number'],
    sample:[
        'var vec1 = new Vector();',
        'var vec2 = new Vector();',
        'vec1.dot(vec2);'
    ],
    value:function (v) {
        var a = this;
        return a.x * v.x + a.y * v.y + a.z * v.z;
    }
})
.method('cross', {
    description:"두벡터에 수직인 벡터를 반환",
    param:['vector:Vector'],
    ret : ['Vector'],
    sample:[
        'var vec1 = new Vector();',
        'var vec2 = new Vector();',
        'vec1.cross(vec2);'
    ],
    value:function (v) {
        var a = this, out = new Float32Array([0, 0, 0]);
        var ax = a.x, ay = a.y, az = a.z, bx = v.x, by = v.y, bz = v.z;
        out.x = ay * bz - az * by, out.y = az * bx - ax * bz, out.z = ax * by - ay * bx;
        return new Vector(out.x,out.y,out.z);
    }
})
.build();