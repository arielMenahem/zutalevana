Ext.define('APP.controller.AppController', {
    extend: 'Ext.app.Controller',
	'init': function () {
        this.control({
            //just for testing - show console log when the viewport is rendered
            'viewport': {
                render: this.onPanelRendered
               
            }

        });
    },
    views: [],
    stores: [

    ],
    models: [],
    refs: [],
    onPanelRendered: function () {
       console.log('viewport was rendered');
    }
   



});