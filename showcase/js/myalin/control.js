var ctrl = {
    model: null,
    view: null,
    init: function(model, view){

        var that = this;

        that.model = model;
        that.view = view;

        that.view.init( that.model ).addEvent(function(evt) {
            that.trigger(evt);
        });
    },
    print: "",
    trigger: function(evt){

        var that = this;

        that.calculate(evt[model.key]);
    },
    calculate: function(key) {

        var that = this,
            model = that.model,
            nums, ops,
            value;

        if ( key === model.run ){

            ops = that.print.split(/\d/).filter(function(v){ return !!v;});
            value = that.print.split(/\+|\-|\x|\//).reduce(function(a,b){
                return that.model.calc[ops.shift()](parseFloat(a),parseFloat(b));
            });

            that.view.print(value);
            that.print = '';

        } else {
            if( that.model.calc[key] ){
                if (that.print.length < 1 || that.model.calc[that.print[that.print.length-1]] ) {
                    return;
                }
            }
            that.print += key;
        }
    }
};