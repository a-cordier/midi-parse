'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isMetaEvent = isMetaEvent;
exports.isSysexMessage = isSysexMessage;
exports.isVariableLengthQuantityDelimiter = isVariableLengthQuantityDelimiter;
exports.getVariableLengthQuantity = getVariableLengthQuantity;
exports.MidiEvent = MidiEvent;

var _midiMessage = require('./midi-message');

var _metaEvent = require('./meta-event');

function isMetaEvent(data, offset) {
	return 0xFF === data.getUint8(offset);
}

function isSysexMessage(data, offset) {
	var value = data.getUint8(offset);
	return 0xF0 === value || 0xF7 === value;
}

/**
 * Assert variable length quantity property [Most Significant bit = 0]
 */
function isVariableLengthQuantityDelimiter(value) {
	return 0 === (0x80 & value);
}

function getVariableLengthQuantity(data, offset) {
	var val = 0,
	    currentByteValue = 0;

	for (var i = 0; i < 4; i++) {
		currentByteValue = data.getUint8(offset + i);
		if (isVariableLengthQuantityDelimiter(currentByteValue)) {
			return {
				value: val + currentByteValue,
				next: offset + i + 1
			};
		}
		val += currentByteValue & 0x7f;
		val <<= 7;
	}
	throw new RangeError('4 bytes variable length value limit exceded');
}

function MidiEvent(data, offset) {
	var deltatime = getVariableLengthQuantity(data, offset);
	var event = {
		delta: deltatime.value
	};
	offset = deltatime.next;
	if (isMetaEvent(data, offset)) {
		return Object.assign((0, _metaEvent.MetaEvent)(data, offset), event);
	}
	if (isSysexMessage(data, offset)) {
		throw new Error('Sysex messages are not implemented yet');
	}
	return Object.assign((0, _midiMessage.MidiMessage)(data, offset), event);
}