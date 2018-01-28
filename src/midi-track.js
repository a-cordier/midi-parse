import { MidiEvent } from './midi-event'
import { Meta } from './meta-event'
import { getString } from './midi-file'
import { RunningStatus } from './running-status'

export function MidiTrack(data, offset) { /* eslint-disable no-param-reassign, no-shadow */
	const header = {
		type: getString(data, offset, 4),
		length: data.getUint32(offset + 4),
		next: offset + 8,
	}

	if ('MTrk' !== header.type) {
		throw new Error('Bad MIDI track format')
	}

	offset = header.next

	const events = ((offset) => {
		const events = []
		for (;;) {
			const event = MidiEvent(data, offset)
			events.push(event)
			if (Meta.END_OF_TRACK === event.type) {
				RunningStatus.reset()
				return events
			}
			offset = event.next
		}
	})(offset)

	return {
		events,
		/*
		 *track length expressed in bytes
		 */
		get length() {
			return header.length
		},
	}
}
