/**
 * Created by redcamel on 2015-05-22.
 */
var OrbitController = (function () {
    'use strict';
    var HD_down, HD_move, HD_up,HD_downTouch, HD_moveTouch, HD_upTouch,
        self;
    HD_down = function HD_down(e) {
        self._mouseInfo.downed = 1,
        self._mouseInfo.startX0 = e.screenX,
        self._mouseInfo.startY0 = e.screenY,
        self._mouseInfo.dx = 0,
        self._mouseInfo.dy = 0;
        e.preventDefault();
    },
    HD_move = function HD_move(e) {
        if (self._mouseInfo.downed) {
            self._mouseInfo.dx = self._mouseInfo.startX0 - e.screenX,
            self._mouseInfo.dy = self._mouseInfo.startY0 - e.screenY;
        }
        self._mouseInfo.startX0 = e.screenX,
        self._mouseInfo.startY0 = e.screenY;
        e.preventDefault();
    },
    HD_up = function HD_up(e) {
        self._mouseInfo.downed = 0,
        e.preventDefault();
    },
    HD_downTouch = function HD_downTouch(e) {
        self._mouseInfo.downed = true;
        if(e.touches.length == 2) {
            self._mouseInfo.zoom = true;
            self._mouseInfo.distStart = Math.sqrt((e.touches[0].screenX - e.touches[1].screenX) * (e.touches[0].screenX - e.touches[1].screenX) + (e.touches[0].screenY - e.touches[1].screenY) * (e.touches[0].screenY - e.touches[1].screenY));
        }else{
            self._mouseInfo.startX0 = e.touches[0].screenX,
            self._mouseInfo.startY0 = e.touches[0].screenY;
        }
        self._mouseInfo.dx = 0,
        self._mouseInfo.dy = 0,
        e.preventDefault();
    },
    HD_moveTouch = function HD_moveTouch(e) {
        if (self._mouseInfo.downed) {
            if(self._mouseInfo.zoom){
                self._mouseInfo.dist = Math.sqrt((e.touches[0].screenX - e.touches[1].screenX) * (e.touches[0].screenX - e.touches[1].screenX) + (e.touches[0].screenY - e.touches[1].screenY) * (e.touches[0].screenY - e.touches[1].screenY));
            }else{
                self._mouseInfo.dx = self._mouseInfo.startX0 - e.touches[0].screenX,
                self._mouseInfo.dy = self._mouseInfo.startY0 - e.touches[0].screenY;
            }
        }
        self._mouseInfo.startX0 = e.touches[0].screenX,
        self._mouseInfo.startY0 = e.touches[0].screenY;
        e.preventDefault();
    },
    HD_upTouch = function HD_upTouch(e) {
        self._mouseInfo.downed = false;
        self._mouseInfo.zoom = false;
        e.preventDefault();
    };
    return MoGL.extend(function OrbitController(camera) {
        if(!(camera instanceof Camera)) this.error(0);
        this._camera = camera,
        this._camera.x = 0.1,
        this._camera.y = 0.1,
        this._camera.z = 0.1,
        this._speed = 500,
        this._smoothDelay = 0.1,
        this._distance = 50,
        this._minDistance = 50,
        this._maxDistance = 200,
        this._desirePosition=this._camera.position,
        this._pan = 0.01,
        this._tilt = 0.01,
        this._mouseInfo = {
            downed: false,
            zoom: false,
            distStart : 1,
            dist:1,
            dx: 0,
            dy: 0,
            startX0: 0,
            startY0: 0
        };
        self = this;
        //TODO 모바일 체크 디텍터도 필요하군
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            document.body.addEventListener('touchstart',HD_downTouch,false);
            document.body.addEventListener('touchmove',HD_moveTouch,false);
            document.body.addEventListener('touchend',HD_upTouch,false);
        }else{
            document.body.addEventListener('mousedown',HD_down,false);
            document.body.addEventListener('mousemove',HD_move,false);
            document.body.addEventListener('mouseup',HD_up,false);
        }
    })
    .method('setSpeed', function setSpeed(value){
        this._speed = value;
    })
    .method('setSmoothDelay', function setSmoothDelay(value){
        this._smoothDelay = value > 0.5 ? 0.5 : value;
    })
    .method('setMinDistance', function setMinDistance(value){
        this._minDistance = value < 1 ? 1 : value;
    })
    .method('setMaxDistance', function setMaxDistance(value){
        this._maxDistance = value;
    })
    .method('setDistance', function setDistance(value){
        this._distance = value;
    })
    .method('getSpeed', function getSpeed(){
         return this._speed;
    })
    .method('getSmoothDelay', function getSmoothDelay(){
        return this._smoothDelay;
    })
    .method('getMinDistance', function getMinDistance(){
        return this._minDistance;
    })
    .method('getMaxDistance', function getMaxDistance(){
        return this._maxDistance;
    })
    .method('getDistance', function getDistance(){
        return this._distance;
    })
    .method('getPan', function getPan(){
        return this._pan;
    })
    .method('getTilt', function getTilt(){
        return this._tilt;
    })
    .method('update', function update(){
        if(this._mouseInfo.zoom){
            this._distance *= self._mouseInfo.distStart/self._mouseInfo.dist;
            if(this._distance<this._minDistance) this._distance = this._minDistance;
            if(this._distance>this._maxDistance) this._distance = this._maxDistance;
            this._camera.x += (-Math.sin(this._pan )*this._distance - this._camera.x)*this._smoothDelay,
            this._camera.y += (Math.sin(this._tilt )*this._distance +Math.cos(this._tilt )*this._distance- this._camera.y)*this._smoothDelay,
            this._camera.z += (Math.cos(this._pan )*this._distance- this._camera.z)*this._smoothDelay;
        }else{
            this._pan += this._mouseInfo.dx / window.innerWidth * this._speed * Math.PI/180,
            this._tilt  += this._mouseInfo.dy / window.innerHeight/2* this._speed  * Math.PI/180,
            this._camera.x += (-Math.sin(this._pan )*this._distance - this._camera.x)*this._smoothDelay,
            this._camera.y += (Math.sin(this._tilt )*this._distance +Math.cos(this._tilt )*this._distance- this._camera.y)*this._smoothDelay,
            this._camera.z += (Math.cos(this._pan )*this._distance- this._camera.z)*this._smoothDelay,
            this._camera.lookAt(0,0,0);
        }
    
        this._mouseInfo.dx = 0,
        this._mouseInfo.dy = 0;
    
    })
    .build();
})();