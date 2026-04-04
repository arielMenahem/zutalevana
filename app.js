(function () {
    //set Ext.Loader class
    var cfg = Ext.Loader.getConfig();
    cfg.enabled = true;

   // Ext.Loader.setPath('APP', '/app');//our extjs app file
   
    Ext.onReady(function() {


        Ext.define('APP.util.Info', {
            //this class is helpfull for storing global information
            singleton: true,
            myGlobal: 1,
            userDetails: {
                full_name:null
            },

        });
        Ext.application({

            name: 'APP',
         //   appFolder:'/app',
            autoCreateViewport: true,
            models: [],
            stores:[],
            controllers: ['AppController'],
            requires: ['APP.util.Info'],
            launch: function () {
                _myAppGlobal = this;
                _myAppController = this.getController('AppController');
            }
        });
    });
})();