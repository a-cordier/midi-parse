import MidiMessage from 'midi-message'
import MetaEvent from 'meta-event'

export function isMetaEvent(data, offset) {
	return 0xFF === data.getUint8(offset)
}

export function isSysexMessage(data, offset) {
	const value = data.getUint8(offset)
	return 0xF0 === value || 0xF7  === value
}

/**
 * Assert variable length quantity property [Most Significant bit = 0]
 */
export function isVariableLengthValueDelimiter(value) {
	return 0 === (0x80 & value)
}

export function getVariableLengthValue(data, offset) {
	let [val, currentByteValue] = [0, 0]
	for (let idx = 0; idx < 4; idx++) {
		currentByteValue = data.getUint8(offset + idx)
		if (isVariableLengthValueDelimiter(currentByteValue)) {
			return {
				value: val + currentByteValue,
				next: offset + idx + 1,
			}
		}
		val += (currentByteValue & 0x7f)
		val <<= 7
	}
	throw new RangeError('variable length value limit exceded')
}

export default function MidiEvent(data, offset) {
	const deltatime = getVariableLengthValue(data, offset)
	const event = {
		time: deltatime.value
	}
	offset = deltatime.next
	if(isMetaEvent(data, offset)) {
		return Object.assign(MetaEvent(data, offset), event)
	}
	if(isSysexMessage(data, offset)) {
		throw new Error('Sysex messages are not implemented yet')
	}
	return Object.assign(MidiMessage(data, offset), event)
}
