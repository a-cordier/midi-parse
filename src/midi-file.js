import times from 'lodash.times';

export function isMetaEvent(data, offset) {
	return 0xFF === data.getUint8(offset)
}
export function isSysexMessage(data, offset) {
	return 0xF0 === data.getUint8(offset)
}

export function isMidiMessageStatus(data, offset) {
	return 0 === (0x80 & data.getUint8(offset))
}

export function isEof(data, offset) {
	return offset >= data.byteLength
}

export function isNewTrack(data, offset){
	return 'MTrk' === getString(data, offset, 4)
}

/**
 * Assert variable length quantity property [Most Significant bit = 0]
 */
export function isVariableLengthValueDelimiter(value) {
	return 0 === (0x80 && value)
}

export function getVariableLengthValue(data, offset) {
	let [idx, val, byte] = [0, 0, 0]
	for (; idx < 4; idx++) {
		byte = data.getUint8(offset + idx)
		if (isVariableLengthValueDelimiter(byte)) {
			return {
				data: val + byte,
				next() {
					return offset + idx + 1
				},
				offset
			}
		}
		val += (byte & 0x7f)
		val <<= 7
	}
	throw new RangeError('variable length value limit exceded')
}

export function getStatus(data, offset) {
	return data.getUint8(offset) >> 4
}

export function isNoteOffMessage(data, offset) {
	return 0x08 === getStatus(data, offset)
}

export function isNoteOnMessage(data, offset) {
	return 0x09 === getStatus(data, offset)
}

export function isNoteAftertouchMessage(data, offset) {
	return 0x0A === getStatus(data, offset)
}

export function isControlChangeMessage(data, offset) {
	return 0x0B === getStatus(data, offset)
}

export function isProgramChangeMessage(data, offset) {
	return 0x0C === getStatus(data, offset)
}

export function isChannelAftertouchMessage(data, offset) {
	return 0x0D === getStatus(data, offset)
}

export function isPitchBendMessage(data, offset) {
	return 0x0E === getStatus(data, offset)
}

export function getTempo(data, offset) {
	let tempo = (data.getUint8(offset) << 16) +
		(data.getUint8(offset + 1) << 8) +
		(data.getUint8(offset + 1))
	return {
		data: 6 * 1E6 / tempo,
		next() {
			return offset + 3
		},
		offset
	}
}

export function getNoteValue(data, offset) {
	const notes = [
		'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
	], n = data.getUint8(offset)
	return notes[n%12]
}

export function getNoteOctave(data, offset) {
	return Math.floor(data.getUint8(offset) / 12 - 1)
}

export function getNote(data, offset) {
	return {
		note: {
			value: getNoteValue(data, offset),
			octave: getNoteOctave(data, offset),
			velocity: data.getUint8(offset + 1)
		},
		next() {
			return offset + 2
		},
		offset
	}
}

export function getNoteAftertouch(data, offset){
	return {
		note: getNoteValue(data, offset),
		value: data.getUint8(offset + 1)
	}
}

export function getControlChange(data, offset){
	return {
		control: data.getUint8(offset),
		value: data.getUint8(offset)
	}
}

export function getProgramChange(data, offset){
	return {
		value: data.getUint8(offset)
	}
}

export function getChannelAftertouch(data, offset){
	return {
		value: data.getUint8(offset)
	}
}

export function getPitchBend(data, offset){
	return {
		b1: data.getUint8(offset),
		b2: data.getUint8(offset)
	}
}

export function getString(data, offset, length) {
	return times(length, i => String.fromCharCode(data.getUint8(offset + i)))
		.join('')
}

export const Meta = Object.freeze({
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
})

export default function MidiFile(data) {

	return {

		header() {
			return {
				data: {
					type: getString(data, 0, 4),
					format: data.getUint16(data, 8),
					tracks: data.getUint16(data, 10),
					division: data.getUint16(data, 12)
				},
				next() {
					return 14
				},
				offset: 0
			}
		},

		nextTrack(offset) {
			while (!isEof(data, offset)) {
				if (isNewTrack(data, offset)) {
					return {
						data: {
							length: data.getUint32(offset + 4)
						},
						offset: offset + 8
					}
				}
				offset += 4;
			}
			return null
		},

		nextEvent(offset) {
			if(isEof(data, offset)){
				return null
			}
			const deltatime = getVariableLengthValue(data, offset)
			return {
				deltatime: deltatime.data,
				event: null,
				offset: deltatime.offset + 1
			}
		},

		isNoteOnEvent(offset) {
			return 0x09 === data.getUint8(offset) >> 4;
		},

		isNoteOffEvent(offset) {
			return 0x08 === data.getUint8(offset) >> 4;
		},

		isMetaEvent(offset) {
			return 0xFF === data.getUint8(offset)
		}

	}
}
