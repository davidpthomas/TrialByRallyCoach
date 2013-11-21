Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    tips: [
      {
        name: 'Releases Exist',
        tipDisplayText: 'Create a Release timebox',
        tipDescription: 'A Release in Rally defines a larger timebox ideal for planning work across several iterations.',
        tipCoachSuggestion: 'The timebox is generally large enough to encompass 4-6 Iterations including a hardening iteration',
        queryModel: 'Release',
        queryFilters: [],
        queryCountEqualityTestValue: 10
      },
      {
        name: 'Iterations Exist',
        tipDisplayText: 'Create an Iteration timebox',
        tipDescription: 'An Iteration in Rally defines a smaller timebox ideal for planning upcoming work.',
        tipCoachSuggestion: 'The timebox is generally 2 weeks long.',
        queryModel: 'Iteration',
        queryFilters: [],
        queryCountEqualityTestValue: 98
      }

    ],
    activeTips: [],

    launch: function() {
      this._findTips();
    },
   
    _findTips: function() {
      console.log('async', async);
      var boundQueryTip = Ext.bind(this._queryTip, this);
      var boundOnTipsQueried = Ext.bind(this._onTipsQueried, this);
      async.map(this.tips, boundQueryTip, boundOnTipsQueried);
    },

    _queryTip: function(tip, callback) {
      Ext.create('Rally.data.WsapiDataStore', {
        model: tip.queryModel,
        autoLoad: true,
        fetch: true,
        context: this.getContext().getDataContext(),
        listeners: {
          load: function(store, data) {
            console.log('found %s', tip.queryModel, data.length, tip.queryCountEqualityTestValue);
            var result = null;
            if (data.length === tip.queryCountEqualityTestValue) {
              result = tip.name;
            }
            callback(null, result);
          },
          scope: this
        }
      });
    },

    _onTipsQueried: function(err, results) {
      this.activeTips = _.filter(results, function(value, index) { return value !== null; });
      console.log('active tips', this.activeTips);
      this._doLayout();
    },
    _doLayout: function() {
      var tipCountText = Ext.create('Ext.Component', {
        data: {
          tipCount: this.activeTips.length
        },
        tpl: new Ext.XTemplate("{tipCount} Tips"),
        cls: 'enlarged-number'
      });

      var tipExtraText = Ext.create('Ext.Component', {
        html: "for Rally Trial Greatness!",
        cls: 'subtitle'
      });


      /*
        name: 'Iterations Exist',
        tipDisplayText: 'Create an Iteration timebox',
        tipDescription: 'An Iteration in Rally defines a smaller timebox ideal for planning upcoming work.',
        tipCoachSuggestion: 'The timebox is generally 2 weeks long.',
        */

      var tipItems = [];
      _.forEach(this.activeTips, function(tipName, index) {
        var tip = _.find(this.tips, function(value, index) { return value.name === tipName; });

        tipItems.push({
          title: "<div class='content'>" + tip.tipDisplayText + "</div>",
          data: {
            description: tip.tipDescription,
            coachSuggestion: tip.tipCoachSuggestion
          },
          tpl: new Ext.XTemplate(
                 "<div class='content'>{description}</div>",
                 "<div class='content agile-advice'>Agile Advice...`{coachSuggestion}`</div>"
          )
        });
      }, this);
      var accordianPanel = Ext.create('Ext.panel.Panel', {
        layout: {
          type: 'accordion',
          animate: true,
          collapseFirst: 'true'
        },
        items: tipItems
        /*
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
        */
      });
      this.add(tipCountText);
      this.add(tipExtraText);
      this.add(accordianPanel);
    }
});
