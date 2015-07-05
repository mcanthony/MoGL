var model = {
    'key': 'input',
    'value': 'input',
    'run': '=',
    'fields': {
        'x': 'x',
        'y': 'y',
        'rotate': 'rotateX',
        'uuid': 'uuid',
    },
    'calc': {
        '+': function (a, b){
            return a + b;
        },
        '-': function (a, b){
            return a - b;
        },
        '/': function (a, b){
            return a / b;
        },
        'x': function (a, b){
            return a * b;
        }
    },
    data: null,
    init: function(data){
        this.data = data;
    }
};
