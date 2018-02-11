import { cond, equals, identity } from 'ramda'
import { isRunningStatus } from './utils'
import { RunningStatus } from './running-status'

export const Status = Object.freeze({
	NOTE_OFF: 0x08,
	NOTE_ON: 0x09,
	NOTE_AFTER_TOUCH: 0x0A,
	CONTROL_CHANGE: 0x0B,
	PROGRAM_CHANGE: 0x0C,
	CHANNEL_AFTER_TOUCH: 0x0D,
	PITCH_BEND: 0x0E,
})

export function Note(data, offset) {
	return {
		data: {
			value: data.getUint8(offset),
			velocity: data.getUint8(offset + 1),
			channel: RunningStatus.channel,
		},
		next: offset + 2,
	}
}

export function NoteAfterTouch(data, offset) {
	return {
		type: Status.NOTE_AFTER_TOUCH,
		data: {
			note: data.getUint8(offset),
			value: data.getUint8(offset + 1),
			channel: RunningStatus.channel
		},
		next: offset + 2,
	}
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
	}
}

export function ProgramChange(data, offset) {
	return {
		type: Status.PROGRAM_CHANGE,
		data: {
			value: data.getUint8(offset),
			channel: RunningStatus.channel
		},
		next: offset + 1,
	}
}

export function ChannelAfterTouch(data, offset) {
	return {
		type: Status.CHANNEL_AFTER_TOUCH,
		data: {
			value: data.getUint8(offset),
			channel: RunningStatus.channel,
		},
		next: offset + 1,
	}
}

export function PitchBend(data, offset) {
	return {
		type: Status.PITCH_BEND,
		b1: data.getUint8(offset),
		b2: data.getUint8(offset),
		next: offset + 2,
		channel: RunningStatus.channel,
	}
}

export function MidiMessage(data, offset) { /* eslint-disable no-param-reassign */
	if (isRunningStatus(data, offset)) {
		RunningStatus.status = (data.getUint8(offset) >> 4)
		RunningStatus.channel = data.getUint8(offset) & 0XF
		offset += 1
	}

	return cond([
		[ equals(Status.NOTE_ON), 				() => Object.assign(Note(data, offset), { type: Status.NOTE_ON }) ],
		[ equals(Status.NOTE_OFF), 				() => Object.assign(Note(data, offset), { type: Status.NOTE_OFF }) ],
		[ equals(Status.NOTE_AFTER_TOUCH), 		() => NoteAfterTouch(data, offset) ],
		[ equals(Status.CONTROL_CHANGE), 		() => ControlChange(data, offset) ],
		[ equals(Status.PROGRAM_CHANGE), 		() => ProgramChange(data, offset) ],
		[ equals(Status.CHANNEL_AFTER_TOUCH), 	() => ChannelAfterTouch(data, offset) ],
		[ equals(Status.PITCH_BEND), 			() => PitchBend(data, offset) ],
		[ identity(true),						() => { throw new Error('Unknown running status') }],
	])(RunningStatus.status)

}
