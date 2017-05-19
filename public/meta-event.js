'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Meta = undefined;
exports.getTempo = getTempo;
exports.SpecificEvent = SpecificEvent;
exports.SetTempoEvent = SetTempoEvent;
exports.EndOfTrackEvent = EndOfTrackEvent;
exports.MetaEvent = MetaEvent;

var _midiEvent = require('./midi-event');

var _midiFile = require('./midi-file');

var Meta = exports.Meta = Object.freeze({
	SEQUENCE_NUMBER: 0x00,
	TEXT_EVENT: 0x01,
	COPYRIGHT_NOTICE: 0x02,
	SEQUENCE_NAME: 0x03,
	INSTRUMENT_NAME: 0x04,
	LYRIC: 0x05,
	MARKER: 0x06,
	CUE_POINT: 0x07,
	MIDI_CHANNEL_PREFIX: 0x20,
	END_OF_TRACK: 0x2F,
	SET_TEMPO: 0x51,
	SMPTE_OFFSET: 0x54,
	TIME_SIGNATURE: 0x58,
	KEY_SIGNATURE: 0x59,
	SPECIFIC: 0x7F
});

function getTempo(data, offset) {
	var tempo = (data.getUint8(offset) << 16) + (data.getUint8(offset + 1) << 8) + data.getUint8(offset + 1);
	return {
		data: 6 * 1E6 / tempo,
		next: offset + 3
	};
}

function SpecificEvent(data, offset) {
	var type = Meta.SPECIFIC;
	offset += 1;
	var length = (0, _midiEvent.getVariableLengthQuantity)(data, offset);
	offset = length.next;
	var dataBytes = (0, _midiFile.getBytes)(data, offset, length.value);
	offset += length.value;
	return {
		type: type,
		data: dataBytes,
		next: offset
	};
}

function SetTempoEvent(data, offset) {
	offset += 2;
	var t = (data.getUint8(offset++) << 16) + (data.getUint8(offset++) << 8) + data.getUint8(offset);
	return {
		type: Meta.SET_TEMPO,
		value: 6 * 1E7 / t,
		next: offset + 1
	};
}

function EndOfTrackEvent(_, offset) {
	return {
		type: Meta.END_OF_TRACK,
		next: offset + 2
	};
}

function MetaEvent(data, offset) {
	offset += 1; // FF meta event marker
	var value = data.getUint8(offset); // event type
	switch (value) {
		case Meta.SET_TEMPO:
			return SetTempoEvent(data, offset);
		case Meta.END_OF_TRACK:
			return EndOfTrackEvent(data, offset);
		default:
			return SpecificEvent(data, offset);
	}
}