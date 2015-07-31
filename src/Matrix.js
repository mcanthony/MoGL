var Matrix = (function () {
    'use strict';
    var temp, setter, getter, rawInit,
        raw;
    //private
    raw = {},
    $setPrivate('Matrix', {
        raw:raw
    });
    //lib
    temp = new Float32Array(16),
    setter = function(x, y, z){
        return function(v) {
            if (v) {
                if ('0' in v) {
                    this[x] = v[0], this[y] = v[1], this[z] = v[2];
                } else if (x in arg) {
                    this[x] = v[x], this[y] = v[y], this[z] = v[z];
                }
            } else {
                this[x] = this[y] = this[z] = 0;
            }
        };
    },
    getter = function(x, y, z){
        var result = new Float32Array(3);
        return function(v) {
           result[0] = this[x], result[1] = this[y], result[2] = this[z];
           return result;
        };
    },
    rawInit = function rawInit(mat, applyTransform){
        if (applyTransform) {
            mat.matIdentity()
                .matTranslate(mat.x,mat.y,mat.z)
                .matQuaternionXYZRotate(mat.rotateX, mat.rotateY, mat.rotateZ)
                .matScale(mat.scaleX,mat.scaleY,mat.scaleZ);
        }
        return raw[mat.uuid] || (raw[mat.uuid] = new Float32Array(16));
    };
    return MoGL.extend('Matrix',{
        description:'4x4행렬을 나타내는 객체. 아핀변환용 x,y,z, rotateX,Y,Z, scaleX,Y,Z 도 지원함',
        sample:[
            'var mtx = new Matrix();',
            'console.log(mtx.x);'
        ],
        value:function Matrix() {
            this.x = this.y = this.z = this.rotateX = this.rotateY = this.rotateZ = 0,
            this.scaleX = this.scaleY = this.scaleZ = 1;
        }
    })
    .field('matrix', {
        description:'현재 position,rotate,scale을 반영한 4x4행렬을 설정한 뒤 자신을 반환',
        sample:[
            'var mtx = new Matrix();',
            'console.log(mtx.matrix);'
        ],
        get:function matrixGet() {
            if (!raw[this.uuid]) raw[this.uuid] = new Float32Array(16);
            this.matIdentity()
                .matTranslate(this.x, this.y, this.z)
                .matQuaternionXYZRotate(this.rotateX, this.rotateY, this.rotateZ)
                .matScale(this.scaleX, this.scaleY, this.scaleZ);
            return this;

            //return rawInit(this, true);
        }
    })
    .field('raw', {
        description:'현재 매트릭스 객체의 rawData를 Float32Array 형식으로 반환(행렬로 사용한 적이 없으면 null)',
        sample:[
            'var mtx = new Matrix();',
            'console.log(mtx.raw);'
        ],
        get:function rawGet(){
            return raw[this] || null;
        }
    })
    .method('lookAt', {
        description:'현재매트릭스를 대상지점을 바라보도록 변경\n- 현재 매트릭스의 rotateX,rotateY,rotateZ, 속성을 자동으로 변경',
        param:[
            'x:number - 바라볼 x위치',
            'y:number - 바라볼 y위치',
            'z:number - 바라볼 z위치'
        ],
        sample:[
            'var mtx = new Matrix();',
            'mtx.lookAt(0,0,0); // 현재위치에서 0,0,0을 바라보는 상태로 rotateX, rotateY, rotateZ가 변경됨'
        ],
        ret:'this',
        value:(function(){
            var A = new Float32Array(3), B = new Float32Array(3), axis = [0, 1, 0];
            return function lookAt(x, y, z) {
                var d, d11, d12, d13, d21, d22, d23, d31, d32, d33, md31,
                    radianX, radianY, radianZ, cosY;
                A[0] = this.x, A[1] = this.y, A[2] = -this.z,
                B[0] = x, B[1] = y, B[2] = z,
                this.matLookAt(A, B, axis),
                d = raw[this],
                d11 = d[0], d12 = d[1], d13 = d[2],
                d21 = d[4], d22 = d[5], d23 = d[6],
                d31 = d[8], d32 = d[9], d33 = d[10],
                md31 = -d31;
                if (md31 <= -1) {
                    radianY = -PIH;
                } else if (1 <= md31) {
                    radianY = PIH;
                } else {
                    radianY = ASIN(md31);
                }
                cosY = COS(radianY);
                if (cosY <= 0.001) {
                    radianZ = 0, radianX = ATAN2(-d23, d22);
                } else {
                    radianZ = ATAN2(d21, d11), radianX = ATAN2(d32, d33);
                }
                this.rotateX = radianX,
                this.rotateY = radianY,
                this.rotateZ = radianZ;
                return this
            };
        })()
    })
    .method('matIdentity', {
        description:'현재 매트릭스를 단위 매트릭스로 초기화한다.',
        sample:[
            'var mtx = new Matrix();',
            'mtx.matIdentity();'
        ],
        ret: ['this - 메서드체이닝을 위해 매트릭스 자신을 반환함.'],
        value:function matIdentity() {
            var a = rawInit(this);
            a[0]  = 1,  a[1]  = 0,  a[2]  = 0,  a[3]  = 0,
            a[4]  = 0,  a[5]  = 1,  a[6]  = 0,  a[7]  = 0,
            a[8]  = 0,  a[9]  = 0,  a[10] = 1,  a[11] = 0,
            a[12] = 0,  a[13] = 0,  a[14] = 0,  a[15] = 1;
            return this;            
        }
    })
    .method('matClone', {
        description: '현재 매트릭스를 복제해서 새로 생성된 매트릭스를 반환한다.',
        param:[
            'applyTransform:boolean - 현재의 position,rotate,scale 적용 여부',
        ],
        sample: [
            'var mtx = new Matrix();',
            'var clonedMatrix = mtx.matClone();'
        ],
        ret: ['Matrix - 복제해서 새로 생성한 매트릭스를 반환.'],
        value:(function(applyTransform){
            var out, b;
            return function matClone() {
                var a = rawInit(this, applyTransform != 'false');
                if (!out) out = Matrix(), b = rawInit(out);
                b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3],
                b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7],
                b[8] = a[8], b[9] = a[9], b[10] = a[10], b[11] = a[11],
                b[12] = a[12], b[13] = a[13], b[14] = a[14], b[15] = a[15];
                return out;
            };
        })()
    })
    .method('matCopy', {
        description:'현재 매트릭스의 값을 대상 매트릭스에 복사하여 덮어쓴다.',
        sample: [
            'var source = new Matrix();',
            'var target = new Matrix();',
            'source.matCopy(target);  // source의 속성을 target에 복사'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'matrix:Matrix - 복사 대상 매트릭스'
        ],
        value:function matCopy(t, applyTransform) {
            var a = rawInit(this, applyTransform != 'false');
            t = rawInit(t);
            t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3],
            t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7],
            t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11],
            t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15];
            return this;
        }
    })
    .method('matInvert', {
        description:'현재 매트릭스의 역행렬을 새로 생성해서 반환한다.',
        sample: [
            'var source = new Matrix();',
            'var inverted = source.matInvert();',
        ],
        ret:'Matrix - 새로 생성된 역행렬',
        param:'matrix:Matrix - 복사 대상 매트릭스',
        value:function matInvert(out, applyTransform) {
        var a = rawInit(this, applyTransform != 'false'), t = rawInit(out),
            a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; //Calculate the determinant
        if (!det) return null;
        det = 1.0 / det;
        t[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        t[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        t[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        t[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        t[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        t[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        t[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        t[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        t[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        t[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        t[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        t[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        t[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        t[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        t[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        t[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
        }
    })
    .method('matMultiply', {
        description:'현재 매트릭스에 대상 매트릭스를 곱한 값을 새 매트릭스에 담아 새 매트릭스를 반환한다.',
        sample: [
            'var mtx = new Matrix();',
            'var multiplier = new Matrix();',
            'var result = mtx.matMultiply(multiplier);  // mtx * multiplier'
        ],
        exception:"* 'Matrix.matMultiply:0' - Matrix 객체가 아닌 값을 파라미터로 전달하는 경우",
        ret: ['Matrix - 곱해 결과로 생성된 새 매트릭스'],
        param:[
            'multiplier:Matrix - 곱할 매트릭스'
        ],
        value:function matMultiply(multiplier, applyTransform) {
            var a = rawInit(this, applyTransform != 'false'),
                m = rawInit(multiplier, applyTransform != 'false'),
                out = rawInit(Matrix()),
                tmp0, tmp1, tmp2, tmp3,
                a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

            tmp0 = m[0], tmp1 = m[1], tmp2 = m[2], tmp3 = m[3];
            out[0] = a00 * tmp0 + a10 * tmp1 + a20 * tmp2 + a30 * tmp3,
            out[1] = a01 * tmp0 + a11 * tmp1 + a21 * tmp2 + a31 * tmp3,
            out[2] = a02 * tmp0 + a12 * tmp1 + a22 * tmp2 + a32 * tmp3,
            out[3] = a03 * tmp0 + a13 * tmp1 + a23 * tmp2 + a33 * tmp3,

            tmp0 = m[4], tmp1 = m[5], tmp2 = m[6], tmp3 = m[7],
            out[4] = a00 * tmp0 + a10 * tmp1 + a20 * tmp2 + a30 * tmp3 ,
            out[5] = a01 * tmp0 + a11 * tmp1 + a21 * tmp2 + a31 * tmp3,
            out[6] = a02 * tmp0 + a12 * tmp1 + a22 * tmp2 + a32 * tmp3,
            out[7] = a03 * tmp0 + a13 * tmp1 + a23 * tmp2 + a33 * tmp3,

            tmp0 = m[8], tmp1 = m[9], tmp2 = m[10], tmp3 = m[11],
            out[8] = a00 * tmp0 + a10 * tmp1 + a20 * tmp2 + a30 * tmp3 ,
            out[9] = a01 * tmp0 + a11 * tmp1 + a21 * tmp2 + a31 * tmp3 ,
            out[10] = a02 * tmp0 + a12 * tmp1 + a22 * tmp2 + a32 * tmp3 ,
            out[11] = a03 * tmp0 + a13 * tmp1 + a23 * tmp2 + a33 * tmp3,

            tmp0 = m[12], tmp1 = m[13], tmp2 = m[14], tmp3 = m[15],
            out[12] = a00 * tmp0 + a10 * tmp1 + a20 * tmp2 + a30 * tmp3 ,
            out[13] = a01 * tmp0 + a11 * tmp1 + a21 * tmp2 + a31 * tmp3,
            out[14] = a02 * tmp0 + a12 * tmp1 + a22 * tmp2 + a32 * tmp3,
            out[15] = a03 * tmp0 + a13 * tmp1 + a23 * tmp2 + a33 * tmp3;

            return out;
        }
    })
    .method('matTranslate', {
        description:'현재매트릭스에 x,y,z축 증분 평행이동 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matTranslate(10,20,30);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'x:number - x축 증분 이동',
            'y:number - y축 증분 이동',
            'z:number - z축 증분 이동'
        ],
        value:function matTranslate(x, y, z) {
            var a = rawInit(this);
            a[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            a[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            a[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            a[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            return this;
        }
    })
    .method('matScale', {
        description:'현재매트릭스에 x,y,z축 증분 확대 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matScale(10,20,30);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'x:number - x축 증분 확대',
            'y:number - y축 증분 확대',
            'z:number - z축 증분 확대'
        ],
        value: function matScale(x, y, z) {
            var a = rawInit(this);
            a[0] = a[0] * x, a[1] = a[1] * x, a[2] = a[2] * x, a[3] = a[3] * x, a[4] = a[4] * y, a[5] = a[5] * y, a[6] = a[6] * y, a[7] = a[7] * y, a[8] = a[8] * z, a[9] = a[9] * z, a[10] = a[10] * z, a[11] = a[11] * z, a[12] = a[12], a[13] = a[13], a[14] = a[14], a[15] = a[15];
            return this;
        }
    })
    .method('matRotateX', {
        description:'현재 매트릭스를 X축 기준 증분 회전 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matRotateX(0.3);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'rad:number - x축 증분 회전 값, radian단위로 입력',
        ],
        value: function matRotateX(rad) {
            var a = rawInit(this), s = SIN(rad), c = COS(rad), 
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            a[4] = a10 * c + a20 * s, a[5] = a11 * c + a21 * s, a[6] = a12 * c + a22 * s, a[7] = a13 * c + a23 * s,
            a[8] = a20 * c - a10 * s, a[9] = a21 * c - a11 * s, a[10] = a22 * c - a12 * s, a[11] = a23 * c - a13 * s;
            return this;
        }
    })
    .method('matRotateY', {
        description:'현재 매트릭스를 Y축 기준 증분 회전 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matRotateY(0.3);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'rad:number - y축 증분 회전 값, radian단위로 입력',
        ],
        value:function matRotateY(rad) {
            var a = rawInit(this), s = SIN(rad), c = COS(rad),
                a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            a[0] = a00 * c - a20 * s, a[1] = a01 * c - a21 * s, a[2] = a02 * c - a22 * s, a[3] = a03 * c - a23 * s,
            a[8] = a00 * s + a20 * c, a[9] = a01 * s + a21 * c, a[10] = a02 * s + a22 * c, a[11] = a03 * s + a23 * c;
            return this;
        }
    })
    .method('matRotateZ', {
        description:'현재 매트릭스를 Z축 기준 증분 회전 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matRotateZ(0.3);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'rad:number - z축 증분 회전 값, radian단위로 입력',
        ],
        value:function matRotateZ(rad) {
            var a = rawInit(this), s = SIN(rad), c = COS(rad),
                a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            a[0] = a00 * c + a10 * s, a[1] = a01 * c + a11 * s, a[2] = a02 * c + a12 * s, a[3] = a03 * c + a13 * s,
            a[4] = a10 * c - a00 * s, a[5] = a11 * c - a01 * s, a[6] = a12 * c - a02 * s, a[7] = a13 * c - a03 * s;
            return this;
        }
    })
    .method('matRotate', {
        description:'현재 매트릭스를 특정축을 기준으로 증분 회전 ',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matRotate(0.3,[0,1,2]);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'rad:number - z축 증분 회전 값, radian단위로 입력',
            'axis:Array - 기준 회전축을 입력',
        ],
        value:function matRotate(rad, axis) {
            var a = rawInit(this), x = axis[0], y = axis[1], z = axis[2],
                len = SQRT(x * x + y * y + z * z), s, c, t, 
                a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, 
                b00, b01, b02, b10, b11, b12, b20, b21, b22;
            if (ABS(len) < GLMAT_EPSILON) return null;
            len = 1 / len, x *= len, y *= len, z *= len,
            s = SIN(rad), c = COS(rad), t = 1 - c,
            a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], 
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], 
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s,
            b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s,
            b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c,
            a[0] = a00 * b00 + a10 * b01 + a20 * b02, a[1] = a01 * b00 + a11 * b01 + a21 * b02,
            a[2] = a02 * b00 + a12 * b01 + a22 * b02, a[3] = a03 * b00 + a13 * b01 + a23 * b02,
            a[4] = a00 * b10 + a10 * b11 + a20 * b12, a[5] = a01 * b10 + a11 * b11 + a21 * b12,
            a[6] = a02 * b10 + a12 * b11 + a22 * b12, a[7] = a03 * b10 + a13 * b11 + a23 * b12,
            a[8] = a00 * b20 + a10 * b21 + a20 * b22, a[9] = a01 * b20 + a11 * b21 + a21 * b22,
            a[10] = a02 * b20 + a12 * b21 + a22 * b22, a[11] = a03 * b20 + a13 * b21 + a23 * b22;
            if (a !== a) a[12] = a[12], a[13] = a[13], a[14] = a[14], a[15] = a[15];
            return this;
        }
    })
    .method('matQuaternionXYZRotate', {
        description:'X, Y, Z축 순서 기준의 4원수로 회전시킨 결과 매트릭스를 반환한다.',
        sample: [
            'var mtx = new Matrix();',
            'var mtxQuaternionRotate = mtx.matQuaternionXYZRotate(2, 1, 4);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'rx:number - x축 기준 회전 값, radian단위',
            'ry:number - y축 기준 회전 값, radian단위',
            'rz:number - z축 기준 회전 값, radian단위'
        ],
        value:function matQuaternionXYZRotate(rx, ry, rz) {
            var a, q, out;
            a = rawInit(this, applyTransform != 'false'),
            q = rawInit(Matrix());

            var c0, c1, c2, s0, s1, s2;
            c0 = COS(rx), c1 = COS(ry), c2 = COS(rz),
            s0 = SIN(rx), s1 = SIN(ry), s2 = SIN(rz);

            var x, y, z, w;
            x = c2*c1*s0 + s2*s1*c0,
            y = c2*s1*c0 - s2*c1*s0,
            z = s2*c1*c0 + c2*s1*s0,
            w = c2*c1*c0 - s2*s1*s0;

            q[0] = w*w + x*x - y*y -z*z, q[1] = 2*(x*y - w*z), q[2] = 2*(x*z + w*y), q[3] = 0,
            q[4] = 2*(x*y + w*z), q[5] = w*w - x*x + y*y - z*z, q[6] = 2*(y*z - w*x), q[7] = 0,
            q[8] = 2*(x*z - w*y), q[9] = 2*(y*z - w*x), q[10] = w*w - x*x - y*y + z*z, q[11] = 0,
            q[12] = 0, q[13] = 0, q[14] = 0, q[15] = 1;

            return a.matMultiply(q);
        }
    })
    .method('frustum', {
        description:['보이는 화면 영역'],
        sample:[],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'a:number - 가로세로 비율',
            'b:number - 가로세로 비율',
            'c:number - 시야각, degree 단위로 입력',
            'd:number - 시야각, degree 단위로 입력',
            'e:number - 절두체의 죄소 z값, 0.0보다 큰 값으로 설정',
            'g:number - 절두체의 최대 z값'
        ],
        value:function frustum(a, b, c, d, e, g) {
            var f = rawInit(this), h = b - a, i = d - c, j = g - e;
            f[0] = e * 2 / h, f[1] = 0, f[2] = 0, f[3] = 0, f[4] = 0,
            f[5] = e * 2 / i, f[6] = 0, f[7] = 0, 
            f[8] = (b + a) / h,
            f[9] = (d + c) / i,
            f[10] = -(g + e) / j,
            f[11] = -1, f[12] = 0, f[13] = 0, f[14] = -(g * e * 2) / j, f[15] = 0;
            return this;
        }
    })
    .method('matPerspective', {
        description:'퍼스펙티브 매트릭스',
        sample: [
            'var mtx = new Matrix();',
            'mtx.matPerspective(55, 4/3,0.1,1000);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'fov:number - 시야각, degree 단위로 입력',
            'aspect:number - 가로/세로비율',
            'near:number - 절두체의 최소z값, 0.0보다 큰값으로 설정',
            'far:number - 절두체의 최대z값',
        ],
        value:(function(){
            var pi = Math.PI / 360, tan = Math.tan;
            return function matPerspective(fov, aspect, near, far) {
                fov = near * tan(fov * pi), aspect = fov * aspect,
                this.frustum(-aspect, aspect, -fov, fov, near, far);
                return this;
            };
        })()
    })
    .method('matLookAt', {
        description:'eye 벡터가 center 벡터를 바라보는 회전 행렬 생성',
        sample:[
            'var matrix = new Matrix();',
            'matrix.matLookAt([100, 100, 100], [0, 0, 0], [0, 1, 0]);'
        ],
        ret: ['this - 메서드체이닝을 위해 자신을 반환함.'],
        param:[
            'eye:Array - [x, y, z] 형태의 eye 좌표',
            'center:Array - [x, y, z] 형태의 center 좌표',
            'up:Array - [x, y, z] 형태의 up 벡터'
        ],
        value:function matLookAt(eye, center, up) {
            var a = rawInit(this), x0, x1, x2, y0, y1, y2, z0, z1, z2, len, 
                eyex = eye[0], eyey = eye[1], eyez = eye[2], 
                upx = up[0], upy = up[1], upz = up[2], 
                centerx = center[0], centery = center[1], centerz = center[2];
            if (ABS(eyex - centerx) < GLMAT_EPSILON && ABS(eyey - centery) < GLMAT_EPSILON && ABS(eyez - centerz) < GLMAT_EPSILON) return this.matIdentity();
            z0 = eyex - centerx, z1 = eyey - centery, z2 = eyez - centerz, 
            len = 1 / SQRT(z0 * z0 + z1 * z1 + z2 * z2), 
            z0 *= len, z1 *= len, z2 *= len, 
            x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0, 
            len = SQRT(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) x0 = 0, x1 = 0, x2 = 0;
            else len = 1 / len, x0 *= len, x1 *= len, x2 *= len;
            y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0, 
            len = SQRT(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) y0 = 0, y1 = 0, y2 = 0;
            else len = 1 / len, y0 *= len, y1 *= len, y2 *= len;
            a[0] = x0, a[1] = y0, a[2] = z0, a[3] = 0,
            a[4] = x1, a[5] = y1, a[6] = z1, a[7] = 0,
            a[8] = x2, a[9] = y2, a[10] = z2, a[11] = 0,
            a[12] = -(x0 * eyex + x1 * eyey + x2 * eyez), 
            a[13] = -(y0 * eyex + y1 * eyey + y2 * eyez), 
            a[14] = -(z0 * eyex + z1 * eyey + z2 * eyez), 
            a[15] = 1;
            return this;
        }
    })
    .method('matStr', {
        description:'현재 매트릭스를 문자화한다.',
        sample: [
            'var mtx = new Matrix();',
            'console.log(mtx.matStr());'
        ],
        ret: ['String - 문자화된 매트릭스 raw를 반환'],
        value:function matStr() {
            var a = rawInit(this, 1);
            return 'Matrix(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
        }
    })
    .build();
})();
