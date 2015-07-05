var view = (function() {

    var world;

    return {
        model: null,
        events: [],
        isAnimating: false,
        init: function ( model ){
            this.model = model;
            return this;
        },
        addEvent: function(fn){
            this.events.push(fn);
        },
        trigger: function(evt){
            var that,
                events;

            that = this;
            events = that.events;

            if( that.isAnimating) return;

            for(var fn in events){
                events[fn](evt);
            }

            that.touch(evt.mesh);
        },
        print: function(value){
            var element;
            return (function(value){
                (!element) && ( element = document.getElementById('output'));
                element.value = value;
            })(value);
        },
        animate: [],
        touch: function(mesh){
            var that,
                prev;

            that = this;

            prev = mesh.rotateX;

            that.animate.push(function(){
                mesh.rotateX += 0.2;
            });
            that.isAnimating = true;
            setTimeout(function(){

                var ani;
                mesh.rotateX = prev;

                while(ani = that.animate.pop()){};

                that.isAnimating = false;

            }, 500);
        },
        render: function() {

            var that,
                scene,
                camera,
                model,
                data,
                ctrl,
                view;
            ;

            that = this;

            MoGL.classes(window);

            world = new World('canvas');
            scene = new Scene();
            camera = new Camera();
            //world.setAutoSize(1);

            world.addScene(scene);
            scene.addChild(camera);

            this.makeMesh(this.model.data.inputs, scene);

            world.start();

            world.addEventListener(World.renderBefore, function(){
                for(var key in  that.animate){
                    that.animate[key]();
                }
            });
        },
        makeMesh: function(data, scene){
            for( var i=0, len = data.length; i < len; i++ ){
                var item,
                    mesh,
                    model;

                model = this.model;
                item = data[i];

                mesh = this.addMesh(scene, item);
            }
        },
        addMesh: function(scene, item){
            var
                texture,
                mat,
                mesh,
                that,
                key, x, y, scale;

            that = this;

            key = item[that.model.key];
            x = item.x;
            y = item.y;
            scale = item.scale;
            rotate = item.rotate;

            texture = new Texture();
            texture.img = this.getAsset(key);

            mat = new Material('#FFF');
            mat.addTexture(Texture.diffuse, texture);

            mesh = new Mesh(Primitive.plane(), mat);
            mesh.rotateX = item.rotate;
            mesh.scale = [item.scale, item.scale, item.scale];
            mesh.x = item.x;
            mesh.y = item.y;

            scene.addChild(mesh);

            item.uuid = mesh.uuid;

            mesh.addEventListener(Mesh.down, function(){

                //console.log("key:", key,  " mesh uuid:", mesh.uuid, "x:", x, "y:", y);

                var evt = {};
                evt[that.model.key] = key;
                evt['uuid'] = mesh.uuid;
                evt['mesh'] = mesh;

                that.trigger(evt);
            });

            return mesh;
        },
        getAsset: function (num){
            var img = document.createElement('img');
            var canvas = document.getElementById('numPrinter');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.rect(0,0,canvas.width, canvas.height);
            context.fillStyle = 'gray';
            context.fill();

            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();

            context.font = '90pt Arial';
            context.fillStyle = 'white';
            context.fillText(num +'', 15, 92);

            img.src = canvas.toDataURL();

            return img;
        }
    }
})();
