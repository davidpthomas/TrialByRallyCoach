Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
      this._doLayout();
    },
    
    _doLayout: function() {
      var tipCountText = Ext.create('Ext.Component', {
        html: "3 Tips",
        cls: 'enlarged-number'
      });

      var tipExtraText = Ext.create('Ext.Component', {
        html: "for Rally Trial Greatness!",
        cls: 'subtitle'
      });

      var accordianPanel = Ext.create('Ext.panel.Panel', {
        layout: {
          type: 'accordion',
          animate: true,
          collapseFirst: 'true'
        },
        items: [
          {
            title: "<div class='content'>tip 1</div>",
            html: "<div class='content'>this is tip 1<br/>and this is how it works"
          },
          {
            title: "<div class='content'>tip 2</div>",
            html: "<div class='content'>this is tip 2<br/>and this is how it works"
          },
          {
            title: "<div class='content'>tip 3</div>",
            html: "<div class='content'>this is tip 3<br/>and this is how it works"
          }
        ]
      });
      this.add(tipCountText);
      this.add(tipExtraText);
      this.add(accordianPanel);
    }
});
