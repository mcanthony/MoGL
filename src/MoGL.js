var MoGL = (function() {
    'use strict';
    var Definer, build, func, keys, val, param, checker,
        MoGL, idProp, destroy, classGet, totalCount, error;
    checker = {};
    param = function(v){
        var i;
        v = Function.prototype.toString.call(v),
        v = v.substring(v.indexOf('(')+1, v.indexOf(')')).trim().split(','),
        i = v.length;
        if (i) {
            while (i--) v[i] = v[i].trim();
            return v;
        }
    },
    Definer = function(k, v, parent, check){
        var p, i;
        if (check !== checker) throw new Error('Definer는 extend를 통해서만 사용할 수 있습니다');
        this.parent = parent;
        if (typeof v == 'function') {
            this._construct = {
                name:k,
                description:'Constructor of ' + k,
                param:param(v),
                value:v
            };
        } else {
            this._construct = {
                name:k,
                description:v.description,
                param:v.param,
                ret:v.ret,
                sample:v.sample,
                value:v.value
            };
        }
        this._info = {_method:{},_static:{},_field:{},_constant:{},_event:{}},
        this._method = {},
        this._static = {},
        this._field = {},
        this._constant = {},
        this._event = {},
        Object.freeze(this);
    },
    build = (function(){
        var wrap, method, prev, methodSet, fieldSet, readonly, writable, isFactory, isSuperChain,
            inheritedStatic, md,
            uuid, allInstance, ids, counter, total, classes;
        uuid = 0,
        allInstance = {},
        ids = {},
        total = 0, //생성된 인스턴스의 갯수를 관리함
        counter = {}, //클래스별로 관리
        classes = {},
        
        isFactory = {factory:1},//팩토리 함수용 식별상수
        isSuperChain = {superChain:1},//생성자체인용 상수
        readonly = {}, writable = {writable:true},
        prev = [], //스택구조의 이전 함수이름의 배열
        md = {
            description:'해당 클래스를 마크다운 형식으로 문서화하여 출력함',
            ret:'string - 클래스에 대한 문서 마크다운'
        };
        if ($md) {
            md.value = $md(classes);
        } else {
            md.value = function(){return '';};
        }
        inheritedStatic = {
            extend:{
                param:[
                    'className:string - 자식클래스의 이름',
                    'constructor:function - 자식클래스의 생성자'
                ],
                description:[
                    '이 클래스를 상속하는 자식클래스를 만들 수 있는 정의자(Definer)를 얻음',
                    '\n**Definer class의 메소드**\n',
                    '* 각 메서드는 체이닝됨',
                    "* Matrix = MoGL.extend('Matrix', function(){..}).static(..).field(..).build(); 형태로 사용",
                    "* field('x',{value:30}) - 속성을 정의함",
                    "* method('rotate',{value:function(){}}) - 메서드를 정의함",
                    "* constant('normalX',{value:'normalX'}) - 상수를 정의함",
                    "* event('updated',{value:'updated'}) - 이벤트를 정의함",
                    "* static('toString',{value:function(){}}) - 정적메서드를 정의함",
                    "* build() - 입력된 결과를 종합하여 클래스를 생성함"
                ],
                ret:'Definer - 클래스를 정의할 수 있는 생성전용객체',
                sample:[
                    "var classA = MoGL.extend('classA', function(){}).build();"
                ],
                value:function extend(k) {
                    var v;
                    if(arguments.length == 1) {
                        v = k, k = k.name;
                    } else {
                        v = arguments[1];
                    }
                    return new Definer(k, v, this, checker);
                }
            },
            getInstance:{
                param:'uuid:string - 얻고 싶은 인스턴스의 uuid 또는 id',
                description:'uuid 또는 id를 기반으로 인스턴스를 얻어냄',
                ret:'Object - 해당되는 인스턴스',
                sample:[
                    "var instance = Mesh.getInstance(uuid);"
                ],
                value:function getInstance(v) {
                    var inst, p, k;
                    if (v in allInstance) {
                        inst = allInstance[v];
                        if (inst.classId == this.uuid) {
                            return inst;
                        }
                    } else {
                        p = ids[this.uuid];
                        for (k in p) {
                            if (p[k] == v) return allInstance[k];
                        }
                    }
                    this.error('getInstance', 0/*해당되는 인스턴스가 없음*/);
                }
            },
            count:{
                description:'이 클래스로 부터 만들어져 활성화된 인스턴스의 수',
                ret:'int - 활성화된 인스턴스의 수',
                sample:[
                    "var meshCount = Mesh.count();"
                ],
                value:function count() {
                    return counter[this.uuid];
                }
            },
            error:{
                description:'정적함수에서 표준화된 예외를 처리함(정적함수 내부에서 사용)',
                param:[
                    'method:string - 예외가 발생한 함수명',
                    'id:int - 예외고유 id'
                ],
                sample:[
                    "var classA = MoGL.extend('classA', function(){})",
                    "    .static('test', function(){",
                    "	     this.error('test', 0);",
                    "    })",
                    "    .build();"
                ],
                value:function error(method, id) {
                    throw new Error(this.className + '.' + method + ':' + id);
                }
            },
            getMD:md
        },
        wrap = function wrap(key, f) {//생성할 이름과 메서드
            return function() {
                var result;
                if (!this.isAlive) throw new Error('Destroyed Object:' + this);//비활성객체 배제
                prev[prev.length] = method,//에러가 발생한 메소드이름을 스택으로 관리
                method = key,//현재 에러가 난 메소드명
                result = f.apply(this, arguments),//메소드실행
                method = prev.pop();//스택을 되돌림
                return result;
            };
        },
        methodSet = function(target, prop, unwrap){
            var k, v;
            for (k in prop) {
                if (prop.hasOwnProperty(k)) {
                    v = prop[k];
                    if (!unwrap) {
                        v.value = wrap(k, v.value),
                        Object.defineProperty(target, k, v);
                    } else {
                        target[k] = v.value;
                    }
                }
            }
        },
        fieldSet = function(target, prop, unwrap){
            var k, v;
            for (k in prop) {
                if (prop.hasOwnProperty(k)) {
                    v = prop[k];
                    if(!unwrap) {
                        if (v.get) v.get = wrap(k + 'Get', v.get);
                        if (v.set) v.set = wrap(k + 'Set', v.set);
                    }
                    Object.defineProperty(target, k, v);
                }
            }
        },
        idProp = {
            description:'사용자가 임의로 정의한 id',
            type:'string',
            defaultValue:'null', 
            sample: [
                "var scene = new Scene();",
                "scene.id = 'test1';",
                "console.log( scene.id ); //'test1'"
            ],
            get:function idGet() {
                if (ids[this.classId] && this.uuid in ids[this.classId]) {//클래스별 id저장소에서 가져옴
                    return ids[this.classId][this];
                }
                return null;//없으면 null
            },
            set:function idSet(v) {
                if (!ids[this.classId]){//클래스별 저장소가 없으면 생성
                    ids[this.classId] = {ref:{}};//역참조 ref는 중복확인용
                } else if(v in ids[this.classId].ref){//역참조에 이미 존재하는 아이디면 예외
                     throw new Error(this.className + '.idSetter:0');
                }
                if(v === null && this.uuid in ids[this.classId]){//기존id가 있는데 null온 경우 삭제
                    v = ids[this.classId][this],
                    delete ids[this.classId][this],
                    delete ids[this.classId].ref[v];
                }else{ //정상인 경우는 정의함
                    ids[this.classId][this] = v;
                    ids[this.classId].ref[v] = this.uuid;
                }
            }
        },
        destroy = function destroy() {
            var key;
            for (key in this) {
                if (this.hasOwnProperty(key)) this[key] = null;
            }
            if(ids[this.classId] && this.uuid in ids[this.classId]){//id파괴
                key = ids[this.classId][this],
                delete ids[this.classId][this],
                delete ids[this.classId].ref[key];
            }
            delete allInstance[this],
            this.isAlive = false,//비활성화
            counter[this.classId]--,//클래스별인스턴스감소
            total--;//전체인스턴스감소
        },
        classGet = function classGet(context) {
            var k;
            if (!context) context = {};
            for (k in classes) {
                if (classes.hasOwnProperty(k)) context[k] = classes[k].cls;
            }
            return context;
        },
        totalCount = function totalCount() {
            return total;
        },
        error = function error(id) {
            throw new Error(this.className + '.' + method + ':' + id);
        },
        MoGL = function MoGL() {
            readonly.value = 'uuid:' + (uuid++),
            Object.defineProperty(this, 'uuid', readonly), //객체고유아이디
            allInstance[this] = this,
            writable.value = true,
            Object.defineProperty(this, 'isAlive', writable),//활성화상태초기화 true
            counter[this.classId]++, //클래스별 인스턴스 수 증가
            total++; //전체 인스턴스 수 증가
        };
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
            classes[this._construct.value.name] = {cls:cls, define:this};

            if (parent) {
                fn = Object.create(parent.prototype);
            } else {
                fn = cls.prototype;
            }

            readonly.value = cls.uuid = 'uuid:' + (uuid++),
            Object.defineProperty(fn, 'classId', readonly);
            
            readonly.value = cls.className = this._construct.value.name,
            Object.defineProperty(fn, 'className', readonly);
            
            if(!(cls.uuid in counter)) counter[cls.uuid] = 0;

            for (k in inheritedStatic) {

                this.static(k, inheritedStatic[k]);
            }
            
            fieldSet(fn, this._field),
            methodSet(fn, this._method),
            fieldSet(cls, this._constant, true),
            fieldSet(cls, this._event, true),
            methodSet(cls, this._static, true),
            cls.prototype = fn,
            Object.freeze(cls);
            if (parent) Object.freeze(fn);
            return cls;
        };
    })(),
    func = function(type){
        return {value:function(k, v, isdoc){
            if (typeof v == 'function') {
                if (!isdoc) this[type][k] = {value:v},
                this._info[type][k] = {
                    description:(type == '_static' ? 'Static method' : 'Method') + ' of ' + this._construct.value.name,
                    param:param(v),
                    ret:'?'
                };
            } else {
                if (!isdoc) {
                    this[type][k] = {value:v.value};
                }
                this._info[type][k] = {
                    description:v.description,
                    param:v.param || (!isdoc ? param(v.value) : ''),
                    ret:v.ret,
                    sample:v.sample,
                    exception: v.exception
                };
            }
            return this;
        }};
    },
    keys = 'configurable,enumerable,writable,get,set,value'.split(','),
    val = function(type){
        return {value:function(k, v, isdoc){
            var p, i;
            if (!v || typeof v !== 'object') {
                if (v === undefined) {
                    p = {},
                    this[type][k] = {
                        get:function(){return p[this.uuid];},
                        set:function(v){p[this.uuid] = v;}
                    };
                } else {
                    this[type][k] = {value:k};
                }
                this._info[type][k] = {
                    description:(type == '_constant' ? 'Const' : type == '_event' ? 'Event' : 'Field') + ' of ' + this._construct.value.name
                };
            } else {
                if (!isdoc) {
                    this[type][k] = p = {},
                    i = keys.length;
                    while (i--) {
                        if (keys[i] in v) {
                            p[keys[i]] = v[keys[i]];
                        }
                    }
                }
                this._info[type][k] = {
                    type:v.type,
                    description:v.description || (type == '_constant' ? 'Const' : type == '_event' ? 'Event' : 'Field') + ' of ' + this._construct.value.name,
                    defaultValue:v.defaultValue,
                    sample:v.sample,
                    exception: v.exception
                };
            }
            if (!isdoc && 'value' in this[type][k]) this._info[type][k].value = this[type][k].value;
            return this;
        }};
    },
    Object.defineProperties(Definer.prototype, {
        method:func('_method'),
        static:func('_static'),
        field:val('_field'),
        constant:val('_constant'),
        event:val('_event'),
        build:{value:build}
    });
    Object.freeze(Definer),
    Object.freeze(Definer.prototype);
    MoGL = (function(){
        var init, updated, listener, listenerCounter;
        listener = {},
		listenerCounter = {},
        updated = {},
        init = new Definer('MoGL', {
            description:[
                'MoGL 라이브러리의 모든 클래스는 MoGL을 상속함',
                '* 보통 직접적으로 MoGL 클래스를 사용하는 경우는 없음'
            ],
            sample:"var instance = new MoGL();",
            value:MoGL
        }, null, checker)
        .field('id', idProp)
        .field('isUpdated', {
            description:[
                '현재 인스턴스의 업데이트여부를 관리하는 플래그',
                '* 상태가 바뀌면 MoGL.updated 이벤트가 발생함'
            ],
            type:'boolean',
            defaultValue:'false',
            sample: [
                "var scene = new Scene();",
                "scene.addEventListener( 'updated', function(v){",
                "  console.log(v); //2. 리스너가 발동함 - true",
                "} );",
                "console.log( scene.isUpdated ); //false",
                "scene.isUpdated = true; //1. 값을 바꾸면",
            ],
            get:function isUpdatedGet() {
                return updated[this] || false;
            },
            set:function isUpdatedSet(v) {
                this.dispatch( 'updated', updated[this] = v );//set과 동시에 디스패치
            }
        })
        .field('uuid', {
            description:'현재 인스턴스의 고유한 uuid',
            type:'string',
            sample: [
                "var scene = new Scene();",
                "console.log(scene.uuid); // 'uuid:24'"
            ]
        }, true)
        .field('className', {
            description:'인스턴스의 클래스이름',
            type:'string',
            sample: [
                "var scene = new Scene();",
                "console.log(scene.className); // 'Scene'"
            ]
        }, true)
        .field('classId', {
            description:'인스턴스의 클래스uuid',
            type:'string',
            sample: [
                "var scene = new Scene();",
                "console.log(scene.classId); // 'uuid:22'"
            ]
        }, true)
        .method('error', {
            param:'id:int - 예외의 고유 식별번호',
            description:[
                'MoGL 표준 예외처리를 함',
                "주어진 인자에 따라 className + '.' + methodName + ':' + id 형태로 예외메세지가 출력됨",
                '클래스의 메서드 내에서 사용함'
            ],
            ret:'Object - 인자로보낸 context 또는 생략시 임의로 생성된 오브젝트',
            sample:[
                "fn.action = function(a){",
                "  if(!a) this.error(0);",
                "};"
            ],
        }, true)
        .method('toString', {
            description:"MoGL을 상속하는 모든 인스턴스는 toString상황에서 'uuid:고유번호' 형태의 문자열을 반환함",
            ret:"string - this.uuid에 해당되는 'uuid:고유번호' 형태의 문자열",
            sample:[
                "var mat = new Matrix();",
                "console.log( mat + '' ); // 'uuid:22'"
            ],
        }, true)
        .method('destroy', {
            description:'해당 event의 리스너들에게 이벤트를 통지함. 추가인자를 기술하면 그 인자도 전달됨',
            sample:[
                "var city1 = Scene();",
                "city1.destroy();"
            ],
            value:destroy
        })
        .method('setId', {
            param:'id:string - 설정할 id값. null로 설정시 삭제됨',
            description:'id는 본래 속성값이나 메서드체이닝목적으로 사용하는 경우 setId를 쓰면 편리함',
            ret:'this',
            sample:"var city1 = Scene().setId('city1');",
            value:function setId(v) {
                this.id = v;
                return this;
            }
        })
        .method('setProperties', {
            param:'vo:Object - 키,값 쌍으로 되어있는 설정용 객체(delay time ease repeat yoyo 등의 상수키를 포함할 수 있음)',
            description:[
               'vo로 넘어온 속성을 일시에 설정함',
                '* vo에 MoGL.time이 포함되면 애니메이션으로 간주하여 보간애니메이션으로 처리됨'
            ],
            ret:'this',
            sample:[
                "var mat = Matrix();",
                "//즉시반영",
                "mat.setProperties( {x:10, y:20, z:30} );",
                "",
                "//보간애니메이션실행",
                "var vo = {x:0, y:0, z:0};",
                "var ani = {time:1, delay:2, repeat:1, ease:MoGL.easing.sineOut};",
                "mat.setProperties( vo, ani );"
            ],
            value:(function(){
                var loopstart, loop, target, aid = 0;
                loop = function loop(t){
                    var k0, k1, ani, inst, prop, init, rate;
                    for (k0 in target) {
                        ani = target[k0];
                        if (t > ani.start) {//딜레이대기체크
                            inst = ani.target,
                            init = ani.init,
                            prop = ani.prop;
                            if (t > ani.end) {//완료상황
                                if (ani.repeat > 1) {//반복체크
                                    ani.repeat--,
                                    ani.start = t,
                                    ani.end = t + ani.term;
                                    if (ani.yoyo) {//요요체크
                                        ani.init = prop,
                                        ani.prop = init;
                                    }
                                } else {//완전히 종료
                                    for(k1 in prop){
                                        inst[k1] = prop[k1];
                                    }
                                    delete target[k0];
                                    inst.dispatch(MoGL.propertyChanged);
                                }
                            } else {//진행중
                                var ease = ani.ease,
                                rate = (t - ani.start) / ani.term;
                                for(k1 in prop){
                                    inst[k1] = ease(rate, init[k1], prop[k1] - init[k1]);
                                }
                            }
                        }
                    }
                    requestAnimationFrame(loop);
                },
                target = {};
                return function setProperties(v, opt) {
                    var k, ani, start, end, term;
                    if (opt) {
                        target[aid++] = ani = {
                            ease:opt.ease || ($ease ? $ease.linear : function(){}),
                            repeat:opt.repeat || 0,
                            yoyo:opt.yoyo || false,
                            target:this,
                            prop:v,
                            init:{},
                            start:performance.now() + ('delay' in opt ? opt.delay * 1000 : 0),
                            term:opt.time * 1000
                        };
                        ani.end = ani.start + ani.term;
                        for (k in v) ani.init[k] = this[k];
                        if (!loopstart) {
                            loopstart = true;
                            requestAnimationFrame(loop);
                        }
                    } else {
                        for (k in v) this[k] = v[k];
                        this.dispatch(MoGL.propertyChanged);
                    }
                };
            })()
        })
        .method('addEventListener', {//이벤트시스템
            param:[
                'event:string - 이벤트타입',
                'listener:function - 등록할 리스너',
                '?context:* - this에 매핑될 컨텍스트(false무시)',
                '?...arg - 추가적인 인자(dispatch시점의 인자 뒤에 붙음)'
            ],
            description:'해당 이벤트에 리스너를 추가함',
            ret:'this',
            sample:[
                "var city1 = Scene();",
                "city1.addEventListener( 'updated', function(v){",
                "  console.log(v);",
                "});",
                "var city2 = Scene();",
                "city1.addEventListener( 'updated', function(v, added){",
                "  console.log(this == city2);",
                "  console.log(added == 10);",
                "}, city2, 10);"
            ],
            value:function addEventListener(ev, f) {
                var target, cnt;
                if (!listener[this]) {
					listener[this] = {};//private저장소에 this용 공간 초기화
					listenerCounter[this] = {};
				}
                target = listener[this];
                if (!target[ev]) target[ev] = [];//해당 이벤트용 공간 초기화
                target = target[ev],
                target[target.length] = {
                    f:f, 
                    cx:arguments[2] || this, 
                    arg:arguments.length > 3 ? Array.prototype.slice.call(arguments, 3) : null
                },
				cnt = listenerCounter[this],
				this.dispatch('eventChanged', ev, cnt[ev] = target.length, cnt);
                return this;
            }
        })
        .method('removeEventListener', {
            param:[
                'event:string - 이벤트타입',
                '?listener:string or function - 삭제할 리스너. string인 경우는 함수의 이름으로 탐색하고 생략시 해당 이벤트리스너전부를 제거함'
            ],
            description:'해당 이벤트에 리스너를 제거함',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "scene.removeEventListener(MoGL.updated, listener);"
            ],
            value:function removeEventListener(ev, f) {
                var target, cnt, i;
				cnt = listenerCounter[this];
                if( f ){
                    if (listener[this] && listener[this][ev]) {
                        target = listener[this][ev],
                        i = target.length;//해당이벤트의 리스너를 루프돌며 삭제
                        while (i--) {
                            if ((typeof f == 'string' && target[i].f.name == f) || target[i].f === f) {//삭제하려는 값이 문자열인 경우 리스너이름에 매칭, 함수인 경우는 리스너와 직접 매칭
                                target.splice(i, 1)
                            }
                        }
						cnt[ev] = target.length;
                    }
                }else{
                    if (listener[this] && listener[this][ev]) {
						delete listener[this][ev]; //전체를 삭제
						cnt[ev] = 0;
					}
                }
				this.dispatch('eventChanged', ev, cnt[ev], cnt);
                return this;
            }
        })
        .method('dispatch', {
            param:[
                'event:string - 이벤트타입',
                '?...arg - 추가적으로 보낼 인자'
            ],
            description:'해당 event의 리스너들에게 이벤트를 통지함. 추가인자를 기술하면 그 인자도 전달됨',
            ret:'this',
            sample:[
                "var scene = new Scene();",
                "city1.dispatch( 'updated', city.isUpdated );"
            ],
            value:function dispatch(ev) {
                var target, arg, i, j, k, l;
                if (listener[this] && listener[this][ev]) {
                    if(arguments.length > 1) arg = Array.prototype.slice.call(arguments, 1);//만약 추가로 보낸 인자가 있다면 리스너에게 apply해줌.
                    for (target = listener[this][ev], i = 0, j = target.length ; i < j ; i++) {
                        k = target[i];
                        if (arg) {
                            if (k.arg) {
                                k.f.apply(k.cx, arg.concat(k.arg));
                            } else{
                                k.f.apply(k.cx, arg);
                            }
                        } else {
                            if (k.arg) {
                                k.f.apply(k.cx, k.arg);
                            } else{
                                k.f.call(k.cx);
                            }
                        }
                    }
                }
                return this;
            }
        })
        .static('classes', {
            param:'context:Object - 클래스를 복사할 객체. 생략시 빈 오브젝트가 생성됨',
            description:[
                'MoGL로 생성된 모든 서브클래스를 해당 객체에 키로 복사함',
                '* new MoGL.Mesh 등의 코드가 길고 귀찮은 경우 임의의 네임스페이스나 window에 복사하는 기능'
            ],
            ret:'Object - 인자로보낸 context 또는 생략시 임의로 생성된 오브젝트',
            sample:[
                "//특정객체로 복사",
                "var $ = MoGL.classes();",
                "var scene = new $.Scene();",
                "",
                "//전역에 복사",
                "MoGL.classes(window);",
                "var scene = new Scene();"
            ],
            value:classGet
        })
        .static('totalCount', {
            description:'전체 인스턴스의 수를 반환함',
            ret:'int - 활성화된 인스턴스의 수',
            sample:"console.log( MoGL.count() );",
            value:totalCount
        })
		.event('eventChanged', {
            description:[
                '이벤트리스너가 추가, 삭제되면 발생함',
                '* 리스너 형식 - function(changedEvent, changedEventListenerCount, allEventListenerCount)'
            ],
            type:'string',
            sample: [
                "var scene = new Scene();",
                "scene.addEventListener( MoGL.eventChanged, function(ev, cnt, allCnt){",
                "  console.log(ev, cnt, allCnt);// - 'updated, 1, {updated:1, eventChanged:1}",
                "} );",
				"scene.addEventListener( MoGL.updated, function(){} ); //1"
            ],
            value:'eventChanged'
        })
        .event('updated', {
            description:[
                'isUpdated 속성이 변경될 때마다 발생함',
                '* 리스너에는 첫 번째 인자로 현재의 isUpdated상태가 주어짐'
            ],
            type:'string',
            sample: [
                "var scene = new Scene();",
                "scene.addEventListener( MoGL.updated, function(v){",
                "  console.log(v);",
                "} );"
            ],
            value:'updated'
        })
        .event('propertyChanged', {
            description:[
                'setProperties 호출시 설정이 완료되면 발생함',
                '* 애니메이션인 경우는 애니메이션 완료 후 발생',
                '* 리스너에 주어지는 인자는 없음',
            ],
            type:'string',
            sample: [
                "var mat = new Matrix();",
                "mat.addEventListener( MoGL.propertyChanged, function(){",
                "  console.log('changed');",
                "} );",
                "mat.setProperties({x:50}, {time:1});"
            ],
            value:'propertyChanged'
        })
        .constant('ease', {
            description:(function(){
                var i, v = [
                    'setProperties의 애니메이션에 사용될 보간함수',
                    '다음과 같은 값이 올 수 있음'
                ];
                for (i in $ease) {
                    v[v.length] = '* MoGL.ease.' + i;
                }
                return v;
            })(),
            type:'function',
            sample: [
                "var mat = new Matrix();",
                "mat.setProperties({x:50}, {time:1, ease:MoGL.ease.sineOut});"
            ],
            value:$ease
        });
        return init.build();
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