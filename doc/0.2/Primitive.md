## Primitive

**static**

* [Primitive.cube](#primitivecube-splitxint-splityint-splitzint-)
* [Primitive.geodesic](#primitivegeodesic-splitint-)
* [Primitive.line](#primitiveline-x1number-y1-z1-x2-y2-z2-widthnumber-)
* [Primitive.plane](#primitiveplane-splitxint-splityint-)
* [Primitive.point](#primitivepoint-widthnumber-)
* [Primitive.sphere](#primitivesphere-splitint-)
* [Primitive.skybox](#primitiveskybox-splitxint-splityint-splitzint-)
* [Primitive.polygon](#primitivepolygon-nint-radiusnumber-)

[top](#)
## Primitive.cube( [splitX:int, splitY:int, splitZ:int] )

**description**

내장된 Geometry.

각 정육면체 구조를 생성함.

**param**

1. ?splitX:int, splitY:int, splitZ:int - 각 면당 분할할 수. 생략시 1로 지정됨.

**sample**

```javascript
scene.addChild( 'cube1', new Mesh( Primitive.cube( 2, 3, 1 ), new Material() );
```

[top](#)
## Primitive.geodesic( [split:int] );

**description**

내장된 Geometry.

극점에서 폴리곤이 몰리지 않도록 Geodesic 형태로 생성되는 구의 구조.

**param**

1. ?split:int - 쪼개질 다각형의 갯수. 생략하거나 30이하의 값이 오면 30이 됨.

**sample**

```javascript
scene.addChild( 'geo0', new Mesh( Primitive.geodesic(30), new Material() );
```

[top](#)
## Primitive.line( x1:number, y1, z1, x2, y2, z2[, width:number] )

**description**

내장된 Geometry.

두 점을 지나는 직선.

**param**

1. x1:number, y1, z1, x2, y2, z2 - 직선이 지나갈 두점(x1, y1, z1 에서 x2, y2, z2)
2. ?width:number - 직선의 두께. 생략하면 1.

**sample**

```javascript
scene.addChild( 'l', new Mesh( Primitive.line( 0,0,0, 10,10,10, 2 ), new Material() );
```

[top](#)
## Primitive.plane( [splitX:int, splitY:int] )

**description**

내장된 Geometry.

하나의 평면.

**param**

1. ?splitX:int, splitY:int - 각 면당 분할할 수. 생략시 1로 지정됨.

**sample**

```javascript
scene.addChild( 'pl', new Mesh( Primitive.plane(5,5), new Material() );
```

[top](#)
## Primitive.point( [width:number] )

**description**

내장된 Geometry.

하나의 점을 나타내는 구조.

**param**

1. ?width:number - 점의 지름. 생략하면 1.


**sample**

```javascript
scene.addChild( 'p', new Mesh( Primitive.point(5), new Material() );
```

[top](#)
## Primitive.sphere( [split:int] )

**description**

내장된 Geometry.

일반적으로 극점에 삼각형이 몰리되게되는구형태의 구조물.

**param**

1. ?split:int - 나뉠 면의 수. 생략하거나 8이하의 값이면 8.


**sample**

```javascript
scene.addChild( 's1', new Mesh( Primitive.sphere(50), new Material() );
```

[top](#)
## Primitive.skybox( [splitX:int, splitY:int, splitZ:int] )

**description**

내장된 Geometry.

큐브형태의 구조로 각 평면이 내부를 바라보도록 되어있음.

**param**

1. ?splitX:int, splitY:int, splitZ:int - 각 면당 분할할 수. 생략시 1로 지정됨.


**sample**

```javascript
scene.addChild( 'box', new Mesh( Primitive.skybox( 5, 5, 5 ), new Material() );
```

[top](#)
## Primitive.polygon( [n:int, radius:number] )

**description**

내장된 Geometry.

꼭지점의 수가 n이고, 반경이 radius인 정다각형

**param**

1. ?n:int - 정다각형 꼭지점의 수. 생략 시 3으로 지정됨.
2. ?radius:number - 정다각형의 중심에서 각 꼭지점까지의 거리. 생략 시 1로 지정됨.


**sample**

```javascript
scene.addChild( 'polygon', new Mesh( Primitive.polygon(17, 4.5), new Material() ) );
```

[top](#)
