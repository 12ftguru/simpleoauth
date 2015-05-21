/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SimpleOAuth.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'SimpleOAuth.view.main.MainController',
        'SimpleOAuth.view.main.MainModel',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Spacer'
    ],

    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: 'fit',
    listeners: {
        render: 'initViewVars',
        scope: 'controller'
    },
    items: [
        {
            xtype: 'container',
            height: 647,
            width: 791,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'form',
                    flex: 1,
                    bodyPadding: 10,
                    title: 'OAuth Tester',
                    items: [

                      {
                          xtype: 'fieldset',
                          margin: 10,
                          title: 'Create Client',
                          items: [
                              {
                                  xtype: 'textfield',
                                  anchor: '100%',
                                  fieldLabel: 'Name',
                                  name: 'name',
                                  bind: {
                                      value: '{oauth2.client_name}'
                                  }
                              },
                              {
                                  xtype: 'textfield',
                                  anchor: '100%',
                                  fieldLabel: 'Secret',
                                  name: 'secret',
                                  bind: {
                                      value: '{oauth2.client_secret}'
                                  }
                              },
                              {
                                  xtype: 'textfield',
                                  anchor: '100%',
                                  fieldLabel: 'Hashed Secret',
                                  name: 'hashedsecret',
                                  disabled: true,
                                  bind: {
                                      value: '{hashedSecret}'
                                  }
                              },
                              {
                                  xtype: 'textfield',
                                  anchor: '100%',
                                  fieldLabel: 'User ID',
                                  name: 'user_id',
                                  bind: {
                                      value: '{oauth2.client_user_id}'
                                  }
                              },
                              {
                                  xtype: 'button',
                                  text: 'Create Client',
                                  handler: 'createClient'
                              }
                          ]
                      },{
                            xtype: 'fieldset',
                            margin: 10,
                            title: 'Authorize',
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Auth URL',
                                    name: 'auth_url',
                                    bind: {
                                        value: '{oauth2.url_auth}'
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Token URL',
                                    name: 'token_url',
                                  bind: {
                                      value: '{oauth2.url_token}'
                                  }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Client ID',
                                    name: 'client_id',
                                  bind: {
                                      value: '{oauth2.client_id}'
                                  }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Authorize',
                                    handler: 'authorize'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            margin: 10,
                            title: 'Get Bearer Token',
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Auth Code',
                                    name: 'auth_code',
                                    bind: {
                                        value: '{oauth2.authCode}'
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Client ID',
                                    name: 'client_id',
                                  bind: {
                                      value: '{oauth2.client_id}'
                                  }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Client Secret',
                                    name: 'client_secret',
                                  bind: {
                                      value: '{oauth2.client_secret}'
                                  }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Get Bearer Token',
                                    handler: 'getBearerToken'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            margin: 10,
                            title: 'Test Auth State',
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Token',
                                    name: 'token',
                                  bind: {
                                      value: '{oauth2.token}'
                                  }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'API Test URL',
                                    name: 'api_url',
                                    bind: {
                                        value: '{oauth2.url_api}'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Test Auth State',
                                    handler: 'testAuthState'
                                }
                            ]
                        }
                    ]
                },
                {xtype: 'splitter'},
                {
                    xtype: 'panel',
                    itemId: 'serverResponse',
                    flex: 1,
                    bodyStyle: 'font: 12px "Courier, Courier New" #eeeeee;padding:5px;',
                    title: 'Response ',
                    autoScroll: true,
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'tbspacer',
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    text: 'Clear',
                                    handler: 'clearConsole'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
