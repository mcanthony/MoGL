#MoGL
* [constructor](#constructor)


**event**

* [eventChanged](#eventChanged) - fired when - an even...
* [propertyChanged](#propertyChanged) - fired when - setting...
* [propertyRepeated](#propertyRepeated) - fired when - each an...

**field**

* [classId](#classId) - uuid of a class
* [className](#className) - Class name of an ins...
* [id](#id) - User defined custom...
* [invoker](#invoker) - Invoker</i> managing...
* [uuid](#uuid) - Unique id of an inst...

**method**

* [addEventListener](#addEventListener) - Add an event listene...
* [destroy](#destroy) - Cleanup an instance(...
* [dispatch](#dispatch) - Fire an event for re...
* [error](#error) - Standard error handl...
* [removeEventListener](#removeEventListener) - Remove an event list...
* [restore](#restore) - restore state from s...
* [save](#save) - save current state
* [setProperties](#setProperties) - Set properties at a...
* [super](#super) - parent method as sam...
* [toString](#toString) - All instances based...

**static**

* [addInterval](#addInterval) - Add an interval func...
* [classes](#classes) - Copy all subclasses...
* [error](#error) - Standard error handl...
* [extend](#extend) - Get class Builder wh...
* [getInstance](#getInstance) - Get an instance with...
* [md](#md) - Print markdown docum...
* [removeInterval](#removeInterval) - Remove an interval f...
* [resumeInterval](#resumeInterval) - Resume an interval s...
* [share](#share) - Getter or setter for...
* [stopInterval](#stopInterval) - Stop an interval

[top](#)

<a name="constructor"></a>
###<div style="background:#eee">constructor</div>

**description**

Base class of all MoGL classes

**param**

none

**sample**

```javascript
var instance = new MoGL();
```

[top](#)

<i style="color:#00a">const</i>
***

<i style="color:#00a">event</i>
***

<a name="eventChanged"></a><div style="background:#eee">
###eventChanged
</div>
**description**


* fired when - an event listener is added or removed
* listener - function(MoGL.eventChanged, changedEventListenerCount)
    1. MoGL.eventChanged - changed event name
    2. changedEventListenerCount:<i style="color:#a00">int</i> - count of listener in MoGL.eventChanged

**value**


* fixed - "eventChanged"
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">event</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var scene = new Scene();
scene.addEventListener(MoGL.eventChanged, function(ev, cnt, allCnt){
  //2. after MoGL.propertyChanged listener added
  console.log(ev, cnt);//'propertyChanged', 1
});
//1 add MoGL.propertyChanged event listener
scene.addEventListener(MoGL.propertyChanged, function(){});
```

[top](#)

<a name="propertyChanged"></a><div style="background:#eee">
###propertyChanged
</div>
**description**


* fired when - setting properties is completed
    *. if animation case, occur after the animation ends
* listener - function()

**value**


* fixed - "propertyChanged"
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">event</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var mat = new Matrix();
mat.addEventListener(MoGL.propertyChanged, function(){
  console.log('changed');
});
mat.setProperties({x:50}, {time:1});
```

[top](#)

<a name="propertyRepeated"></a><div style="background:#eee">
###propertyRepeated
</div>
**description**


* fired when - each animation is repeated
* listener - function()

**value**


* fixed - "propertyRepeated"
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">event</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var mat = new Matrix();
mat.addEventListener(MoGL.propertyRepeated, function(){
  console.log('propertyRepeated');//print 3 times
} );
//set animation with repeat
mat.setProperties({x:50}, {time:1, repeat:3});
```

[top](#)

<i style="color:#00a">field</i>
***

<a name="classId"></a><div style="background:#eee">
###classId
</div>
**description**


uuid of a class

**value**


* default - null
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">field</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var scene = new Scene();
console.log(scene.classId); // 'uuid:22'
```

[top](#)

<a name="className"></a><div style="background:#eee">
###className
</div>
**description**


Class name of an instance

**value**


* default - null
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">field</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var scene = new Scene();
console.log(scene.className); //'Scene'
```

[top](#)

<a name="id"></a><div style="background:#eee">
###id
</div>
**description**


User defined custom id. The id is unique in the same class. If set null, the id will be deleted

**value**


* default - null
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">field</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var scene = new Scene();
scene.id = 'test1';
console.log( scene.id ); //'test1'
```

[top](#)

<a name="invoker"></a><div style="background:#eee">
###invoker
</div>
**description**


<i style="color:#a00">Invoker</i> managing common command pattern for instance

* methods of <i style="color:#a00">Invoker</i>
* start(key:<i style="color:#a00">string</i>, ?copySnapshot:<i style="color:#a00">boolean</i>, ?isSupportUndo:<i style="color:#a00">boolean</i>) - start recording called method and arguments
    * when other recording, auto stop previous record
* stop(?isDeleteRecord:<i style="color:#a00">boolean</i>) - stop recoding
* play(key:<i style="color:#a00">string</i>) - play recorded commands of key
    * when other recording, auto stop previous record
* restore(key:<i style="color:#a00">string</i>) - restore state at start point(copySnapshot value should have been "true" at start point and the instance must have "save", "restore" method)
    * when other recording, auto stop previous record
* undo() - undo(isSupportUndo value should have been "true" at start point and the instance must have "save", "restore" method)

* redo() - redo(isSupportUndo value should have been "true" at start point and the instance must have "save", "restore" method)

**value**


* default - null
* type - <i style="color:#a00">Invoker</i>
* <i style="color:#00a">field</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var mat = Matrix();
//start recording with snapshot
mat.invoker.start('test', true, true);

//act some
mat.setProperties({x:10, y:20, z:30});
mat.setProperties({rotateX:10});

//undo, redo
mat.undo();
mat.redo();

//stop recording
mat.invoker.stop('test');

//replay record
mat.invoker.play('test');

//rollback record starting time
mat.invoker.restore('test');
```

[top](#)

<a name="uuid"></a><div style="background:#eee">
###uuid
</div>
**description**


Unique id of an instance

**value**


* default - null
* type - <i style="color:#a00">string</i>
* <i style="color:#00a">field</i>

**setting**

* writable : false
* enumerable : false
* configurable :false

**sample**

```javascript
var scene = new Scene();
console.log(scene.uuid); //'uuid:24'
```

[top](#)

<i style="color:#00a">method</i>
***

<a name="addEventListener"></a><div style="background:#eee">
###addEventListener(event:<i style="color:#a00">string</i>, listener:<i style="color:#a00">function</i>, ?context:<i style="color:#a00">&#42;</i>, ?...arg:<i style="color:#a00">&#42;</i>)</div>

<i style="color:#00a">method</i>

**description**


Add an event listener

**param**

1. event:<i style="color:#a00">string</i> - event type name
2. listener:<i style="color:#a00">function</i> - event listener
3. ?context:<i style="color:#a00">&#42;</i> - object mapping "this" in listener(default is the instance. false to ignore)
4. ?...arg:<i style="color:#a00">&#42;</i> - added parameter for the event listener

**return**


this - return self for method chaining

**sample**

```javascript
var city1 = Scene();
city1.addEventListener(MoGL.propertyChanged, function(v){
  console.log(v);
});
city1.setProperties({baseLightRotate:[0,1,0]});

var city2 = Scene();
city1.addEventListener(MoGL.propertyChanged, function(v, added){
  console.log(this == city2);
  console.log(added == 10);
}, city2, 10);
city2.setProperties({baseLightRotate:[0,1,0]});
```

[top](#)

<a name="destroy"></a><div style="background:#eee">
###destroy(none)</div>

<i style="color:#00a">method</i>

**description**


Cleanup an instance(listener, idcahce, instanceCache, isAlive)

* cannot use the instance after destroying it

**param**

1. none

**return**


none

**sample**

```javascript
var city1 = Scene();
city1.destroy();
```

[top](#)

<a name="dispatch"></a><div style="background:#eee">
###dispatch(event:<i style="color:#a00">string</i>, ?...arg)</div>

<i style="color:#00a">method</i>

**description**


Fire an event for registered listeners(with additional arguments optionally.

**param**

1. event:<i style="color:#a00">string</i> - event type name
2. ?...arg - additional arguments

**return**


this - return self for method chaining

**sample**

```javascript
var scene = new Scene();
city1.dispatch(MoGL.propertyChanged);
```

[top](#)

<a name="error"></a><div style="background:#eee">
###error(id:<i style="color:#a00">int</i>, ?msg:<i style="color:#a00">string</i>)</div>

<i style="color:#00a">method</i>

**description**


Standard error handler of MoGL

* error printed - className + '.' + methodName + ':' + id
* used in class method

**param**

1. id:<i style="color:#a00">int</i> - unique id of an error
2. ?msg:<i style="color:#a00">string</i> - message of an error

**return**


none

**sample**

```javascript
fn.action = function(a){
    if(!a) this.error(0);
};
```

[top](#)

<a name="removeEventListener"></a><div style="background:#eee">
###removeEventListener(?event:<i style="color:#a00">string</i>, ?listener:<i style="color:#a00">string</i> | <i style="color:#a00">function</i>)</div>

<i style="color:#00a">method</i>

**description**


Remove an event listener

**param**

1. ?event:<i style="color:#a00">string</i> - event type name. If skipped, remove all event listener
2. ?listener:<i style="color:#a00">string</i> | <i style="color:#a00">function</i> - target listener. If string, the target listener will be searched by function name. If omitted, remove all listeners of that event type

**return**


this - return self for method chaining

**sample**

```javascript
var scene = new Scene();
var listener = function test(){
  console.log('test');
};
scene.addEventListener(MoGL.propertyChanged, listener);
//1 remove by function ref
scene.removeEventListener(MoGL.propertyChanged, listener);
//2 remove by function name
scene.removeEventListener(MoGL.propertyChanged, 'test');
//3 remove by event type
scene.removeEventListener(MoGL.propertyChanged);
//4 remove all listeners
scene.removeEventListener();
```

[top](#)

<a name="restore"></a><div style="background:#eee">
###restore(none)</div>

<i style="color:#00a">method</i>

**description**


restore state from snapshot but MoGL may do nothing

**param**

1. none

**return**


none

**sample**

```javascript
var mat = Matrix()
var saved = mat.save();
mat.restore(saved);
```

[top](#)

<a name="save"></a><div style="background:#eee">
###save(none)</div>

<i style="color:#00a">method</i>

**description**


save current state

**param**

1. none

**return**


<i style="color:#a00">object</i> - empty object


**sample**

```javascript
var mat = Matrix()
var saved = mat.save();
mat.restore(saved);
```

[top](#)

<a name="setProperties"></a><div style="background:#eee">
###setProperties(vo:<i style="color:#a00">object</i>, ?ani:<i style="color:#a00">object</i>)</div>

<i style="color:#00a">method</i>

**description**


Set properties at a time using param object 

* when invoked with the second parameter, ani, it will automatically interpolate the animation according to the second parameter

**param**

1. vo:<i style="color:#a00">object</i> - value object for a setting
2. ?ani:<i style="color:#a00">object</i> - value object for an animation. Keys below are only permitted
    * "time":<i style="color:#a00">number</i> - animation time(second)
    * "delay":<i style="color:#a00">number</i> - first delay time(second)
    * "repeat":<i style="color:#a00">int</i> - loop count of an animation. -1 is endless loop
    * "yoyo":<i style="color:#a00">boolean</i> - when loop, switch start value with end value
    * "ease":<i style="color:#a00">string</i> - interpolation function name(linear, backIn, backOut, backInOut, bounceOut, sineIn, sineOut, sineInOut, circleIn, circleOut, circleInOut, quadraticIn, quadraticOut)

**return**


this - return self for method chaining

**sample**

```javascript
var mat = Matrix();
//set immediately
mat.setProperties({x:10, y:20, z:30});

//run interpolated animation
var vo = {x:0, y:0, z:0};
var ani = {time:1, delay:2, repeat:1, ease:'sineOut'};
mat.setProperties(vo, ani);
```

[top](#)

<a name="super"></a><div style="background:#eee">
###super(none)</div>

<i style="color:#00a">method</i>

**description**


parent method as same name

* use only inside method body
* if no super method, may happen nothing

**param**

1. none

**return**


<i style="color:#a00">*</i> - returned value of parent method

**sample**

```javascript
fn.action = function(a){
    this.super(a);
};
```

[top](#)

<a name="toString"></a><div style="background:#eee">
###toString(none)</div>

<i style="color:#00a">method</i>

**description**


All instances based on MoGL can print 'uuid:XXX'(- same as this.uuid) when invoked as a toString() method

**param**

1. none

**return**


<i style="color:#a00">string</i> - same value as this.uuid formatted 'uuid:XXX'

**sample**

```javascript
var mat = new Matrix();
console.log( mat + '' ); // 'uuid:22'
```

[top](#)
<i style="color:#00a">static</i>
***

<a name="addInterval"></a><div style="background:#eee">
###addInterval(target:<i style="color:#a00">function</i>, ?key:<i style="color:#a00">string</i>)</div>

<i style="color:#00a">static</i>

**description**


Add an interval function managed by MoGL

**param**

1. target:<i style="color:#a00">function</i> - target listener
2. ?key:<i style="color:#a00">string</i> - key for the target listener. If omitted, a random key will be generated

**return**


<i style="color:#a00">string</i> - unique key

**sample**

```javascript
var loop = function(time){
  console.log('tick');
};
//add and remove with a generated key
var id = MoGL.addInterval(loop);
MoGL.removeInterval(id);
//add and remove with a declared key
MoGL.addInterval(loop, 'test');
MoGL.removeInterval('test');
//add and remove with a function reference
MoGL.addInterval(loop);
MoGL.removeInterval(loop);
```

[top](#)

<a name="classes"></a><div style="background:#eee">
###classes(?context:<i style="color:#a00">object</i>)</div>

<i style="color:#00a">static</i>

**description**


Copy all subclasses of MoGL to a target object

* default namespace such as "new MoGL.Mesh() is inconvenient "
* after copying classes, it is easier to write the code, for example, the code can be like "new Mesh()"

**param**

1. ?context:<i style="color:#a00">object</i> - object to copy classes. if omitted, a new object will be used

**return**


<i style="color:#a00">object</i> - object passed as arguments or new object if omitted

**sample**

```javascript
//copy to a target object
var $ = MoGL.classes();
var scene = new $.Scene();

//copy to the global object
MoGL.classes(window);
var scene = new Scene();
```

[top](#)

<a name="error"></a><div style="background:#eee">
###error(methodName:<i style="color:#a00">string</i>, id:<i style="color:#a00">int</i>)</div>

<i style="color:#00a">static</i>

**description**


Standard error handler for methods

**param**

1. methodName:<i style="color:#a00">string</i> - name of the static method where an exception occurred
2. id:<i style="color:#a00">int</i> - exception unique id

**return**


none

**sample**

```javascript
var classA = MoGL.extend({'*name':'classA', value:function(){}})
    .static({'*name':'test', value:function(){
	     this.error('test', 0);
    }})
    .build();
```

[top](#)

<a name="extend"></a><div style="background:#eee">
###extend(metaDescriptor:<i style="color:#a00">Object</i>)</div>

<i style="color:#00a">static</i>

**description**


Get class Builder which builds an inherited subclass of this class

**Methods of class Builder**

All methods are chaining method

ex) Matrix = MoGL.extend(meta).static(...).field(...).method(...)....build();

* field(meta) - define property
* method(meta) - define method
* constant(meta) - define const
* event(meta) - define event
* static(meta) - define static method
* build() - build a class with meta data

**Meta descriptor**

Object descriptor extended from property descriptor or accessor descriptor for Object.defineProperty which describes a part of class(field,methods..)

ex) meta = {'*name':'extend', '*description':['...'], ...}

* '*description':<i style="color:#a00">string</i>|<i style="color:#a00">array</i> - description of target
* '*param':<i style="color:#a00">string</i>|<i style="color:#a00">array</i> - parameter of method(ordered)
* '*return':<i style="color:#a00">string</i>|<i style="color:#a00">array</i> - return value of method
* '*type':<i style="color:#a00">string</i> - type of field or const
* '*default':<i style="color:#a00">&#42;</i> - default value of field(field only)
* name:<i style="color:#a00">string</i>|<i style="color:#a00">array</i> - target name
* property, accessor descriptor - configurable, enumerable, value, writable, get, set

**param**

1. metaDescriptor:<i style="color:#a00">Object</i> - meta descriptor for constructor(required name, value)

**return**


<i style="color:#a00">classBuilder</i>

**sample**

```javascript
var classA = MoGL.extend({name:'classA', value:function(){}}).build();
```

[top](#)

<a name="getInstance"></a><div style="background:#eee">
###getInstance(uuid:<i style="color:#a00">string</i>)</div>

<i style="color:#00a">static</i>

**description**


Get an instance with its uuid or id

**param**

1. uuid:<i style="color:#a00">string</i> - uuid or id of the instance

**return**


* - instance of a class. return null if not founded

**sample**

```javascript
var instance = Mesh.getInstance(uuid);
```

[top](#)

<a name="md"></a><div style="background:#eee">
###md(none)</div>

<i style="color:#00a">static</i>

**description**


Print markdown document for class

**param**

1. none

**return**


<i style="color:#a00">string</i> - Markdown document

**sample**

```javascript
//none
```

[top](#)

<a name="removeInterval"></a><div style="background:#eee">
###removeInterval(target:<i style="color:#a00">function</i> | <i style="color:#a00">string</i>)</div>

<i style="color:#00a">static</i>

**description**


Remove an interval function managed MoGL

**param**

1. target:<i style="color:#a00">function</i> | <i style="color:#a00">string</i> - target function or id or function name

**return**


none

**sample**

```javascript
var loop = function test(time){};
//add with an id
var id = MoGL.addInterval(loop);
//remove with an id
MoGL.removeInterval(id);
//remove with a function reference
MoGL.removeInterval(loop);
//remove with a function name
MoGL.removeInterval('test');
```

[top](#)

<a name="resumeInterval"></a><div style="background:#eee">
###resumeInterval(?delay:<i style="color:#a00">number</i>)</div>

<i style="color:#00a">static</i>

**description**


Resume an interval stopped by MoGL.stopInterval().

**param**

1. ?delay:<i style="color:#a00">number</i> - optional delay time(secone)

**return**


none

**sample**

```javascript
MoGL.addInterval(loop);
MoGL.stopInterval();
MoGL.resumeInterval(1);
```

[top](#)

<a name="share"></a><div style="background:#eee">
###share(key:<i style="color:#a00">string</i>, ?val:<i style="color:#a00">&#42;</i>)</div>

<i style="color:#00a">static</i>

**description**


Getter or setter for variables which can be shared among the same class

**param**

1. key:<i style="color:#a00">string</i> - identified key
2. ?val:<i style="color:#a00">&#42;</i> - value for the key. If omitted, this share function acts as a getter

**return**


* - get/set value for the key

**sample**

```javascript
Mesh.share('listeners', {});
var listeners = Mesh.share('listeners');
```

[top](#)

<a name="stopInterval"></a><div style="background:#eee">
###stopInterval(?delay:<i style="color:#a00">number</i>)</div>

<i style="color:#00a">static</i>

**description**


Stop an interval

**param**

1. ?delay:<i style="color:#a00">number</i> - optional delay time(second)

**return**


none

**sample**

```javascript
MoGL.addInterval(loop);
MoGL.stopInterval(2);
```

[top](#)

