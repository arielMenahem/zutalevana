Ext.define('APP.view.Viewport', {
    extend: 'Ext.container.Viewport',
    //layout: 'fit',
    requires:[
    
    ],
    initComponent: function () {
        this.items = {
            
			//layout: 'hbox',
			items: [
                   /* {
                        xtype: 'taskGrid'
                    },*/
					

            ]
            };

        this.callParent();
    }
});