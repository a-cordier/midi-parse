import { RunningStatus } from './running-status'

export const Status = Object.freeze({
	NOTE_OFF: 0x08,
	NOTE_ON: 0x09,
	NOTE_AFTER_TOUCH: 0x0A,
	CONTROL_CHANGE: 0x0B,
	PROGRAM_CHANGE: 0x0C,
	CHANNEL_AFTER_TOUCH: 0x0D,
	PITCH_BEND: 0x0E
})

export function isRunningStatus(data, offset) {
	return 0 !== (data.getUint8(offset) & 0x80)
}

export function getNoteValue(data, offset) {
	const notes = [
			'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
		],
		n = data.getUint8(offset)
	return notes[n % 12]
}

export function getNoteOctave(data, offset) {
	return Math.floor(data.getUint8(offset) / 12)
}

export function getNote(data, offset) {
	return {
		data: {
			value: getNoteValue(data, offset),
			octave: getNoteOctave(data, offset),
			velocity: data.getUint8(offset + 1)
		},
		next: offset + 2
	}
}

export function getNoteAftertouch(data, offset) {
	return {
		type: Status.NOTE_AFTER_TOUCH,
		data: {
			note: getNoteValue(data, offset),
			value: data.getUint8(offset + 1)
		},
		next: offset + 2
	}
}

export function getControlChange(data, offset) {
	return {
		type: Status.CONTROL_CHANGE,
		data: {
			control: data.getUint8(offset),
			value: data.getUint8(offset + 1)
		},
		next: offset + 2
	}
}

export function getProgramChange(data, offset) {
	return {
		type: Status.PROGRAM_CHANGE,
		value: data.getUint8(offset),
		next: offset + 1
	}
}

export function getChannelAftertouch(data, offset) {
	return {
		type: Status.CHANNEL_AFTER_TOUCH,
		value: data.getUint8(offset),
		next: offset + 1
	}
}

export function getPitchBend(data, offset) {
	return {
		type: Status.PITCH_BEND,
		b1: data.getUint8(offset),
		b2: data.getUint8(offset),
		next: offset + 2
	}
}

export function MidiMessage(data, offset) {
	if (isRunningStatus(data, offset)) {
		RunningStatus.status = (data.getUint8(offset) >> 4)
		offset += 1
	}
	switch (RunningStatus.status) {
		case Status.NOTE_OFF:
			return Object.assign(getNote(data, offset), {
				type: Status.NOTE_OFF
			})
		case Status.NOTE_ON:
			return Object.assign(getNote(data, offset), {
				type: Status.NOTE_ON
			})
		case Status.NOTE_AFTER_TOUCH:
			return getNoteAftertouch(data, offset)
		case Status.CONTROL_CHANGE:
			return getControlChange(data, offset)
		case Status.PROGRAM_CHANGE:
			return getProgramChange(data, offset)
		case Status.CHANNEL_AFTER_TOUCH:
			return getChannelAftertouch(data, offset)
		case Status.PITCH_BEND:
			return getPitchBend(data, offset)
	}
}
