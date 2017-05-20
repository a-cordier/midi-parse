# midi-parse

Yet Another Javascript MidiFile Parser.

# Usage

## Parsing a midi file
```javascript
import { MidiFile, Status, Meta } from 'midi-parse';

const fileInput = document.querySelector('#midi-file')
const eventTypes = Object.assign({}, Meta, Status)

fileInput.addEventListener('change', function() {
	const reader = new FileReader()
	reader.onload = e => {
		/* MidFile factory expects a DataView object */
		let data = new DataView(e.target.result, 0, e.target.result.byteLength)
		let midiFile = MidiFile(data)
		/* Midi event type field is the 8 bit value given by the spec.
		One can get a human readable value using the Status (for midi messsages) and
		the Meta (for meta events) constant. */
		midiFile.tracks = midiFile.tracks
			.map(track => {
				track.events
					.forEach((event) => {
						event.type = Object.keys(eventTypes).find(key => eventTypes[key] === event.type)
					})
				return track
			})
		console.log(JSON.stringify(midiFile, undefined, 4))
	}
	reader.readAsArrayBuffer(this.files[0])
})
```

## result

```json
{
    "tracks": [
        {
            "events": [
                {
                    "type": "SPECIFIC",
                    "data": [
                        4,
                        2,
                        24,
                        8
                    ],
                    "next": 30,
                    "delta": 0
                },
                {
                    "type": "END_OF_TRACK",
                    "next": 34,
                    "delta": 0
                }
            ],
            "length": 12
        },
        {
            "events": [
                {
                    "type": "SPECIFIC",
                    "data": [
                        51,
                        120,
                        32,
                        79,
                        115,
                        99,
                        32,
                        35,
                        50,
                        32,
                        52
                    ],
                    "next": 90,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 10,
                        "value": 64
                    },
                    "next": 94,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 7,
                        "value": 100
                    },
                    "next": 98,
                    "delta": 0
                },
                {
                    "type": "PITCH_BEND",
                    "b1": 0,
                    "b2": 0,
                    "next": 102,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 101,
                        "value": 0
                    },
                    "next": 106,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 100,
                        "value": 0
                    },
                    "next": 110,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 6,
                        "value": 12
                    },
                    "next": 114,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 10,
                        "value": 64
                    },
                    "next": 118,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 7,
                        "value": 100
                    },
                    "next": 122,
                    "delta": 0
                },
                {
                    "type": "PITCH_BEND",
                    "b1": 0,
                    "b2": 0,
                    "next": 126,
                    "delta": 0
                },
                {
                    "type": "PROGRAM_CHANGE",
                    "value": 0,
                    "next": 129,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 101,
                        "value": 0
                    },
                    "next": 133,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 100,
                        "value": 0
                    },
                    "next": 137,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 6,
                        "value": 12
                    },
                    "next": 141,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 10,
                        "value": 64
                    },
                    "next": 145,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 7,
                        "value": 100
                    },
                    "next": 149,
                    "delta": 0
                },
                {
                    "type": "PITCH_BEND",
                    "b1": 0,
                    "b2": 0,
                    "next": 153,
                    "delta": 0
                },
                {
                    "type": "PROGRAM_CHANGE",
                    "value": 0,
                    "next": 156,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 101,
                        "value": 0
                    },
                    "next": 160,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 100,
                        "value": 0
                    },
                    "next": 164,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 6,
                        "value": 12
                    },
                    "next": 168,
                    "delta": 0
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 10,
                        "value": 64
                    },
                    "next": 172,
                    "delta": 0
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 111
                    },
                    "next": 187,
                    "type": "NOTE_ON",
                    "delta": 0
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 191,
                    "type": "NOTE_OFF",
                    "delta": 44
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 105
                    },
                    "next": 195,
                    "type": "NOTE_ON",
                    "delta": 28
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 199,
                    "type": "NOTE_OFF",
                    "delta": 21
                },
                {
                    "data": {
                        "value": "A#",
                        "octave": 5,
                        "velocity": 105
                    },
                    "next": 203,
                    "type": "NOTE_ON",
                    "delta": 3
                },
                {
                    "data": {
                        "value": "A#",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 207,
                    "type": "NOTE_OFF",
                    "delta": 117
                },
                {
                    "data": {
                        "value": "A#",
                        "octave": 5,
                        "velocity": 109
                    },
                    "next": 211,
                    "type": "NOTE_ON",
                    "delta": 3
                },
                {
                    "data": {
                        "value": "A",
                        "octave": 5,
                        "velocity": 101
                    },
                    "next": 215,
                    "type": "NOTE_ON",
                    "delta": 48
                },
                {
                    "data": {
                        "value": "A#",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 219,
                    "type": "NOTE_OFF",
                    "delta": 5
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 84
                    },
                    "next": 223,
                    "type": "NOTE_ON",
                    "delta": 43
                },
                {
                    "data": {
                        "value": "A",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 227,
                    "type": "NOTE_OFF",
                    "delta": 12
                },
                {
                    "data": {
                        "value": "F",
                        "octave": 5,
                        "velocity": 84
                    },
                    "next": 231,
                    "type": "NOTE_ON",
                    "delta": 36
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 235,
                    "type": "NOTE_OFF",
                    "delta": 24
                },
                {
                    "data": {
                        "value": "A",
                        "octave": 5,
                        "velocity": 84
                    },
                    "next": 239,
                    "type": "NOTE_ON",
                    "delta": 24
                },
                {
                    "data": {
                        "value": "F",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 243,
                    "type": "NOTE_OFF",
                    "delta": 24
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 84
                    },
                    "next": 247,
                    "type": "NOTE_ON",
                    "delta": 12
                },
                {
                    "data": {
                        "value": "A",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 251,
                    "type": "NOTE_OFF",
                    "delta": 36
                },
                {
                    "data": {
                        "value": "G",
                        "octave": 5,
                        "velocity": 0
                    },
                    "next": 256,
                    "type": "NOTE_OFF",
                    "delta": 252
                },
                {
                    "type": "CONTROL_CHANGE",
                    "data": {
                        "control": 7,
                        "value": 100
                    },
                    "next": 330,
                    "delta": 0
                },
                {
                    "type": "PITCH_BEND",
                    "b1": 0,
                    "b2": 0,
                    "next": 334,
                    "delta": 0
                },
                {
                    "type": "PROGRAM_CHANGE",
                    "value": 0,
                    "next": 337,
                    "delta": 0
                },
                {
                    "type": "END_OF_TRACK",
                    "next": 341,
                    "delta": 0
                }
            ],
            "length": 266
        }
    ],
    "division": 96
}
```

## The MIDI file specification

http://www.somascape.org/midi/tech/mfile.html
