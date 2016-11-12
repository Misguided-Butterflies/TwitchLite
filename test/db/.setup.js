var mongoose = require('mongoose');

// Necessary to prevent some model duplication errors
// See: https://github.com/Automattic/mongoose/issues/1251#issuecomment-41844298
// Could also consider a solution that would fix the problem in the
// model files themselves; see excellent example here:
// https://github.com/j0ni/beachenergy.ca/blob/master/datamodel/index.js#L20
mongoose.models = {};
mongoose.modelSchemas = {};
var chai = require('chai');
var expect = chai.expect;

global.mongoose = mongoose;
global.chai = chai;
global.expect = expect;
