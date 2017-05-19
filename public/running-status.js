"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var RunningStatus = exports.RunningStatus = function () {
	var status = null;
	return {
		reset: function reset() {
			status = null;
		},

		get status() {
			return status;
		},
		set status(value) {
			status = value;
		}
	};
}();