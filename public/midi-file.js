'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isEof = isEof;
exports.isNewTrack = isNewTrack;
exports.getString = getString;
exports.getBytes = getBytes;
exports.MidiFile = MidiFile;

var _lodash = require('lodash.times');

var _lodash2 = _interopRequireDefault(_lodash);

var _midiTrack = require('./midi-track');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEof(data, offset) {
	return offset >= data.byteLength;
}

function isNewTrack(data, offset) {
	return 'MTrk' === getString(data, offset, 4);
}

function getString(data, offset, length) {
	return (0, _lodash2.default)(length, function (i) {
		return String.fromCharCode(data.getUint8(offset + i));
	}).join('');
}
function getBytes(data, offset, length) {
	return (0, _lodash2.default)(length, function (i) {
		return data.getUint8(offset + i);
	});
}

function MidiFile(data) {

	var header = function header() {
		return {
			type: getString(data, 0, 4),
			length: data.getUint32(4),
			format: data.getUint16(8),
			tracks: data.getUint16(10),
			division: data.getUint16(12),
			next: 14
		};
	}();

	if ('MThd' !== header.type) {
		throw new Error('Bad MIDI file format');
	}

	var offset = header.next;

	var tracks = (0, _lodash2.default)(header.tracks, function () {
		var track = (0, _midiTrack.MidiTrack)(data, offset);
		offset += track.length + 8; // track data length + track header length
		return track;
	});

	return {
		tracks: tracks,
		get division() {
			return header.division;
		}
	};
}