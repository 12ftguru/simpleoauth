Ext.define('SimpleOAuth.model.OAuth2', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'client_secret', type: 'string' },
    { name: 'client_name', type: 'string' },
    { name: 'client_id', type: 'string' },
    { name: 'user_id', type: 'string', defaultValue: 'FakeUserID' },
    { name: 'url_auth', type: 'string', defaultValue: 'http://127.0.0.1:8001/api/oauth2/authorize' },
    { name: 'url_token', type: 'string', defaultValue: 'http://127.0.0.1:8001/api/oauth2/token' },
    { name: 'url_api', type: 'string', defaultValue: 'http://127.0.0.1:8001/api/service/auth/state' },
    { name: 'authCode', type: 'string' },
    { name: 'token', type: 'string' }
  ],
  schema: {
    namespace: 'SimpleOAuth.model',
    proxy: {
      type: 'localstorage',
      id  : 'simpleoauth',
      reader: {
            type: 'json'
      }
    }
  }
});