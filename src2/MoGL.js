var MoGL = (function() {//<--
    'use strict';//-->
    var Builder, build, checker,
        MoGL, idProp, destroy, classGet, error,
        addInterval, removeInterval, resumeInterval, stopInterval, stopDelay, resumeDelay;

    //global interval manager
    (function() {
        var intervalId = -1, interpolate = 0, pause = 0, interval = [], len = 0, 
            timer, info = [], uuid = 0, loop, stop = 0;
        loop = function loop(){
            var t, i;
            if (stop) return;
            t = performance.now() - interpolate, i = len;
            while (i--) interval[i](t);
        },
        resumeDelay = function(){
            timer = 0, resumeInterval();
        },
        resumeInterval = function(t){
            if (timer) return;
            if (t) setTimeout(resumeDelay, timer = t * 1000);
            else if (stop) {
                interpolate += performance.now() - pause;
                stop = 0;
            }
        },
        stopDelay = function(){
            timer = 0, stopInterval();
        },
        stopInterval = function(t){
            if (timer) return;
            if (t) setTimeout(stopDelay, timer = t * 1000);
            else if (!stop) {
                pause = performance.now();
                stop = 1;
            }
        },
        addInterval = function(f, key) {
            if (key) {
                if (info[key]) throw new Error(0);
            } else {
                key = uuid++;
            }
            interval[interval.length] = info[key] = f,
            len = interval.length;
            if (intervalId == -1) {
                intervalId = setInterval(loop, 10),
                interpolate = 0;
            }
            return key;
        },
        removeInterval = function(key) {
            var f, i, k;
            if (f = info[key]) {
                delete info[key],
                interval.splice(interval.indexOf(f), 1);
            } else {
                i = interval.indexOf(key);
                if(i == -1) throw new Error(0);
                f = interval[i];
                for (k in info) {
                    if (info[k] === f || info[k].name === f) {
                        delete info[k];
                        break;
                    }
                }
                interval.splice(i, 1);
            }
            len = interval.length;
            if (!len) clearInterval(intervalId), intervalId = -1;
        };
    })(),
    checker = {},
    Builder = function(v, parent, check){
        var p, i;
        if (check !== checker) throw new Error('Builder only called by extend');
        this.parent = parent,
        this._construct = v,
        this._info = {_method:{},_static:{},_field:{},_constant:{},_event:{}},
        this._method = {},
        this._static = {},
        this._field = {},
        this._constant = {},
        this._event = {},
        Object.freeze(this);
    },
    build = (function(){
        var empty, wrap, method, prev, readonly, writable, isFactory, isSuperChain,
            inheritedStatic, md,
            uuid, allInstance, ids, classes;
        empty = function(){return '';},
        uuid = 0,
        allInstance = {},
        ids = {},
        classes = {},
        isFactory = {factory:1},//enum for factory
        isSuperChain = {superChain:1},//enum for constructor chaining
        readonly = {}, writable = {writable:true},
        prev = [], //error stack
        md = {//<--
            '*description':'Print markdown document for class',
            '*return':'[#string] - Markdown document',//-->
            name:'md',
			value:$md ? $md(classes) : empty
        },
        inheritedStatic = [
            {//<--
                '*description':[
                    'Get class Builder builds a inherited sub class of this class',
                    '',
                    '**Methods of class Builder**',
                    '',
                    'All methods are chaining method',
                    "ex) Matrix = MoGL.extend(meta).static(...).field(...).method(...)....build();",
                    '',
                    "* field(meta) - define property",
                    "* method(meta) - define method",
                    "* constant(meta) - define const",
                    "* event(meta) - define event",
                    "* static(meta) - define static method",
                    "* build() - build class with meta datas",
                    '',
                    '**Meta descriptor**',
                    '',
                    "Object descriptor extended from property descriptor or accessor descriptor for Object.defineProperty describes a part of class(field,methods..)",
                    "ex) meta = {'*name':'extend', '*description':['...'], ...}",
                    '',
                    "* '*description':[#string]|[#array] - description of target",
                    "* '*param':[#string]|[#array] - parameter of method(orderd)",
                    "* '*return':[#string]|[#array] - return value of method",
                    "* '*type':[#string] - type of field or const",
                    "* '*default':* - default value of field(field only)",
                    "* name:[#string]|[#array] - target name",
                    "* property, accessor descriptor - configurable, enumerable, value, writable, get, set"
                ],
                '*param':'metaDescriptor:[#Object] - meta descriptor for constructor(required name, value)',
                '*return':'[#classBuilder]',
                '*sample':"var classA = MoGL.extend({name:'classA', value:function(){}}).build();",//-->
                name:'extend',
                value:function extend(v) {
                    return new Builder(v, this, checker);
                }
            },
            {//<--
                '*description':'Get instance with uuid or id of instance',
                '*param':'uuid:[#string] - uuid or id of the instance',
                '*return':'* - instance of class. return null if no founded',
                '*sample':"var instance = Mesh.getInstance(uuid);",//-->
                name:'getInstance',
                value:function getInstance(v) {
                    var inst, p, k;
                    if (
                        ((inst = allInstance[v.uuid]) && inst.classId == this.uuid ) ||
                        ((p = ids[this.uuid]) && (inst = p[v]))
                    ) return inst;
                    else return null;
                }
            },
            {//<--
                '*description':'Get/Set share class storage vars',
                '*param':[
                    'key:[#string] - identified key',
                    '?val:* - value for set. if skipped, may act get'
                ],
                '*return':'* - get/set value for key',
                '*sample':[
                    "Mesh.share('listeners', {});",
                    "var listeners = Mesh.share('listeners');"
                ]//-->
                name:'share',
                value:(function() {
                    var v = {};
                    return function(key) {
                        var cls = this.uuid, t = v[cls] || (v[cls] = {});
                        if (arguments.length == 2 ){
                            t[key] = arguments[1];
                        }
                        return t[key];
                    };
                })()
            },
            {//<--
                '*description':'standard error processing in static method',
                '*param':[
                    'methodName:[#string] - static method name an exception occurred',
                    'id:[#int] - exception unique id'
                ],
                '*sample':[
                    "var classA = MoGL.extend({'*name':'classA', value:function(){}})",
                    "    .static({'*name':'test', value:function(){",
                    "	     this.error('test', 0);",
                    "    }})",
                    "    .build();"
                ],//-->
                name:'error',
                value:function error(method, id) {
                    throw new Error(this.className + '.' + method + ':' + id);
                }
            }//<--
            ,md//-->
        ],
        idProp = {//<--
            '*description':'user custom id. id is unique in same class. if set null, delete id',
            '*type':'string',
            '*default':'null', 
            '*sample':[
                "var scene = new Scene();",
                "scene.id = 'test1';",
                "console.log( scene.id ); //'test1'"
            ],//-->
            name:'id', 
            get:function idGet() {
                return ids[this.classId] ? ids[this.classId][this.uuid] || null : null;
            },
            set:function idSet(v) {
                if (!ids[this.classId]) ids[this.classId] = {ref:{}};
                else if (v in ids[this.classId].ref) throw new Error(this.className + '.idSetter:0');
                if (v === null && this.uuid in ids[this.classId]) {
                    v = ids[this.classId][this.uuid],
                    delete ids[this.classId][this.uuid],
                    delete ids[this.classId].ref[v];
                }else{
                    ids[this.classId][this.uuid] = v,
                    ids[this.classId].ref[v] = this.uuid;
                }
            }
        },
        destroy = function destroy() {
            var key;
            if(ids[this.classId] && this.uuid in ids[this.classId]){
                key = ids[this.classId][this],
                delete ids[this.classId][this],
                delete ids[this.classId].ref[key];
            }
            this.removeEventListener();
            delete allInstance[this],
            this.isAlive = false;
        },
        classGet = function classGet(context) {
            var k;
            if (!context) context = {};
            for (k in classes)  if (classes.hasOwnProperty(k)) context[k] = classes[k].cls;
            return context;
        },
        error = function error(id, msg) {
            throw new Error(this.className + '.' + method + ':' + id + (msg ? '-' + msg : ''));
        },
        MoGL = function MoGL() {
            $readonly.value = 'uuid:' + (uuid++),
            Object.defineProperty(this, 'uuid', $readonly), //객체고유아이디
            allInstance[this.uuid] = this,
            $writable.value = true,
            Object.defineProperty(this, 'isAlive', $writable);
        },
        wrap = (function(){
            var wrap = function wrap(key, f) {//name and method created
                return function() {
                    var result;
                    if (!this.isAlive) throw new Error('Destroyed Object:' + this);
                    prev[prev.length] = method,//error stack initilize
                    method = key,//method name of currently called
                    result = f.apply(this, arguments),
                    method = prev.pop();
                    return result;
                };
            };
            return function(target, prop, unwrap) {
                var k, v;
                for (k in prop) {
                    if (prop.hasOwnProperty(k)) {
                        v = prop[k];
                        if (!unwrap) {
                            if (v.get) v.get = wrap(k + 'Get', v.get);
                            if (v.set) v.set = wrap(k + 'Set', v.set);
                            if (v.value) = wrap(k, v.value),
                        }
                        Object.defineProperty(target, k, v);
                    }
                }
            };
        })();
        return function(){
            var cls, parent, child, fn, prop, i, k, v;
            parent = this.parent,
            child = this._construct.value,
            cls = function() {
                var arg, arg0 = arguments[0], result;
                prev[prev.length] = method,
                method = 'constructor';
                if (arg0 === isSuperChain) {
                    if (parent) parent.call(this, isSuperChain, arguments[1]);
                    child.apply(this, arguments[1]);
                } else if (this instanceof cls) {
                    if (arg0 === isFactory) {
                        arg = arguments[1];
                    } else {
                        arg = arguments;
                    }
                    if (parent) parent.call(this, isSuperChain, arg),
                    child.apply(this, arg),
                    Object.seal(this),
                    result = this;
                } else {
                    result = cls.call(Object.create(cls.prototype), isFactory, arguments);
                }
                method = prev.pop();
                return result;
            },
            classes[this._construct.name] = {cls:cls, define:this};
            fn = parent ? Object.create(parent.prototype) : cls.prototype;

            readonly.value = cls.uuid = 'uuid:' + (uuid++),
            Object.defineProperty(fn, 'classId', readonly);
            
            readonly.value = cls.className = this._construct.name,
            Object.defineProperty(fn, 'className', readonly);
            
            k = inheritedStatic.length;
            while (k--) this.static(inheritedStatic[k]);
            
            wrap(fn, this._field),
            wrap(fn, this._method),
            wrap(cls, this._constant, true),
            wrap(cls, this._event, true),
            wrap(cls, this._static, true),
            cls.prototype = fn,
            Object.freeze(cls);
            if (parent) Object.freeze(fn); //except MoGL
            return cls;
        };
    })(),
    Object.defineProperties(Builder.prototype, (function(){
        var keys = 'configurable,enumerable,writable,get,set,value'.split(','),
            val = function(type){
                return {value:function(v, isdoc){
                    var p, i;
                    if (!isdoc) {
                        this[type][v.name] = p = {},
                        i = keys.length;
                        while (i--) if (keys[i] in v) p[keys[i]] = v[keys[i]];
                    }
                    this._info[type][v.name] = v;
                    if (!isdoc && 'value' in this[type][k]) this._info[type][k].value = this[type][k].value;
                    return this;
                }};
            };
        return {
            method:val('_method'),
            static:val('_static'),
            field:val('_field'),
            constant:val('_constant'),
            event:val('_event'),
            build:{value:build}
        };
    })()),
    Object.freeze(Builder),
    Object.freeze(Builder.prototype),
    MoGL = (function(){
        var MoGL, init, listener;
        listener = {},
        init = new Builder({//<--
            '*description':'base class of all MoGL classes',
            '*sample':"var instance = new MoGL();",//-->
            nama:'MoGL',
            value:MoGL
        }, null, checker)
        .field(idProp)
        .field({//<--
            '*description':'unique id of instance',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.uuid); //'uuid:24'"
            ],//-->
            name:'uuid'
        }, true)
        .field({//<--
            '*description':'class name of instance',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.className); //'Scene'"
            ],//-->
            name:'className'
        }, true)
        .field({//<--
            '*description':'uuid of class',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.classId); // 'uuid:22'"
            ],//-->
            name:'classId'
        }, true)
        .method({//<--
            '*description':[
                'standard error processing of MoGL',
                '',
                "* error printed - className + '.' + methodName + ':' + id",
                '* use in class method'
            ],
            '*param':[
                'id:[#int] - unique id of error',
                '?msg:[#string] - message of error',
            '*sample':[
                "fn.action = function(a){",
                "    if(!a) this.error(0);",
                "};"
            ],//-->
            name:'error'
        }, true)
        .method({//<--
            '*description':"all instance based on MoGL print 'uuid:XXX'(- same as this.uuid) when called toString",
            '*return':"[#string] - same value as this.uuid formatted 'uuid:XXX'",
            '*sample':[
                "var mat = new Matrix();",
                "console.log( mat + '' ); // 'uuid:22'"
            ],//-->
            name:'toString'
        }, true)
        .method({//<--
            '*description':[
                'cleanup instance(listener, idcahce, instanceCache, isAlive)',
                '',
                '* cannot use the instance after destroy'
            ],
            '*sample':[
                "var city1 = Scene();",
                "city1.destroy();"
            ],//-->
            name:'destroy',
            value:destroy
        })
        .method({//<--
            '*description':[
               'set properties use param object at once',
               '',
                '* when call with second param(ani), process automaticaly interpolize animation'
            ],
            '*param':[
                'vo:[#object] - value object for setting',
                '?ani:[#object] - value object for animation. only use below keys',
                '* "time":[#number] - animation time(second)',
                '* "delay":[#number] - first delay time(second)',
                '* "repeat":[#int] - loop count of animation. -1 is endless loop',
                '* "yoyo":[#boolean] - when loop, switch start value to end value',
                '* "ease":[#string] - interpolize function name(linear, backIn, backOut, backInOut, bounceOut, sineIn, sineOut, sineInOut, circleIn, circleOut, circleInOut, quadraticIn, quadraticOut)'
            ],
            '*return':'this',
            '*sample':[
                "var mat = Matrix();",
                "//set immediately",
                "mat.setProperties({x:10, y:20, z:30});",
                "",
                "//run interpolize animation",
                "var vo = {x:0, y:0, z:0};",
                "var ani = {time:1, delay:2, repeat:1, ease:'sineOut'};",
                "mat.setProperties(vo, ani);"
            ],//-->
            name:'setProperties',
            value:(function(){
                var loopstart, loop, target;
                loop = function loop(t){
                    var k0, k1, ani, inst, prop, init, rate, ease, a, b, c;
                    for (k0 in target) {
                        ani = target[k0];
                        if (t < ani.start) continue;//delay
                        inst = ani.target,
                        init = ani.init,
                        prop = ani.prop;
                        if (t < ani.end) {//progress
                            ease = ani.ease, a = (t - ani.start) / ani.term;
                            for (k1 in prop) {
                                c = init[k1], b = prop[k1] - init[k1],
                                inst[k1] = ease == 'linear' ? b*a+c :
                                    ease == 'backIn' ? b*a*a*(2.70158*a-1.70158)+c :
                                    ease == 'backOut' ? (a-=1, b*(a*a*(2.70158*a+1.70158)+1)+c) :
                                    ease == 'backInOut' ? (a*=2, 1>a ? .5*b*a*a*(3.5949095*a-2.5949095)+c : (a-=2, .5*b*(a*a*(3.70158*a+2.70158)+2)+c)) :
                                    ease == 'bounceOut' ? (.363636>a ? 7.5625*b*a*a+c : .727272>a ? (a-=0.545454,b*(7.5625*a*a+0.75)+c) : .90909>a ? (a-=0.818181,b*(7.5625*a*a+0.9375)+c) : (a-=0.95454, b*(7.5625*a*a+0.984375)+c)) :
                                    ease == 'sineIn' ? -b*Math.cos(a*PIH)+b+c :
                                    ease == 'sineOut' ? b*Math.sin(a*PIH)+c :
                                    ease == 'sineInOut' ? .5*-b*(Math.cos(PI*a)-1)+c :
                                    ease == 'circleIn' ? -b*(Math.sqrt(1-a*a)-1)+c :
                                    ease == 'circleOut' ? (a-=1, b*Math.sqrt(1-a*a)+c) :
                                    ease == 'circleInOut' ? (a*=2, 1>a ? .5*-b*(Math.sqrt(1-a*a)-1)+c : (a-=2, .5*b*(Math.sqrt(1-a*a)+1)+c)) :
                                    ease == 'quadraticIn' ? b*a*a+c :
                                    ease == 'quadraticOut' ? -b*a*(a-2)+c :
                                    c
                            }
                        } else if (ani.repeat) {
                            ani.repeat--,
                            ani.start = t,
                            ani.end = t + ani.term;
                            if (ani.yoyo) {
                                ani.init = prop,
                                ani.prop = init;
                            }
                            (k1 = listener[inst.uuid]) && (k1 = k1[MoGL.propertyRepeated]) && k1.length && inst.dispatch(MoGL.propertyRepeated);
                        } else {//end
                            for (k1 in prop) inst[k1] = prop[k1];
                            delete target[k0];
                            (k1 = listener[inst.uuid]) && (k1 = k1[MoGL.propertyChanged]) && k1.length && inst.dispatch(MoGL.propertyChanged);
                        }
                    }
                },
                target = {};
                return function setProperties(v, opt) {
                    var uuid = this.uuid, k, ani, start, end, term;
                    if (opt) {
                        target[uuid] = ani = {
                            ease:opt.ease || 'linear',
                            repeat:opt.repeat || 0,
                            yoyo:opt.yoyo || false,
                            target:this,
                            prop:{},
                            init:{},
                            start:performance.now() + ('delay' in opt ? opt.delay * 1000 : 0),
                            term:opt.time * 1000
                        };
                        ani.end = ani.start + ani.term;
                        for (k in v) ani.init[k] = this[k], ani.prop[k] = v[k];
                        if (!loopstart) {
                            loopstart = true,
                            MoGL.addInterval(loop);
                        }
                    } else {
                        delete target[uuid];
                        for (k in v) this[k] = v[k];
                        this.dispatch(MoGL.propertyChanged);
                    }
                    return this;
                };
            })()
        })
        .method({//<--
            '*description':'add event listener',
            '*param':[
                'event:[#string] - event type name',
                'listener:[#function] - event listener',
                '?context:* - object mapping "this" in listener(default is the instance. false for ignore)',
                '?...arg:* - added parameter for listener'
            ],
            '*return':'this',
            '*sample':[
                "var city1 = Scene();",
                "city1.addEventListener(MoGL.propertyChanged, function(v){",
                "  console.log(v);",
                "});",
                "city1.setProperties({baseLightRotate:[0,1,0]});",
                "",
                "var city2 = Scene();",
                "city1.addEventListener(MoGL.propertyChanged, function(v, added){",
                "  console.log(this == city2);",
                "  console.log(added == 10);",
                "}, city2, 10);",
                "city2.setProperties({baseLightRotate:[0,1,0]});",
            ],//-->
            name:'addEventListener',
            value:function addEventListener(ev, f) {
                var target, cnt;
                if (!listener[this.uuid]) listener[this.uuid] = {};
                target = listener[this.uuid];
                if (!target[ev]) target[ev] = [];
                target = target[ev],
                target[target.length] = {
                    f:f, 
                    cx:arguments[2] || this, 
                    arg:arguments.length > 3 ? Array.prototype.slice.call(arguments, 3) : null
                },
                this.dispatch(MoGL.eventChanged, ev, target.length);
                return this;
            }
        })
        .method({//<--
            '*description':'remove event listener',
            '*param':[
                '?event:[#string] - event type name. if skipped, remove all event listener',
                '?listener:[#string] | [#function] - target listener. if string, search by function name. if skipped, remove all listeners of event type'
            ],
            '*return':'this',
            '*sample':[
                "var scene = new Scene();",
                "var listener = function test(){",
                "  console.log('test');",
                "};",
                "scene.addEventListener(MoGL.propertyChanged, listener);",
                "//1 remove by function ref",
                "scene.removeEventListener(MoGL.propertyChanged, listener);",
                "//2 remove by function name",
                "scene.removeEventListener(MoGL.propertyChanged, 'test');",
                "//3 remove by event type",
                "scene.removeEventListener(MoGL.propertyChanged);"
                "//4 remove all listeners",
                "scene.removeEventListener();"
            ],//-->
            name:'removeEventListener',
            value:function removeEventListener(ev, f) {
                var uuid = this.uuid, target, cnt, i;
                if (!listener[uuid]) return this;
                if (!ev) return delete listener[uuid], this;
                else if (!listener[uuid][ev]) return this;
                target = listener[uuid][ev];
                if (f) {
                    i = target.length;
                    while (i--) if ((typeof f == 'string' && target[i].f.name == f) || target[i].f === f) target.splice(i, 1);
                } else target.length = 0;
                this.dispatch(MoGL.eventChanged, ev, target.length);
                return this;
            }
        })
        .method({//<--
            '*description':'fire event for registed listeners(with additional arguments optionly.',
            '*param':[
                'event:[#string] - event type name',
                '?...arg - additional arguments'
            ],
            '*return':'this',
            '*sample':[
                "var scene = new Scene();",
                "city1.dispatch(MoGL.propertyChanged);"
            ],//-->
            name:'dispatch',
            value:function dispatch(ev) {
                var uuid = this.uuid, target, arg, i, j, k;
                if (listener[uuid] && listener[uuid][ev]) {
                    if(arguments.length > 1) arg = Array.prototype.slice.call(arguments, 1);
                    for (target = listener[uuid][ev], i = 0, j = target.length ; i < j ; i++) {
                        k = target[i];
                        if (arg) k.f.apply(k.cx, k.arg ? arg.concat(k.arg) : arg);
                        else if (k.arg) k.f.apply(k.cx, k.arg);
                        else  k.f.call(k.cx);
                    }
                }
                return this;
            }
        })
        .static({//<--
            '*description':'add function at single interval managed MoGL',
            '*param':[
                'target:[#function] - target listener',
                '?key:[#string] - key for removing. if skipped, generate random key'
            ],
            '*return':'[#string] - unique key',
            '*sample':[
                "var loop = function(time){",
                "  console.log('tick');"
                "};",
                "//remove with generated key",
                "var id = MoGL.addInterval(loop);",
                "MoGL.removeInterval(id);",
                "//remove with declared key",
                "MoGL.addInterval(loop, 'test');",
                "MoGL.removeInterval('test');",
                "//remove with function ref",
                "MoGL.addInterval(loop);",
                "MoGL.removeInterval(loop);"
            ],//-->
            name:'addInterval',
            value:addInterval
        })
        .static({//<--
            '*description':'remove function at single interval managed MoGL',
            '*param':'target:[#function] | [#string] - target function or id or function name',
            '*sample':[
                "var loop = function test(time){};",
                "var id = MoGL.addInterval(loop);",
                "//remove with id",
                "MoGL.removeInterval(id);",
                "//remove with function ref",
                "MoGL.removeInterval(loop);",
                "//remove with function name",
                "MoGL.removeInterval('test');"
            ],//-->
            name:'removeInterval',
            value:removeInterval
        })
        .static({//<--
            '*description':'revive interval stoped by MoGL.stopInterval.',
            '*param':'?delay:[#number] - optional delay time(secone)',
            '*sample':[
                "MoGL.addInterval(loop);",
                "MoGL.stopInterval();",
                "MoGL.resumeInterval(1);"
            ],-->
            'name':'resumeInterval',
            value:resumeInterval
        })
        .static({//<--
            '*description':'stop interval',
            '*param':'?delay:[#number] - optional delay time(secone)',
            '*sample':[
                "MoGL.addInterval(loop);",
                "MoGL.stopInterval(2);"
            ],-->
            name:'stopInterval',
            value:stopInterval
        })
        .static({//<--
            '*description':[
                'copy all sub classes of MoGL to target object',
                '',
                '* default namespace is unconvience like "new MoGL.Mesh()"',
                '* after classes copy, code may be like "new Mesh()"'
            ],
            '*param':'?context:[#object] - object to copy classes. if skipped, use new object',
            '*return':'[#object] - object passed as arguments or new object if skipped',
            '*sample':[
                "//copy to target object",
                "var $ = MoGL.classes();",
                "var scene = new $.Scene();",
                "",
                "//copy to global",
                "MoGL.classes(window);",
                "var scene = new Scene();"
            ],//-->
            name:'classes',
            value:classGet
        })
        .event({//<--
            '*description':[
                '* when - event listener added or removed',
                '* listener - function(MoGL.eventChanged, changedEventListenerCount)',
                '    1. MoGL.eventChanged - changed event name',
                '    2. changedEventListenerCount:[#int] - count of listener in MoGL.eventChanged',
            ],
            '*type':'string',
            '*sample': [
                "var scene = new Scene();",
                "scene.addEventListener(MoGL.eventChanged, function(ev, cnt, allCnt){",
                "  //2. after MoGL.propertyChanged listener added",
                "  console.log(ev, cnt);//'propertyChanged', 1",
                "});",
                "//1 add MoGL.propertyChanged event listener",
                "scene.addEventListener(MoGL.propertyChanged, function(){});"
            ],//-->
            name:'eventChanged',
            value:'eventChanged'
        })
        .event({//<--
            '*description':[
                '* when - completed setProperties',
                '    *. if animation case, occur after the animation ends',
                '* listener - function()'
            ],
            '*type':'string',
            '*sample':[
                "var mat = new Matrix();",
                "mat.addEventListener(MoGL.propertyChanged, function(){",
                "  console.log('changed');",
                "});",
                "mat.setProperties({x:50}, {time:1});"
            ],//-->
            name:'propertyChanged',
            value:'propertyChanged'
        })
        .event({//<--
            '*description':[
                '* when - each animation repeated',
                '* listener - function()'
            ],
            '*type':'string',
            '*sample':[
                "var mat = new Matrix();",
                "mat.addEventListener(MoGL.propertyRepeated, function(){",
                "  console.log('propertyRepeated');//print 3 times",
                "} );",
                "//set animation with repeat",
                "mat.setProperties({x:50}, {time:1, repeat:3});"
            ],//-->
            name:'propertyRepeated',
            value:'propertyRepeated'
        });
        MoGL = init.build(),
        MoGL.share('listener', listener);
        return MoGL;
    })(),
    (function(){
        var fn = MoGL.prototype;
        fn.error = error,    
        fn.toString = function(){
            return this.uuid;
        },
        Object.freeze(fn);
    })();
    return MoGL;
})();