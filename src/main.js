import {
	default as MidiFile
} from 'midi-file'
import 'style.scss'
import {
	Meta
} from 'meta-event'
import {
	Status
} from 'midi-message'

const fileInput = document.querySelector('#midi-file')

const eventTypes = Object.assign({}, Meta, Status)

fileInput.addEventListener('change', function() {
	const reader = new FileReader()
	reader.onload = e => {
		let data = new DataView(e.target.result, 0, e.target.result.byteLength)
		let midiFile = MidiFile(data)
		midiFile.tracks = midiFile.tracks
			.map(track => {
				track.events
					.forEach((event) => {
						event.type = Object.keys(eventTypes).find(key => eventTypes[key] === event.type)
					})
				return track
			})
		let output = JSON.stringify(midiFile, undefined, 4)
		document.querySelector('.output').value = output
		document.querySelector('.output-block').classList.remove('hidden')
	}
	reader.readAsArrayBuffer(this.files[0])
})
