import { getString, times } from './utils';
import { MidiTrack } from './midi-track';

export function MidiFile(buffer) {
	const data = new DataView(buffer, 0, buffer.length);
	const header = {
		type: getString(data, 0, 4),
		length: data.getUint32(4),
		format: data.getUint16(8),
		tracks: data.getUint16(10),
		division: data.getUint16(12),
		next: 14,
	};

	if ('MThd' !== header.type) {
		throw new Error('Bad MIDI file format');
	}

	let offset = header.next;
	const tracks = times(() => {
		const track = MidiTrack(data, offset);
		offset += (track.length + 8); // track data length + track header length
		return track;
	}, header.tracks);
	return Object.assign({ header }, { tracks });
}
