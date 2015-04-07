var loopback = require('loopback');
var server = require('../../server/server');

module.exports = function(MyModel) {

	MyModel.shouldReturnNumber = function(cb) {
		var response = {};
		var idsCopy;
		MyModel.create([{
			name: 'first model'
		}, {
			name: 'second model'
		}], function(err, models) {
			response.idsBeforeFind = models.map(function(model) {
				return model.id;
			});
			idsCopy = response.idsBeforeFind.slice();
			response.typeBeforeFind = typeof response.idsBeforeFind[0];

			MyModel.find({
				where: {
					id: {
						inq: idsCopy
					}
				}
			}, function(err, models) {
				response.idsAfterFind = idsCopy;
				response.typeAfterFind = typeof idsCopy[0];
				cb(err, response);
			});
		});
	};

	loopback.remoteMethod(
		MyModel.shouldReturnNumber, {
			accepts: [],
			returns: {
				arg: 'result',
				type: 'object',
				root: true
			},
			http: {
				path: '/shouldReturnNumber',
				verb: 'get'
			},
			description: 'Creates models and queries with `inq` filter, then displays the altered filter input'
		}
	);

};