/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SimpleOAuth.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox'
    ],
    models: [
      'OAuth2'
    ],
    alias: 'controller.main',

    btnClick: function(btn, e, eOpts) {
        var me = this;
        if (Ext.isFunction(me[btn.itemId])) {
            me[btn.itemId](btn);
        } else {
            //<debug>
            console.warn('Function Not Implemented: ', btn.itemId, e, eOpts, this);
            //</debug>
        }
    },
    createClient: function() {
        var me = this, view = me.getView(), vm = me.getViewModel(), data,
            clientTpl = new Ext.XTemplate(
                '<div class="entry">',
                '<p><b>Create Client</b></p>',
                "<p>There is no api for adding client records, so you have to do this by hand. Using your mongo client, first be sure you're connected to the correct db:</p>",
                "<code><pre>use buildi_dev_auth;</pre></code>",
                "<p>Then issue this command:</p>",
                "<code><pre>db.oauth_client.insert({name: '{name}', secret: '{hashedSecret}', user_id: '{user_id}'});</pre></code>",
                "<p>Then query your new client document:</p>",
                "<code><pre>db.oauth_client.find({secret: '{hashedSecret}'});</pre></code>",
                "<p>The value of the _id field should be entered into 'Client ID' below.</p>",
                '</div>'
            );
        data = {
          name: vm.get('oauth2.client_name'),
          hashedSecret: vm.get('oauth2.hashedSecret'),
          user_id: vm.get('oauth2.client_user_id')
        };
        view.down('panel[itemId=serverResponse]').update(clientTpl.apply(data));
      vm.data.oauth2.save({
        callback: function() {
          console.log('Data save', arguments);
        }
      });
      console.log('Data: ', vm.data);
    },
    authorize: function() {
        Ext.MessageBox.confirm(
            'Authorize',
            "Clicking Yes will redirect this browser to authorize the app. If all goes well, you'll come back here.",
            function(okBtn) {
                if (okBtn === 'yes' || okBtn === 'ok') {
                    this.doAuthorize();
                }
            },
            this
        );
    },
    doAuthorize: function() {
       //http://127.0.0.1:8001/api/oauth2/authorize?client_id=this_is_my_id&response_type=code&redirect_uri=http://myapp.com
        var me=this, vm = me.getViewModel(), currentUrl = window.location.href.split('?'), url, data;
        url = vm.get('oauth2.url_auth');
        data = {
            client_id: vm.get('oauth2.client_id'),
            response_type: 'code',
            redirect_uri: currentUrl[0]
        };
        url += '?';
        url += Ext.Object.toQueryString(data);
        window.location.href = url;
    },
    getBearerToken: function() {
        var me=this, vm = me.getViewModel(), currentUrl = window.location.href.split('?'),
            view = me.getView(),
            data, auth;
        data = {
          code: vm.get('oauth2.authCode'),
          grant_type: 'authorization_code',
          redirect_uri: currentUrl[0]
        };
        auth = 'Basic ' + Ext.util.Base64.encode(vm.get('oauth2.client_id') + ':' +vm.get('oauth2.client_secret'));
        Ext.Ajax.request({
            method: 'POST',
            url: vm.get('oauth2.url_token'),
            headers: {
                Authorization: auth
            },
            params: data,
            withCredentials: true,
            callback: function(opt, success, response) {
                var resp = Ext.JSON.decode(response.responseText);
                view.down('panel[itemId=serverResponse]').update("<pre>"+response.responseText+"</pre>");
                if (success) {
                    vm.set('oauth2.token', resp.access_token.value);
                } else {
                    console.error(resp.error, resp.error_description);
                }
            }
        });
    },
    testAuthState: function() {
         var me=this, vm = me.getViewModel(),
            view = me.getView(),
            data, auth;
        auth = 'Bearer ' + vm.get('oauth2.token');
        data = "<b>Without oauth token: </b><br />\n";
        Ext.Ajax.request({
            method: 'GET',
            url: vm.get('oauth2.url_api'),
            withCredentials: false,
            callback: function(opt, success, response) {
                data += '<pre>';
                data += response.responseText;
                data += '</pre><br /><br />';
                data += "<b>With oauth token:</b><br />\n";
                        Ext.Ajax.request({
                            method: 'GET',
                            url: vm.get('oauth2.url_api'),
                            withCredentials: true,
                            headers: {
                                Authorization: auth
                            },
                            callback: function(opt, success, response) {
                                data += '<pre>';
                                data += response.responseText;
                                data += "</pre>\n";
                                view.down('panel[itemId=serverResponse]').update(data);
                            }
                        });
            }
        });
    },
    clearConsole: function() {
        var me = this, view = me.getView();
        view.down('panel[itemId=serverResponse]').update('');
    },
    instantiateVM: function() {
      var me=this, vm=me.getViewModel(), store = vm.getStore('session'), data, record;
      if (store.count() == 0) {
        console.log('adding basic record');
        store.add({});
      }
      record = store.getAt(0);
      console.info(record); //logs 123
      data = Ext.Object.fromQueryString(window.location.search);
      if (!Ext.isEmpty(data.code)) {
        record.set('authCode', data.code);
        store.sync();
      }
      vm.set('oauth2', record);
    },
    initViewVars: function() {
      var me=this, vm=me.getViewModel(), store = vm.getStore('session');
      console.log('Store %O has %O items', store, store.getCount());
      if (store.isLoaded()) {
        me.instantiateVM();
      } else {
        console.log('Setting up store');
        store.on('load', me.instantiateVM, me);
      }
      /* SimpleOAuth.model.OAuth2.load("1", {
        callback: function(record, opts) {
          console.info(record, opts); //logs 123
          data = Ext.Object.fromQueryString(window.location.search);
          if (!Ext.isEmpty(data.code)) {
            record.set('authCode', data.code);
            record.save();
            //vm.set('oauth2.authCode', data.code);
          }
          vm.linkTo('oauth2', {
            reference: 'SimpleOAuth.model.OAuth2',
            id: record.id
          });
        }
      });
       */


    }
});
