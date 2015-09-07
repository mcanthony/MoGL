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
$readonly = (function(){
    var o = {value:null};
    return function(v){
        o.value = v;
        return o;
    };
})(),
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