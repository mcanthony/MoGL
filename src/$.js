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
    if (!('requestAnimationFrame' in window)) window.requestAnimationFrame = window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['msRequestAnimationFrame'];
    //ios7,8 - performance.now가 지원되지 않는 경우
    var nowOffset;
    if (!('performance' in window)) window.performance = {};
    if (!('now' in Date)) Date.now = function () {return +new Date();};
    if (!('now' in window.performance)){
        nowOffset = Date.now();
        if (window.performance.timing && window.performance.timing.navigationStart) {
            nowOffset = window.performance.timing.navigationStart;
        }
        window.performance.now = function now(){
            return Date.now() - nowOffset;
        };
    }
})();
//전역에서 사용하는 공통함수
var $setPrivate, $getPrivate, $writable, $readonly, $getter, $setter, $color, $md, $ease,
    GLMAT_EPSILON, SIN, COS, TAN, ATAN, ATAN2, ASIN, SQRT, CEIL, ABS, PI, PIH, PID, D2R, R2D;

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
                v = v.substr(1,3)
                v = '#'+v[0]+v[0]+v[1]+v[1]+v[2]+v[2]
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
TAN = Math.tan, ATAN = Math.atan, ATAN2 = Math.atan2, ASIN = Math.asin,
SQRT = Math.sqrt, CEIL = Math.ceil, ABS = Math.abs, PI = Math.PI, PIH = PI * 0.5, PID = PI * 2, D2R = PI / 180, R2D = 180 / PI;


SIN = (function(){
    var sin = Math.sin, s = {};
    return function(r){
        return s[r] || (s[r] = sin(r));
    };
})(),
COS = (function(){
    var cos = Math.cos, c = {};
    return function(r){
        return c[r] || (c[r] = cos(r));
    };
})(),

//markdown
$md = function(classes){
    var list, val, func, sort, toStr, fieldDetail, methodDetail;
    sort = function(a,b){
        return a.name < b.name;
    },
    list = function(type, md, v){
        var i, j;
        if (v.length) {
            v.sort(sort);
            md[md.length] = '\n**' + type + '**\n';
            for (i = 0, j = v.length; i < j; i++){
                md[md.length] = '* [' + v[i].name + '](#' + v[i].name + ') - ' + v[i].description.split('\n')[0].substr(0, 20).trim() + (v[i].description.length > 20 ? '...' : '');
            }
        }
    },
    toStr = function(v){
        if (Array.isArray(v)) {
            return v.join('\n');
        }else if (!v) {
            return '';
        }
        return v;
    },
    val = function(type, md, ref){
            var v = [], temp = ref._info['_'+type], temp1 = ref['_'+type], k;
            for (k in temp) {
                temp[k].name = k,
                temp[k].type = temp[k].type || '?',
                temp[k].defaultValue = temp[k].defaultValue || 'none', 
                temp[k].sample = toStr(temp[k].sample || '//none'),
                temp[k].description = toStr(temp[k].description),
                temp[k].enumerable = temp1[k] && temp1[k].enumerable ? true : false, 
                temp[k].configurable = temp1[k] && temp1[k].configurable ? true : false;
                temp[k].exception = toStr(temp[k].exception || 'none');
                if (temp1[k]){
                    if ('writable' in temp1[k]) {
                        temp[k].writable = temp1[k].writable ? true : false;
                    } else if ('set' in temp1[k]) {
                        temp[k].writable = true;
                    } else {
                        temp[k].writable = false;
                    }
                };
                v[v.length] = temp[k];
            }
            list(type, md, v);
            return v;
    }
    func = function(type, md, ref){
        var v = [], temp = ref._info['_'+type], temp1 = ref['_'+type], k;
        for (k in temp) {
            temp[k].name = k;
            temp[k].param = toStr(temp[k].param || 'none');
            temp[k].ret = toStr(temp[k].ret || 'none');
            temp[k].sample = toStr(temp[k].sample || '//none');
            temp[k].exception = toStr(temp[k].exception || 'none');
            temp[k].description = toStr(temp[k].description);
            v[v.length] = temp[k];
        }
        list(type, md, v);
        return v;
    },
    fieldDetail = function(type, v, md) {
        var i, j, k, m, n;
        if (v.length) {
            for (i = 0, j = v.length; i < j; i++){
                k = v[i];
                md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="' + k.name + '"></a>';
                md[md.length] = '###' + k.name;
                md[md.length] = '\n_' + type + '_\n';
                md[md.length] = '\n**description**\n';
                md[md.length] = '\n- '+k.description;
                md[md.length] = '\n**setting**\n';
                md[md.length] = '- *writable*:' + k.writable + '\n-  *enumerable*:' + k.enumerable + '\n-  *configurable*:' + k.configurable;
                if ('value' in k) {
                    md[md.length] = '\n**value**\n';
                    md[md.length] = '\n- '+k.value;
                } else if ('defaultValue' in k) {
                    md[md.length] = '\n**defaultValue**\n';
                    md[md.length] = '\n- '+k.defaultValue;
                }
                md[md.length] = '\n**exception**\n';
                md[md.length] = '\n- '+k.exception;
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k.sample;
                md[md.length] = '```';
            }
        }
    },
    methodDetail = function(type, v, md){
        var i, j, k, l, m, n, o;
        if (v.length) {
            for (i = 0, j = v.length; i < j; i++){
                k = v[i];
                md[md.length] = '\n[top](#)';
                md[md.length] = '\n<a name="' + k.name + '"></a>';
                if (k.param != 'none') {
                    o = [];
                    l = k.param.split('\n');
                    for(m = 0, n = l.length; m < n ; m++){
                        if(l[m].charAt(0) != '*' || /[0-9]/.test(l[m].charAt(0))){
                            o.push(l[m].split('-')[0].trim());
                        }
                    }
                    md[md.length] = '###' + k.name + '(' + o.join(', ') + ')';
                } else {
                    md[md.length] = '###' + k.name + '()';
                }
                md[md.length] = '\n_' + type + '_\n';
                md[md.length] = '\n**description**\n';
                md[md.length] = '\n- '+k.description;
                md[md.length] = '\n**param**\n';
                if (k.param != 'none' && n) {
                    for(m = 0; m < n ; m++){
                        if (l[m] = l[m].trim()){
                            if (l[m].charAt(0) == '*' || /[0-9]/.test(l[m].charAt(0))) {
                                md[md.length] = '    ' + l[m];
                            } else {
                                md[md.length] = (m + 1) + '. ' + l[m];
                            }
                        }
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**exception**\n';
                md[md.length] = '\n- '+k.exception;
                md[md.length] = '\n**return**\n';
                md[md.length] = '\n- '+(k.ret.length ? k.ret.replace('this', 'this - 메소드체이닝을 위해 자신을 반환함') : 'none');
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k.sample;
                md[md.length] = '```';
            }
        }
    };
    return function(){
        var md, ref, temp, temp1, i, j, k, l, m, n,
            parents, children, fields, methods, constants, events, statics, inherited;
        ref = classes[this.className].define;
//제목
        md = ['#' + this.className];

//상단리스트영역생성-----------------------
//부모
        if (ref.parent) {
            parents = [];
            temp = ref.parent;
            while (temp) {
                parents[parents.length] = '[' + temp.className + '](' + temp.className + '.md)';
                temp = classes[temp.className].define.parent;
            }
            md[md.length] = '* parent : ' + parents.join(' < ');
        }
//자식
        children = [];
        for (k in classes) {
            if (classes[k].parent == this) {
                children[children.length] = '[' + k + '](' + k + '.md)';
            }
        }
        if (children.length) {
            children.sort(sort);
            md[md.length] = '* children : ' + temp.join(', ');
        }
//생성자
        md[md.length] = '* [constructor](#constructor)\n';
//서브항목        
        fields = val('field', md, ref);
        methods = func('method', md, ref);
        statics = func('static', md, ref);
        constants = val('constant', md, ref);
        events = val('event', md, ref);
//본문------------------------------
        temp = ref._construct;
        md[md.length] = '\n[top](#)';
        md[md.length] = '\n<a name="constructor"></a>';
        md[md.length] = '##Constructor';
        md[md.length] = '\n**description**\n';
        md[md.length] = '- '+toStr(temp.description);
        md[md.length] = '\n**param**\n';
        md[md.length] =  toStr(temp.param || 'none'),
        md[md.length] = '\n**exception**\n';
        md[md.length] = '- '+toStr(temp.exception || 'none');
        md[md.length] = '\n**sample**\n';
        md[md.length] = '```javascript';
        md[md.length] = toStr(temp.sample || '//none');
        md[md.length] = '```';
        fieldDetail('field', fields, md);
        methodDetail('method', methods, md);
        methodDetail('static', statics, md);
        fieldDetail('const', constants, md);
        fieldDetail('event', events, md);
        md[md.length] = '\n[top](#)';
        return md.join('\n');
    };
};