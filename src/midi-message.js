import { isRunningStatus } from './utils';
import { RunningStatus } from './running-status';

export const Status = Object.freeze({
	NOTE_OFF: 0x08,
	NOTE_ON: 0x09,
	NOTE_AFTER_TOUCH: 0x0A,
	CONTROL_CHANGE: 0x0B,
	PROGRAM_CHANGE: 0x0C,
	CHANNEL_AFTER_TOUCH: 0x0D,
	PITCH_BEND: 0x0E,
	SYSEX_MESSAGE: 0XF0,
});

export function Note(data, offset) {
	return {
		data: {
			value: data.getUint8(offset),
			velocity: data.getUint8(offset + 1),
			channel: RunningStatus.channel,
		},
		next: offset + 2,
	};
}

export function NoteAfterTouch(data, offset) {
	return {
		type: Status.NOTE_AFTER_TOUCH,
		data: {
			note: data.getUint8(offset),
			value: data.getUint8(offset + 1),
			channel: RunningStatus.channel,
		},
		next: offset + 2,
	};
}

export function ControlChange(data, offset) {
	return {
		type: Status.CONTROL_CHANGE,
		data: {
			control: data.getUint8(offset),
			value: data.getUint8(offset + 1),
			channel: RunningStatus.channel,
		},
		next: offset + 2,
	};
}

export function ProgramChange(data, offset) {
	return {
		type: Status.PROGRAM_CHANGE,
		data: {
			value: data.getUint8(offset),
			channel: RunningStatus.channel,
		},
		next: offset + 1,
	};
}

export function ChannelAfterTouch(data, offset) {
	return {
		type: Status.CHANNEL_AFTER_TOUCH,
		data: {
			value: data.getUint8(offset),
			channel: RunningStatus.channel,
		},
		next: offset + 1,
	};
}

export function PitchBend(data, offset) {
	return {
		type: Status.PITCH_BEND,
		b1: data.getUint8(offset),
		b2: data.getUint8(offset),
		next: offset + 2,
		channel: RunningStatus.channel,
	};
}

export function MidiMessage(data, offset) { /* eslint-disable no-param-reassign */
	if (isRunningStatus(data, offset)) {
		RunningStatus.status = data.getUint8(offset) >> 4;
		RunningStatus.channel = (data.getUint8(offset) & 0XF) + 1;
		offset += 1;
	}
	switch (RunningStatus.status) {
		case Status.NOTE_ON: return Object.assign(Note(data, offset), { type: Status.NOTE_ON });
		case Status.NOTE_OFF: return Object.assign(Note(data, offset), { type: Status.NOTE_OFF });
		case Status.NOTE_AFTER_TOUCH: return NoteAfterTouch(data, offset);
		case Status.CONTROL_CHANGE: return ControlChange(data, offset);
		case Status.PROGRAM_CHANGE: return ProgramChange(data, offset);
		case Status.CHANNEL_AFTER_TOUCH: return ChannelAfterTouch(data, offset);
		case Status.PITCH_BEND: return PitchBend(data, offset);
		default: throw new Error('Unknown running status');
	}
}
