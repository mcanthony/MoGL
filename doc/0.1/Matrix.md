# Matrix
* parent : 없음
* [Constructor](#constructor)

**field**

**method**
없음 

**static**
* [Matrix.create](#create)
* [Matrix.clone](#clone)
* [Matrix.copy](#copy)
* [Matrix.copy](#identity)
* [Matrix.invert](#invert)
* [Matrix.multiply](#multiply)
* [Matrix.translate](#translate)
* [Matrix.scale](#scale)
* [Matrix.rotate](#rotate)
* [Matrix.rotateX](#rotateX)
* [Matrix.rotateY](#rotateY)
* [Matrix.rotateZ](#rotateZ)
* [Matrix.perspective](#perspective)
* [Matrix.lookAt](#lookAt)
* [Matrix.str](#str)

[top][#]
## Constructor

**description**

행렬연산을 cpu측에서 수행하기 위한 헬퍼객체. 
glMatrix (http://glmatrix.net/) 의 mat4 구현체중 일부를 사용함

**param**

없음.

[top](#)
## create()

**description**

Float32Array 형식의 Mat44를 생성함

**param**

없음.

**sample**
```javascript
var mat4 = Matrix.create()
```

[top](#)
## clone(base:Array or Float32Array)

**description**

Mat44 복제

**param**

1. base : Matrix.create()로 생성된 배열 또는 matrix 형식의 Array or Float32Array

**sample**
```javascript
var mat4 = Matrix.create()
var cloneMat4 = Matrix.clone(mat4)
```

[top](#)
## copy(out,base)

**description**

out 매트릭스의 값을 base의 값으로 복사

**param**

1. out : 복제될 대상
2. base : 복제 소스

**sample**
```javascript
var mat1 = Matrix.create()
var mat2 = Matrix.create()
Matrix.clone(mat1,mat2) // mat2의 값이 mat1으로 복사된다.
```

[top](#)

## identity(target)

**description**

target의 매트릭스 값을 초기화 

**param**

1. target : 초기화 대상 매트릭스

**sample**
```javascript
var mat1 = Matrix.create()
mat1.identity()
// [
//  1,0,0,0,
//  0,1,0,0,
//  0,0,1,0,
//  0,0,0,1
// ]
```

[top](#)
## invert(out,base)

**description**
target의 매트릭스 값을 반전시킨다.

**param**

1. out : 결과값을 반영할 매트릭스.
2. base : 반전할 매트릭스 ( 본인은 변동없음 )

**sample**
```javascript
var mat44 = Matrix.create()
var invertMat44 = Matrix.create()
mat1.invert(invertMat44,mat44)

```

[top](#)
## multiply(out,sourceMatrix1,sourceMatrix2)

**description**
sourceMatrix1과 sourceMatrix2의 행렬을 곱한값을 out으로 반영

**param**

1. out : 결과값을 반영할 매트릭스.
2. sourceMatrix1 : 매트릭스1 ( 연산후 본인은 변동없음 ).
3. sourceMatrix1 : 매트릭스2 ( 연산후 본인은 변동없음 ).

**sample**
```javascript
var out = Matrix.create()
var sourceMatrix1 = Matrix.create()
var sourceMatrix2 = Matrix.create()
mat1.multiply(out, sourceMatrix1, sourceMatrix2)

```

[top](#)
## translate(out,matrix,vec3:Array)

**description**
x, y, z 방향으로 평행이동 시킴

**param**

1. out : 결과값을 반영할 매트릭스.
2. matrix : 매트릭스 ( 연산후 본인은 변동없음 ).
3. vec3 : 평행이동 시킬 x,y,z를 배열 형식으로 입력 [x,y,z]

**sample**
```javascript
var out = Matrix.create()
Matrix.translate(out,out,[10,20,30])
```

[top](#)
## scale(out,matrix,scaleVec3:Array)

**description**
x,y,z축 방향으로 행렬을 확장시킴

**param**

1. out : 결과값을 반영할 매트릭스.
2. matrix : 매트릭스 ( 연산후 본인은 변동없음 ).
3. vec3 : x,y,z축 방향의 확장값을 배열 형식으로 입력 [scaleX,scaleY,scaleZ]

**sample**
```javascript
var out = Matrix.create()
Matrix.scale(out,out,[10,20,30])
```

[top](#)
## rotateX(out,matrix,radian:number)

**description**
x축 방향으로 행렬을 회전 시킨 행렬을 반환

**param**

1. out : 결과값을 반영할 매트릭스.
2. matrix : 회전시킬 매트릭스 솟스.
3. radian : 회전각

**sample**
```javascript
var out = Matrix.create()
Matrix.rotateX(out,out,10*Math.PI/180)
```

[top](#)

## rotateY(out,matrix,radian:number)

**description**
y축 방향으로 행렬을 회전 시킨 행렬을 반환

**param**

1. out : 결과값을 반영할 매트릭스.
2. matrix : 회전시킬 매트릭스 솟스.
3. radian : 회전각

**sample**
```javascript
var out = Matrix.create()
Matrix.rotateY(out,out,10*Math.PI/180)
```

[top](#)
## rotateZ(out,matrix,radian:number)

**description**
Z축 방향으로 행렬을 회전 시킨 행렬을 반환

**param**

1. out : 결과값을 반영할 매트릭스.
2. matrix : 회전시킬 매트릭스 솟스.
3. radian : 회전각

**sample**
```javascript
var out = Matrix.create()
Matrix.rotateZ(out,out,10*Math.PI/180)
```

[top](#)
## perspective(out,fovy:number,aspect,near,far)

**description**
퍼스펙티브 행렬을 반환

**param**

1. out : 결과값을 반영할 매트릭스.
2. fovy : Vertical field of view : radians
3. aspect : width/height
4. near : 절단면의 최소z (0<값)
5. far : 절단면의 최대z

**sample**
```javascript
var out = Matrix.create()
Matrix.perspective(out, 55*Math.PI/180, 1024/768, 0.1, 1000)
      
```

[top](#)

