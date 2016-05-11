// Generated by CoffeeScript 1.10.0
//import TestAuth from 'meg/utils/test-auth';
var HostInfosInitializer, initialize;

initialize = function(app) {
  app.inject('route', 'hostinfos', 'service:hostinfos');
  app.inject('controller', 'hostinfos', 'service:hostinfos');
  app.inject('application', 'hostinfos', 'service:hostinfos');
  app.inject('component', 'hostinfos', 'service:hostinfos');
  return app.inject('service:flashes', 'hostinfos', 'service:hostinfos');
};

HostInfosInitializer = {
  name: 'hostinfos',
  after: 'ember-data',
  initialize: initialize
};

export {initialize};

export default HostInfosInitializer;