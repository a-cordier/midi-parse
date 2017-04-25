import {
  isVariableLengthValueDelimiter,
  getVariableLengthValue,
  getTempo,
  isNoteOnMessage,
  default as MidiFile
} from 'midi-file';
import 'style.scss';

const fileInput = document.querySelector('#midi-file');
fileInput.addEventListener('change', function(e) {
	console.log(this.files[0].name)
	const reader = new FileReader();
	reader.onload = e => {
		console.log(e.target.result, 0, e.target.result.byteLength)
		let data = new DataView(e.target.result, 0, e.target.result.byteLength)
		let parser = MidiFile(data)
		let offset = 0
		const header = parser.header()
		console.log(header.data)
		offset = header.next()
		let track = parser.nextTrack(offset)
		console.log(track)
		offset = parser.nextTrack(offset).offset
		let delta = getVariableLengthValue(data, offset)
		offset = delta.next()
		console.log(getTempo(data, offset + 3))
		track = parser.nextTrack(offset);
		console.log(track)
	}
	reader.readAsArrayBuffer(this.files[0]);
})
	console.log('test')
