var MoGL = (function() {//<--
    'use strict';//-->
    var Builder, build, checker, 
        MoGL, _MoGL, idProp, destroy, classGet, error, invoker, _super,
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
        if (check !== checker) throw new Error('Builder should be called only by extend()');
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
        var empty, wrap, method, prev, superMethod, smethod,
            binder,
            isInvoke,
            isFactory, isSuperChain,//enum
            inheritedStatic, md,
            uuid, allInstance, ids, classes;
        
        binder = function(){//generic binder
            binder.act.apply(binder.context, arguments),
            binder.context.super = null;
        },
        empty = function(){return '';},
        uuid = 0,
        allInstance = {},
        ids = {},
        classes = {},
        isFactory = {factory:1},//enum for factory
        isSuperChain = {superChain:1},//enum for constructor chaining
        prev = [], //error stack
        superMethod = [], //super stack
        md = {//<--
            '*description':'Print markdown document for class',
            '*return':'[#string] - Markdown document',//-->
            name:'md',
			value:window['$md'] ? $md(classes) : empty
        },
        inheritedStatic = [
            {//<--
                '*description':[
                    'Get class Builder which builds an inherited subclass of this class',
                    '',
                    '**Methods of class Builder**',
                    '',
                    'All methods are chaining method\n',
                    "ex) Matrix = MoGL.extend(meta).static(...).field(...).method(...)....build();",
                    '',
                    "* field(meta) - define property",
                    "* method(meta) - define method",
                    "* constant(meta) - define const",
                    "* event(meta) - define event",
                    "* static(meta) - define static method",
                    "* build() - build a class with meta data",
                    '',
                    '**Meta descriptor**',
                    '',
                    "Object descriptor extended from property descriptor or accessor descriptor for Object.defineProperty which describes a part of class(field,methods..)",
                    "\nex) meta = {'*name':'extend', '*description':['...'], ...}",
                    '',
                    "* '*description':[#string]|[#array] - description of target",
                    "* '*param':[#string]|[#array] - parameter of method(ordered)",
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
                '*description':'Get an instance with its uuid or id',
                '*param':'uuid:[#string] - uuid or id of the instance',
                '*return':'* - instance of a class. return null if not founded',
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
                '*description':'Getter or setter for variables which can be shared among the same class',
                '*param':[
                    'key:[#string] - identified key',
                    '?val:* - value for the key. If omitted, this share function acts as a getter' // omw <- share가 사용자 입장에서는 그냥 함수이므로 class라 안하고 걍 function으로..
                ],
                '*return':'* - get/set value for the key',
                '*sample':[
                    "Mesh.share('listeners', {});",
                    "var listeners = Mesh.share('listeners');"
                ],//-->
                name:'share',
                value:(function () {
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
                '*description':'Standard error handler for methods',
                '*param':[
                    'methodName:[#string] - name of the static method where an exception occurred',
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
            '*description':'User defined custom id. The id is unique in the same class. If set null, the id will be deleted',
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
        _MoGL = function MoGL() {
            $readonly.value = 'uuid:' + (uuid++),
            Object.defineProperty(this, 'uuid', $readonly), //unique id
            allInstance[this.uuid] = this,
            $writable.value = true,
            Object.defineProperty(this, 'isAlive', $writable);
            $writable.value = null,
            Object.defineProperty(this, 'super', $writable);
        },        
        isInvoke = {save:1, restore:1}, //command pattern process for wrap function
        invoker = (function() {
            var fn, record, invokers, factory;
            record = {},
            fn = {
                start:function(key, copyClone, isSupportUndo) {
                    var uuid = this.uuid, curr;
                    if (isInvoke[uuid]) this.stop();
                    (isInvoke[uuid] = curr = record[uuid][key] || (record[uuid][key] = [])).length = 0,
                    curr.key = key,
                    curr.shot = null;
                    if (this.clonable && copyClone || isSupportUndo) isInvoke[uuid].shot = this.target.save();
                    if (curr.isUndo = isSupportUndo) {
                        (curr.undo || (curr.undo = [])).length = 0,
                        curr.undo[0] = curr.shot,
                        curr.undo.cursor = 0;
                    }
                },
                stop:function(isDeleteRecord){
                    var uuid = this.uuid, curr;
                    if (!isInvoke[uuid]) return;
                    if (isDeleteRecord) delete record[uuid][isInvoke[uuid].key]
                    isInvoke[uuid] = null;
                },
                play:function(key){
                    var uuid = this.uuid, target, commands, i, j;
                    if (isInvoke[uuid]) this.stop();
                    if (commands = record[uuid][key]){
                        target = this.target;
                        if (!target.isAlive) throw new Error('Destroyed Object:' + this);
                        i = 0, j = commands.length;
                        while (i < j) {
                            if (binder.act = commands[i++]) {
                                binder.context = target,
                                target.super = binder;
                            }
                            prev[prev.length] = method,
                            method = key,
                            commands[i++].apply(target, commands[i++]),
                            method = prev.pop(),
                            target.super = null;
                        }
                    }
                },
                undo:function(){
                    var uuid = this.uuid, curr, target;
                    if (!(curr = isInvoke[uuid]) || !curr.isUndo || !curr.undo.cursor) return;
                    target = this.target;
                    if (!target.isAlive) throw new Error('Destroyed Object:' + this);
                    target.restore(curr.undo[--curr.undo.cursor]);
                },
                redo:function(){
                    var uuid = this.uuid, curr, target;
                    if (!(curr = isInvoke[uuid]) || !curr.isUndo || curr.undo.cursor == curr.undo.length - 1) return;
                    target = this.target;
                    if (!target.isAlive) throw new Error('Destroyed Object:' + this);
                    target.restore(curr.undo[++curr.undo.cursor]);
                },
                restore:function(key){
                    var uuid = this.uuid, saved;
                    if (isInvoke[uuid]) this.stop();
                    if (saved = record[uuid][key].shot) this.target.restore(saved);
                }
            };
            Object.freeze(fn),
            invokers = {},
            factory = function(target){
                var inst = Object.create(fn);
                inst.clonable = target.save && target.restore,
                inst.target = target,
                record[inst.uuid = target.uuid] = {},
                Object.freeze(inst);
                return inst;
            };
            return function(){
                return invokers[this.uuid] || (invokers[this.uuid] = factory(this));
            };
        })(),
        error = function error(id, msg) {
            throw new Error(this.className + '.' + method + ':' + id + (msg ? '-' + msg : ''));
        },
        wrap = (function(){
            var wrap, empty;
            empty = function(){},
            wrap = function wrap(key, f, parent) {//name and method created
                var self = function() {
                    var result, inv;
                    if (!this.isAlive) throw new Error('Destroyed Object:' + this);
                    if (binder.act = self.__super) {//super method
                        binder.context = this,
                        this.super = binder;
                    }
                    prev[prev.length] = method,//error stack initilize
                    method = key;//method name of currently called
                    if (!isInvoke[method] && (inv = isInvoke[this.uuid])) inv.push(self.__super, f, arguments);//record command
                    result = f.apply(this, arguments);
                    if (inv && inv.isUndo) { //record undo
                        inv = inv.undo;
                        if (inv.cursor != inv.length - 1) inv.length = inv.cursor + 1;
                        inv[++inv.cursor] = this.save();
                    }
                    method = prev.pop();
                    this.super = null;
                    return result;
                };
                self.__super = parent ? parent[key] || empty : null;
                return self;
            };
            return function(target, prop, unwrap, parent) {
                var k, v;
                for (k in prop) {
                    if (prop.hasOwnProperty(k)) {
                        v = prop[k];
                        if (!unwrap) {
                            if (v.get) v.get = wrap(k + 'Get', v.get);
                            if (v.set) v.set = wrap(k + 'Set', v.set);
                            if (v.value) v.value = wrap(k, v.value, parent);
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
                    arg = arg0 === isFactory ? arguments[1] : arguments;
                    if (parent) parent.call(this, isSuperChain, arg),
                    child.apply(this, arg),
                    Object.seal(this),
                    result = this;
                } else {
                    result = cls.call(Object.create(fn), isFactory, arguments);
                }
                method = prev.pop();
                return result;
            },
            classes[this._construct.name] = {cls:cls, define:this};
            fn = parent ? Object.create(parent.prototype) : cls.prototype;

            $readonly.value = cls.uuid = 'uuid:' + (uuid++),
            Object.defineProperty(fn, 'classId', $readonly);
            
            $readonly.value = cls.className = this._construct.name,
            Object.defineProperty(fn, 'className', $readonly);
            
            k = inheritedStatic.length;
            while (k--) this.static(inheritedStatic[k]);
            
            wrap(fn, this._field),
            wrap(fn, this._method, false, cls.className != 'MoGL' && parent.prototype),
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
                    var p, k, i;
                    k = v.name;
                    if (!isdoc) {
                        this[type][k] = p = {},
                        i = keys.length;
                        while (i--) if (keys[i] in v) p[keys[i]] = v[keys[i]];
                    }
                    this._info[type][k] = v;
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
        var MoGL, listener, invoker;
        listener = {},
        invoker = {},
        MoGL = new Builder({//<--
            '*description':'Base class of all MoGL classes',
            '*sample':"var instance = new MoGL();",//-->
            name:'MoGL',
            value:_MoGL
        }, null, checker)
        .field(idProp)
        .field({//<--
            '*description':'Unique id of an instance',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.uuid); //'uuid:24'"
            ],//-->
            name:'uuid'
        }, true)
        .field({//<--
            '*description':'Class name of an instance',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.className); //'Scene'"
            ],//-->
            name:'className'
        }, true)
        .field({//<--
            '*description':'uuid of a class',
            '*type':'string',
            '*sample':[
                "var scene = new Scene();",
                "console.log(scene.classId); // 'uuid:22'"
            ],//-->
            name:'classId'
        }, true)
        .field({//<--
            '*description':[
                '[#Invoker] managing common command pattern for instance',
                '',
                '* methods of [#Invoker]',
                '* start(key:[#string], ?copySnapshot:[#boolean], ?isSupportUndo:[#boolean]) - start recording called method and arguments',
                '    * when other recording, auto stop previous record',
                '* stop(?isDeleteRecord:[#boolean]) - stop recoding',
                '* play(key:[#string]) - play recorded commands of key',
                '    * when other recording, auto stop previous record',
                '* restore(key:[#string]) - restore state at start point(copySnapshot value should have been "true" at start point and the instance must have "save", "restore" method)',
                '    * when other recording, auto stop previous record',
                '* undo() - undo(isSupportUndo value should have been "true" at start point and the instance must have "save", "restore" method)',,
                '* redo() - redo(isSupportUndo value should have been "true" at start point and the instance must have "save", "restore" method)'
            ],
            '*type':'Invoker',
            '*sample':[
                "var mat = Matrix();",
                "//start recording with snapshot",
                "mat.invoker.start('test', true, true);",
                "",
                "//act some",
                "mat.setProperties({x:10, y:20, z:30});",
                "mat.setProperties({rotateX:10});",
                '',
                "//undo, redo",
                "mat.undo();",
                "mat.redo();",
                "",
                "//stop recording",
                "mat.invoker.stop('test');",
                "",
                "//replay record",
                "mat.invoker.play('test');",
                "",
                "//rollback record starting time",
                "mat.invoker.restore('test');",
            ],//-->
            name:'invoker'
        }, true)
        .method({//<--
            '*description':[
                'parent method as same name',
                '',
                "* use only inside method body",
                "* if no super method, may happen nothing"
            ],
            '*return':'[#*] - returned value of parent method',
            '*sample':[
                "fn.action = function(a){",
                "    this.super(a);",
                "};"
            ],//-->
            name:'super'
        }, true)
        .method({//<--
            '*description':'save current state',
            '*return':'[#object] - empty object',
            '*sample':[
                "var mat = Matrix()",
                "var saved = mat.save();",
                "mat.restore(saved);",
            ],//-->
            name:'save'
        }, true)
        .method({//<--
            '*description':'restore state from snapshot but MoGL may do nothing',
            '*parem':'data:[#object] - data for restore',
            '*sample':[
                "var mat = Matrix()",
                "var saved = mat.save();",
                "mat.restore(saved);",
            ],//-->
            name:'restore'
        }, true)
        .method({//<--
            '*description':[
                'Standard error handler of MoGL',
                '',
                "* error printed - className + '.' + methodName + ':' + id",
                '* used in class method'
            ],
            '*param':[
                'id:[#int] - unique id of an error',
                '?msg:[#string] - message of an error'
            ],
            '*sample':[
                "fn.action = function(a){",
                "    if(!a) this.error(0);",
                "};"
            ],//-->
            name:'error'
        }, true)
        .method({//<--
            '*description':"All instances based on MoGL can print 'uuid:XXX'(- same as this.uuid) when invoked as a toString() method",
            '*return':"[#string] - same value as this.uuid formatted 'uuid:XXX'",
            '*sample':[
                "var mat = new Matrix();",
                "console.log( mat + '' ); // 'uuid:22'"
            ],//-->
            name:'toString'
        }, true)
        .method({//<--
            '*description':[
                'Cleanup an instance(listener, idcahce, instanceCache, isAlive)',
                '',
                '* cannot use the instance after destroying it'
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
               'Set properties at a time using param object ',
               '',
                '* when invoked with the second parameter, ani, it will automatically interpolate the animation according to the second parameter'
            ],
            '*param':[
                'vo:[#object] - value object for a setting',
                '?ani:[#object] - value object for an animation. Keys below are only permitted',
                '* "time":[#number] - animation time(second)',
                '* "delay":[#number] - first delay time(second)',
                '* "repeat":[#int] - loop count of an animation. -1 is endless loop',
                '* "yoyo":[#boolean] - when loop, switch start value with end value',
                '* "ease":[#string] - interpolation function name(linear, backIn, backOut, backInOut, bounceOut, sineIn, sineOut, sineInOut, circleIn, circleOut, circleInOut, quadraticIn, quadraticOut)'
            ],
            '*return':'this',
            '*sample':[
                "var mat = Matrix();",
                "//set immediately",
                "mat.setProperties({x:10, y:20, z:30});",
                "",
                "//run interpolated animation",
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
            '*description':'Add an event listener',
            '*param':[
                'event:[#string] - event type name',
                'listener:[#function] - event listener',
                '?context:* - object mapping "this" in listener(default is the instance. false to ignore)',
                '?...arg:* - added parameter for the event listener'
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
            '*description':'Remove an event listener',
            '*param':[
                '?event:[#string] - event type name. If skipped, remove all event listener',
                '?listener:[#string] | [#function] - target listener. If string, the target listener will be searched by function name. If omitted, remove all listeners of that event type'
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
                "scene.removeEventListener(MoGL.propertyChanged);",
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
            '*description':'Fire an event for registered listeners(with additional arguments optionally.',
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
            '*description':'Add an interval function managed by MoGL',
            '*param':[
                'target:[#function] - target listener',
                '?key:[#string] - key for the target listener. If omitted, a random key will be generated'
            ],
            '*return':'[#string] - unique key',
            '*sample':[
                "var loop = function(time){",
                "  console.log('tick');",
                "};",
                "//add and remove with a generated key",
                "var id = MoGL.addInterval(loop);",
                "MoGL.removeInterval(id);",
                "//add and remove with a declared key",
                "MoGL.addInterval(loop, 'test');",
                "MoGL.removeInterval('test');",
                "//add and remove with a function reference",
                "MoGL.addInterval(loop);",
                "MoGL.removeInterval(loop);"
            ],//-->
            name:'addInterval',
            value:addInterval
        })
        .static({//<--
            '*description':'Remove an interval function managed MoGL',
            '*param':'target:[#function] | [#string] - target function or id or function name',
            '*sample':[
                "var loop = function test(time){};",
                "//add with an id",
                "var id = MoGL.addInterval(loop);",
                "//remove with an id",
                "MoGL.removeInterval(id);",
                "//remove with a function reference",
                "MoGL.removeInterval(loop);",
                "//remove with a function name",
                "MoGL.removeInterval('test');"
            ],//-->
            name:'removeInterval',
            value:removeInterval
        })
        .static({//<--
            '*description':'Resume an interval stopped by MoGL.stopInterval().',
            '*param':'?delay:[#number] - optional delay time(secone)',
            '*sample':[
                "MoGL.addInterval(loop);",
                "MoGL.stopInterval();",
                "MoGL.resumeInterval(1);"
            ],//-->
            'name':'resumeInterval',
            value:resumeInterval
        })
        .static({//<--
            '*description':'Stop an interval',
            '*param':'?delay:[#number] - optional delay time(second)',
            '*sample':[
                "MoGL.addInterval(loop);",
                "MoGL.stopInterval(2);"
            ],//-->
            name:'stopInterval',
            value:stopInterval
        })
        .static({//<--
            '*description':[
                'Copy all subclasses of MoGL to a target object',
                '',
                '* default namespace such as "new MoGL.Mesh() is inconvenient "',
                '* after copying classes, it is easier to write the code, for example, the code can be like "new Mesh()"'
            ],
            '*param':'?context:[#object] - object to copy classes. if omitted, a new object will be used',
            '*return':'[#object] - object passed as arguments or new object if omitted',
            '*sample':[
                "//copy to a target object",
                "var $ = MoGL.classes();",
                "var scene = new $.Scene();",
                "",
                "//copy to the global object",
                "MoGL.classes(window);",
                "var scene = new Scene();"
            ],//-->
            name:'classes',
            value:classGet
        })
        .event({//<--
            '*description':[
                '* fired when - an event listener is added or removed',
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
                '* fired when - setting properties is completed',
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
                '* fired when - each animation is repeated',
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
        })
        .build(),
        MoGL.share('listener', listener);
        return MoGL;
    })(),
    (function(){
        var fn = MoGL.prototype;
        fn.error = error,    
        fn.toString = function(){
            return this.uuid;
        },
        fn.save = function(){return {};},
        fn.restore = function(){},
        Object.defineProperty(fn, 'invoker', {get:invoker});
        Object.freeze(fn);
    })();
    return MoGL;
})();