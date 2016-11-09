// As per the test script inside package.json, this file will be run
// before running all server tests. Thus, common imports can be done
// once here, rather than each time in every test file
global.chai = require('chai');
global.expect = chai.expect;
