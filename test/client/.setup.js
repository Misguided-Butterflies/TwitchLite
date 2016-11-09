// See example here:
// https://github.com/lelandrichardson/enzyme-example-karma-webpack/blob/master/test/.setup.js
require('babel-register')();

var jsdom = require('jsdom').jsdom;
var exposed = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposed.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;

// As per the test script inside package.json, this file will be run
// before running all client tests. Thus, common imports can be done
// once here, rather than each time in every test file
var React = require('react');
var chai = require('chai');
var sinon = require('sinon');
var enzyme = require('enzyme');
var chaiEnzyme = require('chai-enzyme');

chai.use(chaiEnzyme());

global.React = React;
global.chai = chai;
global.expect = chai.expect;
global.spy = sinon.spy;
global.mount = enzyme.mount;
global.shallow = enzyme.shallow;
global.render = enzyme.render;
