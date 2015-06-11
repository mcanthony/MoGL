(function(){ //webGL은 되지만 지원되지 않는 기능의 polyfill
    var test = function test(){};
    if(!('name' in test) || test.name != 'test'){ //함수에 name속성이 없다면..
        Object.defineProperty( Function.prototype, 'name', {
            get:function(){
                var f;
                if(!('__name' in this)){//캐쉬에서 없다면
                    f = this.toString();//함수를 문자열로 바꿔서 function과 ()사이의 문자열을 이름으로 추출
                    this.__name = f.substring(f.indexOf('function') + 8, f.indexOf('(')).trim() || undefined;
                }
                return this.__name;
            }
        });
    }
    //표준이름의 requestAnimationFrame가 없는 경우
    if (!('requestAnimationFrame' in window)) window.requestAnimationFrame = webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame;
    //ios7,8 - performance.now가 지원되지 않는 경우
    var nowOffset;
    if (!('performance' in window)) window.performance = {};
    if (!('now' in Date)) Date.now = function () {return +new Date();};
    if (!('now' in window.performance)){
        nowOffset = Date.now();
        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart;
        }
        window.performance.now = function now(){
            return Date.now() - nowOffset;
        };
    }
})();
//전역에서 사용하는 공통함수
var $setPrivate, $getPrivate, $writable, $readonly, $value, $getter, $setter, $color, $md, $ease,
    GLMAT_EPSILON, SIN, COS, TAN, ATAN, ATAN2, ASIN, SQRT, CEIL, ABS, PIH, PERPI;

(function() {
    var VAR = {}, value = {};
    $setPrivate = function $setPrivate(cls, v) { //공용private설정
        $readonly.value = v,
        Object.defineProperty(VAR, cls, $readonly);
    },
    $getPrivate = function $getPrivate(cls) { //공용private읽기
        if (arguments.length == 2 ) {
            return VAR[cls][arguments[1]];
        } else {
            return VAR[cls];
        }
    };
})(),
//defineProperty용 헬퍼
$writable = {value:true, writable:true},
$readonly = {value:null},
$value = function(prop, key){
    if (arguments.length == 3) {
        return {
            get:$getter(prop, key, arguments[2]),
            set:$setter(prop, key)
        };
    } else {
        return {
            get:$getter(prop, key),
            set:$setter(prop, key)
        };
    }
},
$getter = function(prop, key){
    var defaultValue = arguments.length == 3 ? arguments[2] : null;
    if (key) {
        return function getter() {
            var p = prop[this];
            return key in p ? p[key] : defaultValue;
        };
    } else {
        return function getter() {
            return this.uuid in prop ? prop[this] : defaultValue;
        };
    }
},
$setter = function(prop, key){
    if (key) {
        return function setter(v) {
            prop[this][key] = v;
        };
    } else {
        return function setter(v) {
            prop[this] = v;
        };
    }
},
$color = (function(){
    var co = [];
    return function(v){
        if (typeof v == 'string' && v.charAt(0) == '#') {
            if (v.length == 4) {
                v += v.substr(1,3)
            }
            co[0] = parseInt(v.substr(1, 2), 16) / 255,
            co[1] = parseInt(v.substr(3, 2), 16) / 255,
            co[2] = parseInt(v.substr(5, 2), 16) / 255;
            if (v.length > 7) {
                co[3] = parseFloat(v.substr(7));
                if (co[3] > 1) co[3] = 1;
            } else {
                co[3] = 1;
            }
        } else if ('r' in v) {
            co[0] = v.r, co[1] = v.g, co[2] = v.b, co[3] = 'a' in v ? v.a : 1;
        } else {
            co[0] = v[0], co[1] = v[1], co[2] = v[2], co[3] = '3' in v ? v[3] : 1;
        }
        return co;
    };
})();
//수학함수
GLMAT_EPSILON = 0.000001,
SIN = Math.sin, COS = Math.cos, TAN = Math.tan, ATAN = Math.atan, ATAN2 = Math.atan2, ASIN = Math.asin,
SQRT = Math.sqrt, CEIL = Math.ceil, ABS = Math.abs, PI = Math.PI, PIH = PI * 0.5, PERPI = 180 / PI;
//markdown
$md = function(classes){
    var param, exception, sample, description, ret, mk, sort;
    exception = function(f){
        var temp, i, j, k;
        f = Function.prototype.toString.call(f);
        temp = [],
        k = 0;
        if (f.substring(8, f.indexOf('(')).trim().indexOf('error') == -1) {
            while ((i = f.indexOf('this.error(', k)) > -1) {
                k = i + 'this.error('.length;
                temp[temp.length] = f.substring(k, f.indexOf(')', k));
            }
        }
        return temp;
    },
    mk = function(keyword, isJoin){
        var len;
        keyword = '/*' + keyword;
        len = keyword.length;
        return function(f){
            var i, space;
            f = Function.prototype.toString.call(f);
            if ((i = f.indexOf(keyword)) > -1) {
                f = f.substring(i + len, f.indexOf('*/', i)).split('\n');
                f.shift(), f.pop();
                space = f[0].match(/^[ ]*/)[0].length;
                i = f.length;
                while (i--) f[i] = f[i].substr(space);
                if(isJoin) f = f.join('\n');
            } else {
                f = '';
            }
            return f;
        };
    };
    sample = mk('sample', 1);
    description = mk('description', 1);
    param = mk('param');
    ret = mk('return');
    sort = function(a,b){
        return a.name < b.name;
    };
    return function(){
        var md = ['#' + this.className], ref, temp, i, j, k, l, m, n,
            parents, constructor, field, method, consts, event, static, inherited;
        ref = classes[this.className];
        //constructor
        temp = Function.prototype.toString.call(ref.construct);
        constructor = {
            description:description(ref.construct, 'Constructor of ' + this.className),
            param:param(ref.construct),
            exception:param(ref.construct),
            sample:sample(ref.construct)
        };
        //method
        method = [],
        temp = ref.proto;
        for (k in temp) {
            method[method.length] = {
                name:k,
                description:description(temp[k], 'Method of ' + this.className),
                param:param(temp[k]),
                exception:exception(temp[k]),
                sample:sample(temp[k]),
                ret:ret(temp[k])
            };
        }
        //field
        if (ref.prop) {
            field = [];
            for (k in ref.prop) {
                if (typeof ref.prop[k].value == 'function') {
                    method[method.length] = {
                        name:k,
                        description:description(ref.prop[k].value, 'Method of ' + this.className),
                        param:param(ref.prop[k].value),
                        exception:exception(ref.prop[k].value),
                        sample:sample(ref.prop[k].value)
                    };
                } else {
                    field[field.length] = {
                        name:k,
                        writable:ref.prop[k].writable || ref.prop[k].set ? true : false, 
                        enumerable:ref.prop[k].enumerable ? true : false, 
                        configurable:ref.prop[k].configurable ? true : false,
                        defaultValue:'defaultValue' in ref.prop[k] ? ref.prop[k].defaultValue : 'value'  in ref.prop[k] ? ref.prop[k].value : 'none', 
                        description:ref.prop[k].description || 'Field of ' + this.className,
                        sample:ref.prop[k].sample || ''
                    };
                }
            }
            
        }
        //static
        static = [], 
        consts = [], 
        temp = ref.cls;
        for (k in temp) {
            if (typeof temp[k] == 'function') {
                static[static.length] = {
                    name:k,
                    description:description(temp[k], 'Static Method of ' + this.className),
                    param:param(temp[k]),
                    exception:exception(temp[k]),
                    sample:sample(temp[k]),
                    ret:ret(temp[k])
                }
            } else if(k.substr(0, 2) != '__') {
                consts[consts.length] = {
                    name:k,
                    description:'Const of ' + this.className,
                    value:temp[k]
                }
                    
            }
        }
        //parent
        if (ref.parent) {
            parents = [];
            temp = ref.parent;
            while (temp) {
                parents[parents.length] = '[' + temp.className + '](' + temp.className + '.md)';
                temp = classes[temp.className].parent;
            }
            md[md.length] = '* parent : ' + parents.join(' < ');
        }
        
        //children
        temp = [];
        for (k in classes) {
            if (classes[k].parent == this) {
                temp[temp.length] = '[' + k + '](' + k + '.md)';
            }
        }
        if (temp.length) {
            temp.sort(sort);
            md[md.length] = '* children : ' + temp.join(', ');
        }
        md[md.length] = '* [constructor](#constructor)\n';
        if (field.length) {
            field.sort(sort);
            md[md.length] = '\n**field**\n';
            for (i = 0, j = field.length; i < j; i++){
                md[md.length] = '* [' + field[i].name + '](#' + field[i].name + ')';
            }
        }
        if (method.length) {
            method.sort(sort);
            md[md.length] = '\n**method**\n';
            for (i = 0, j = method.length; i < j; i++){
                md[md.length] = '* [' + method[i].name + '](#' + method[i].name + ')';
            }
        }
        if (consts.length) {
            consts.sort(sort);
            md[md.length] = '\n**const**\n';
            for (i = 0, j = consts.length; i < j; i++){
                md[md.length] = '* [' + this.className + '.' + consts[i].name + '](#' + this.className + '.' +consts[i].name + ')';
            }
        }
        if (static.length) {
            static.sort(function(a,b){
                return a.name < b.name;
            }),
            md[md.length] = '\n**static**\n';
            for (i = 0, j = static.length; i < j; i++){
                md[md.length] = '* [' + this.className + '.' + static[i].name + '](#' + this.className + '.' +static[i].name + ')';
            }
        }
        md[md.length] = '\n[top](#)';
        md[md.length] = '\n[constructor]:constructor';
        md[md.length] = '##Constructor';
        md[md.length] = '\n**description**\n';
        md[md.length] = constructor.description;
        md[md.length] = '\n**param**\n';
        md[md.length] = constructor.param.length ? '* ' + constructor.param.join('\n* ') : 'none';
        md[md.length] = '\n**exception**\n';
        md[md.length] = constructor.exception.length ? '* ' + constructor.exception.join('\n* ') : 'none';
        md[md.length] = '\n**sample**\n';
        md[md.length] = '```javascript';
        md[md.length] = constructor.sample;
        md[md.length] = '```';
     
        if (field.length) {
            for (i = 0, j = field.length; i < j; i++){
                k = field[i];
                md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="'+k.name + '"></a>';
                md[md.length] = '##'+k.name;
                md[md.length] = '\n**description**\n';
                md[md.length] = k.description;
                md[md.length] = '\n**setting**\n';
                md[md.length] = '*writable*:' + k.writable + ', *enumerable*:' + k.enumerable + ', *configurable*:' + k.configurable;
                md[md.length] = '\n**defaultValue**\n';
                md[md.length] = k.defaultValue;
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k.sample;
                md[md.length] = '```';
            }
        }
        if (method.length) {
            for (i = 0, j = method.length; i < j; i++){
                k = method[i];
                md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="'+k.name + '"></a>';
                l = [];
                if (k.param) {
                    for(m = 0, n = k.param.length; m < n ; m++){
                        l[l.length] = k.param[m].split('-')[0].trim();
                    }
                }
                md[md.length] = '##'+k.name + '(' + l.join(', ') + ')';
                md[md.length] = '\n**description**\n';
                md[md.length] = k.description;
                md[md.length] = '\n**param**\n';
                if (k.param) {
                    for(m = 0, n = k.param.length; m < n ; m++){
                        md[md.length] = (m + 1) + '. ' + k.param[m];
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**exception**\n';
                if (k.exception.length){
                    for(m = 0, n = k.exception.length; m < n ; m++){
                        md[md.length] = this.className + '.' + k.name + ':' + k.param[m];
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**return**\n';
                md[md.length] = k.ret.length ? k.ret.join('\n').replace('this', 'this - 메소드체이닝을 위해 자신을 반환함') : 'none';
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k.sample;
                md[md.length] = '```';
            }
        }
        if (consts.length) {
            for (i = 0, j = consts.length; i < j; i++){
                k = consts[i];
                 md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="'+this.className+'.'+k.name + '"></a>';
                md[md.length] = '##'+this.className+'.'+k.name;
                md[md.length] = '\n**description**\n';
                md[md.length] = k.description;
                md[md.length] = '\n**value**\n';
                md[md.length] = k.value;
            }
        }
        if (static.length) {
            for (i = 0, j = static.length; i < j; i++){
                k = static[i];
                md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="'+this.className+'.'+k.name + '"></a>';
                l = [];
                if (k.param) {
                    for(m = 0, n = k.param.length; m < n ; m++){
                        l[l.length] = k.param[m].split('-')[0].trim();
                    }
                }
                md[md.length] = '##'+this.className+'.'+k.name + '(' + l.join(', ') + ')';
                md[md.length] = '\n**description**\n';
                md[md.length] = k.description;
                md[md.length] = '\n**param**\n';
                if (k.param) {
                    for(m = 0, n = k.param.length; m < n ; m++){
                        md[md.length] = (m + 1) + '. ' + k.param[m];
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**exception**\n';
                if (k.exception.length){
                    for(m = 0, n = k.exception.length; m < n ; m++){
                        md[md.length] = this.className + '.' + k.name + ':' + k.param[m];
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**return**\n';
                md[md.length] = k.ret.length ? k.ret.join('\n').replace('this', 'this - 메소드체이닝을 위해 자신을 반환함') : 'none';
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k.sample;
                md[md.length] = '```';
            }
        }
        return md.join('\n');
    };
},
Object.freeze($ease = {
    linear:function(a,c,b){return b*a+c},
    backIn:function(a,c,b){return b*a*a*(2.70158*a-1.70158)+c},
    backOut:function(a,c,b){a-=1;return b*(a*a*(2.70158*a+1.70158)+1)+c},
    backInOut:bio = function(a,c,b){a*=2;if(1>a)return 0.5*b*a*a*(3.5949095*a-2.5949095)+c;a-=2;return 0.5*b*(a*a*(3.70158*a+2.70158)+2)+c},
    bounceOut:function(a,c,b){if(0.363636>a)return 7.5625*b*a*a+c;if(0.727272>a)return a-=0.545454,b*(7.5625*a*a+0.75)+c;if(0.90909>a)return a-=0.818181,b*(7.5625*a*a+0.9375)+c;a-=0.95454;return b*(7.5625*a*a+0.984375)+c},
    sineIn:function(a,c,b){return -b*Math.cos(a*PIH)+b+c},
    sineOut:function(a,c,b){return b*Math.sin(a*PIH)+c},
    sineInOut:function(a,c,b){return 0.5*-b*(Math.cos(PI*a)-1)+c},
    circleIn:function(a,c,b){return -b*(Math.sqrt(1-a*a)-1)+c},
    circleOut:function(a,c,b){a-=1;return b*Math.sqrt(1-a*a)+c},
    circleInOut:function(a,c,b){a*=2;if(1>a)return 0.5*-b*(Math.sqrt(1-a*a)-1)+c;a-=2;return 0.5*b*(Math.sqrt(1-a*a)+1)+c},
    quadraticIn:function(a,c,b){return b*a*a+c},
    quadraticOut:function(a,c,b){return -b*a*(a-2)+c}
});