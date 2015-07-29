# Matrix
* parent : 없음
* [Constructor](#constructor)

**field**
* [a,b,c,d,e,f](#abcdef)
* [m11..m14,m21..m24,m31..m34,m41..m44](#m11m14m21m24m31m34m41m44)

**method**
* [inverse](#inverse)
* [multiply](#multiply-matrixmatrix-)
* [multiplyLeft](#multiplyleft-matrixmatrix-)
* [rotate](#rotate-xdegree-ydegree-zdegree-)
* [rotateAxisAngle](#rotateaxisangle-xnumber-ynumber-znumber-angledegree-)
* [scale](#scale-xnumber-ynumber-znumber-)
* [setMatrixValue](#setmatrixvalue-transformstring-)
* [skew](#skew-xdegree-ydegree-zdegree-)
* [skewX](#skewx-angledegree-)
* [skewY](#skewy-angledegree-)
* [translate](#translate-xnumber-ynumber-znumber-)

**static**
* [Matrix.identity](#matrixidentity-matrixmatrix-)

[top][#]
## Constructor
```javascript
Matrix()
```

**description**

행렬연산을 cpu측에서 수행하기 위한 헬퍼객체. WebkitCSSMatrix 또는 MSCSSMatrix 등의 네이티브객체를 찾으면 그 객체가 Matrix로 제공되며 없는 경우는 폴리필 객체가 동일한 인터페이스로 제공됨. 기타 이 구현체에서 지원되지 않는 normal등의 연산은 static으로 제공. Matrix의 폴리필 구현체는 [jonbrennecke/CSSMatrix](https://github.com/jonbrennecke/CSSMatrix) 를 이용하고 있음(MIT License)

* [MSDN MSCSSMatrix](https://msdn.microsoft.com/en-us/library/windows/apps/hh453593.aspx)
* [W3C specification for 3D Transformations](http://www.w3.org/TR/css3-3d-transforms/#cssmatrix-interface)
* [jonbrennecke/CSSMatrix](https://github.com/jonbrennecke/CSSMatrix)
 
**param**
없음.

**sample**

```javascript
var matrix = new Matrix();
```

[top](#)
## a,b,c,d,e,f

**description**

각각 다음에 대응하는 별명임. a = m11, b = m21, c = m12, d = m22, e = m13, f = m23

**sample**
```javascript
var matrix = new Matrix();
matrix.a == matrix.m11
```

[top](#)
## m11..m14,m21..m24,m31..m34,m41..m44

**description**

4x4 행렬에서 m - 행번호 - 열번호 구조로 이름이 붙어있어 아래와 같은 형태에 부합함.
```
m11 m12 m13 m14
m21 m22 m23 m24
m31 m32 m33 m34
m41 m42 m43 m44
```

**sample**
```javascript
var matrix = new Matrix();
matrix.a == matrix.m11
```

[top](#)
## inverse()

**description**

역행렬을 반환함.

**param**

없음.

**return**

Matrix - 역행렬이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.inverse();
```

[top](#)
## multiply( matrix:Matrix )

**description**

인자로 받은 행렬과 곱한 결과를 반환함.

**param**

1. matrix:Matrix - 곱하고자 하는 행렬.

**return**

Matrix - 행렬곱이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.multiply( new Matrix() );
```

[top](#)
## multiplyLeft( matrix:Matrix )

**description**

인자로 받은 행렬을 기준으로 원본을 곱한 결과를 반환함.

**param**

1. matrix:Matrix - 곱하고자 하는 행렬.

**return**

Matrix - 행렬곱이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.multiplyLeft( new Matrix() );
```

[top](#)
## rotate( x:degree, y:degree, z:degree )

**description**

각도값으로 받은 x,y,z에 따라 행렬을 회전시킨 결과를 새로운 행렬로 반환함.

**param**

1. x:degree - x축회전값.
2. y:degree - y축회전값.
3. z:degree - z축회전값.

**return**

Matrix - 회전이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.rotate( 30, 20, 10 );
```

[top](#)
## rotateAxisAngle( x:number, y:number, z:number, angle:degree )

**description**

벡터 x,y,z로 정의된 가상의 축을 기준으로 angle만큼 회전시킨 회전시킨 결과를 새로운 행렬로 반환함.

**param**

1. x:number - 가상축의 x벡터.
2. y:number - 가상축의 y벡터.
3. z:number - 가상축의 z벡터.
4. angle:degree - 회전할 각도.

**return**

Matrix - 회전이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.rotateAxisAngle( 30, 20, 10, 50 );
```

[top](#)
## scale( x:number, y:number, z:number )

**description**

x,y,z축 방향으로 행렬을 확장시킴

**param**

1. x:number - x의 확장값.
2. y:number - y의 확장값.
3. z:number - z의 확장값.

**return**

Matrix - 회전이 적용된 새 행렬을 반환함. 원본 행렬에는 변화 없음.

**sample**

```javascript
var matrix1 = new Matrix();
var matrix2 = matrix1.scale( 1, 1, 2 );
```

[top](#)
## setMatrixValue( transform:string )

**description**

CSS의 transform에 사용되는 문자열을 통해 현재 행렬의 값을 조정함.

**param**

1. transform:string - CSS의 transform항목에 사용되는 값

**return**

boolean - 정상적으로 반영되면 true가 반환됨.

**sample**

```javascript
var matrix1 = new Matrix();
matrix1.setMatrixValue( 'translateX(3px) rotate(50dgree)' );
```

[top](#)
## skew( x:degree, y:degree, z:degree )

**description**

기울임


[top](#)
## skewX( angle:degree )

**description**

X축으로 기울임

[top](#)
## skewY( angle:degree )

**description**

Y축으로 기울임


[top](#)
## translate( x:number, y:number, z:number )

**description**

x, y, z 방향으로 평행이동 시킴


[top](#)
## Matrix.identity( matrix:Matrix )

**description**

주어진 행렬을 초기화함.
