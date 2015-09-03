//polyfill
(function(W){
    //function.name for IE11
    if((function test(){}).name !== 'test'){
        Object.defineProperty(Function.prototype, 'name', {
            get:function(){
                var f;
                if(!('___mgname' in this)){
                    f = Function.prototype.toString.call(this),
                    this.___mgname = f.substring(f.indexOf('function') + 8, f.indexOf('(')).trim() || undefined;
                }
                return this.___mgname;
            }
        });
    }
    //requestAnimationFrame
    if (!('requestAnimationFrame' in W)) W.requestAnimationFrame = W['webkitRequestAnimationFrame'] || W['mozRequestAnimationFrame'] || W['msRequestAnimationFrame'];
    //performance.now for ios8
    var nowOffset;
    if (!('performance' in W)) W.performance = {};
    if (!('now' in Date)) Date.now = function () {return +new Date();};
    if (!('now' in W.performance)){
        nowOffset = Date.now();
        if (W.performance.timing && W.performance.timing.navigationStart) {
            nowOffset = W.performance.timing.navigationStart;
        }
        W.performance.now = function now(){
            return Date.now() - nowOffset;
        };
    }
})(this);
//defineProperty helper
var $writable, $readonly, $getter, $setter;
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
};
//math helper
var $color, GLMAT_EPSILON, SIN, COS, TAN, ATAN, ATAN2, ASIN, SQRT, CEIL, ABS, PI, PIH, PID, D2R, R2D;
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
})();