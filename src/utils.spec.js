import test from 'ava'
import { times } from 'ramda'
import {
	isRunningStatus, getBytes, getString, isNewTrack, isEof, isVariableLengthQuantityDelimiter,
	isMetaEvent, getVariableLengthQuantity, isSysexMessage
} from './utils'

function getDataView(bytes = [0]) {
	const buffer = new ArrayBuffer(bytes.length)
	const dataView = new DataView(buffer)
	times(i => dataView.setUint8(i, bytes[i]), bytes.length)
	return dataView
}

test('Top bit being set identifies running status', (t) => {
	const data = getDataView([parseInt('10000000', 2)])
	t.true(isRunningStatus(data, 0))
})

test('Get bytes returns an array of bytes', (t) => {
	const bits = '10101010'
	const data = getDataView([parseInt(bits, 2)])
	t.is(parseInt(bits, 2), getBytes(data, 0, 1)[0])
})

test('Get String returns the right string', (t) => {
	const bits = '00100100'
	const data = getDataView([parseInt(bits, 2)])
	const str = getString(data, 0, 1)
	t.is(str, String.fromCharCode(parseInt(bits, 2)))
})

test('Is New Track returns true with MTrk', (t) => {
	const bytes = 'MTrk'.split('').map(char => char.charCodeAt(0))
	const data = getDataView(bytes)
	t.true(isNewTrack(data, 0))
})

test('Is New Track returns false if not passed MTrk', (t) => {
	const bytes = 'MTr#'.split('').map(char => char.charCodeAt(0))
	const data = getDataView(bytes)
	t.false(isNewTrack(data, 0))
})

test('Is EOF returns true if offset exceed data view boundaries', (t) => {
	const data = getDataView([0])
	t.true(isEof(data, 1))
})

test('Is variable length delimiter', (t) => {
	const data = getDataView([parseInt('10000000', 2)])
	t.true(isVariableLengthQuantityDelimiter(data, 0))
})

test('Is meta event returns true with 11111111', (t) => {
	const data = getDataView([255])
	t.true(isMetaEvent(data, 0))
})

test('Is meta event returns false with 11111110', (t) => {
	const data = getDataView([254])
	t.false(isMetaEvent(data, 0))
})

test('Get variable length quantity returns 127 with [128, 127]', (t) => {
	const bytes = [128, 127]
	const data  = getDataView(bytes)
	t.is(getVariableLengthQuantity(data, 0, 127), 127)
})

test('Get variable length quantity  throws error if it exceeds 4 bytes', (t) => {
	const bytes = [128, 128, 128, 128, 127]
	const data  = getDataView(bytes)
	t.throws(() => getVariableLengthQuantity(data, 0, 127))
})

test('Is sysex message returns true with [240]', (t) => {
	const bytes = [240]
	const data = getDataView(bytes, 0)
	t.true(isSysexMessage(data, 0))
})

test('Is sysex message returns true with [247]', (t) => {
	const bytes = [247]
	const data = getDataView(bytes, 0)
	t.true(isSysexMessage(data, 0))
})

