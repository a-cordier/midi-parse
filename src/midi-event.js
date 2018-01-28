import { MidiMessage } from './midi-message'
import { MetaEvent } from './meta-event'

export function isMetaEvent(data, offset) {
	return 0xFF === data.getUint8(offset)
}

export function isSysexMessage(data, offset) {
	const value = data.getUint8(offset)
	return 0xF0 === value || 0xF7 === value
}

/**
 * Assert variable length quantity property [Most Significant bit = 0]
 */
export function isVariableLengthQuantityDelimiter(value) {
	return 0 === (0x80 & value)
}

export function getVariableLengthQuantity(data, offset) { /* eslint-disable no-plusplus */
	let [val, currentByteValue] = [0, 0]
	for (let i = 0; i < 4; i++) {
		currentByteValue = data.getUint8(offset + i)
		if (isVariableLengthQuantityDelimiter(currentByteValue)) {
			return {
				value: val + currentByteValue,
				next: offset + i + 1,
			}
		}
		val += (currentByteValue & 0x7f)
		val <<= 7
	}
	throw new RangeError('4 bytes variable length value limit exceded')
}

export function MidiEvent(data, offset) { /* eslint-disable no-param-reassign */
	const deltaTime = getVariableLengthQuantity(data, offset)
	const event = {
		delta: deltaTime.value,
	}
	offset = deltaTime.next
	if (isMetaEvent(data, offset)) {
		return Object.assign(MetaEvent(data, offset), event)
	}
	if (isSysexMessage(data, offset)) {
		throw new Error('Sysex messages are not implemented yet')
	}
	return Object.assign(MidiMessage(data, offset), event)
}
