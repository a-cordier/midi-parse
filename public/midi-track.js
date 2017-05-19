'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MidiTrack = MidiTrack;

var _midiEvent = require('./midi-event');

var _metaEvent = require('./meta-event');

var _midiFile = require('./midi-file');

var _runningStatus = require('./running-status');

function MidiTrack(data, offset) {

	var header = function header() {
		return {
			type: (0, _midiFile.getString)(data, offset, 4),
			length: data.getUint32(offset + 4),
			next: offset + 8
		};
	}();

	if ('MTrk' !== header.type) {
		throw new Error('Bad MIDI track format');
	}

	function nextEvent(data, offset) {
		var event = (0, _midiEvent.MidiEvent)(data, offset);
		return event;
	}

	offset = header.next;

	var events = function (offset) {
		var events = [];
		for (;;) {
			var event = nextEvent(data, offset);
			events.push(event);
			if (_metaEvent.Meta.END_OF_TRACK === event.type) {
				_runningStatus.RunningStatus.reset();
				return events;
			}
			offset = event.next;
		}
	}(offset);

	return {
		events: events,
		/*
   *track length expressed in bytes
   */
		get length() {
			return header.length;
		}
	};
}