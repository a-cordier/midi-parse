
import test, { ExecutionContext } from 'ava';
import { MidiStatus } from '../index.js';

import * as UTILS from "./utils.js";

test('getDataView should return a data view with second byte set at 128', (t: ExecutionContext<unknown>) => {
	const view = UTILS.getDataView([0, 128]);
    t.is(128, view.getUint8(1));
});

test('isRunningStatusChange should return true if first bit is set', (t: ExecutionContext<unknown>) => {
	const view = UTILS.getDataView([0b10000000]);
	t.true(UTILS.isRunningStatusChange(view, 0));
});

test('readBytes should return an array of bytes', (t: ExecutionContext<unknown>) => {
	const view = UTILS.getDataView([0b10101010, 0b10101010]);
    const bytes = UTILS.readBytes(view, 0, 2);
	t.is(2, bytes.length);
    t.is(0b10101010, bytes.shift());
    t.is(0b10101010, bytes.pop());
});

test('readString should return MTrk', (t) => {
    const bytes = 'MTrk'.split('').map(char => char.charCodeAt(0));
	const view = UTILS.getDataView(bytes);
	const str = UTILS.readString(view, 0, 4);
	t.is('MTrk', str);
});

test('isVariableLengthValueDelimiter should return true if bit 7 in byte is set to 1', (t: ExecutionContext<unknown>) => {
    t.true(UTILS.isVariableLengthQuantityDelimiter(0b00000010));
});

test('readVariableLengthQuantity  should throw error if delimiter is not found before a 4 bytes read', (t: ExecutionContext<unknown>) => {
	const bytes = [128, 128, 128, 128, 0b00000010];
	const view = UTILS.getDataView(bytes);
	t.throws(() => UTILS.readVariableLengthQuantity(view, 0));
});

test('readVariableLengthQuantity should return 127 for 0x7F', (t: ExecutionContext<unknown>) => {
    const bytes = [0x7F];
    const view = UTILS.getDataView(bytes);
    t.is(127, UTILS.readVariableLengthQuantity(view, 0).value);
});

test('readVariableLengthQuantity should return 0 for 0x00', (t: ExecutionContext<unknown>) => {
    const bytes = [0x00];
    const view = UTILS.getDataView(bytes);
    t.is(0, UTILS.readVariableLengthQuantity(view, 0).value);
});

test('readVariableLengthQuantity should return 128 for 0x81|0x00', (t: ExecutionContext<unknown>) => {
    const bytes = [0b10000001, 0b00000000];
    const view = UTILS.getDataView(bytes);
    t.is(128, UTILS.readVariableLengthQuantity(view, 0).value);
});

test('readVariableLengthQuantity should return 8192 for 0xC0|0x00', (t: ExecutionContext<unknown>) => {
    const bytes = [0b11000000, 0];
    const view = UTILS.getDataView(bytes);
    t.is(8192, UTILS.readVariableLengthQuantity(view, 0).value);
});

test('newMIDIUint8Array should return a Uint8Array of length 3', (t: ExecutionContext<unknown>) => {
    t.is(3, UTILS.newMIDIUint8Array().length);
});

test('writeChannelStatusByte should return a Note On MIDI status directed to channel 1', (t: ExecutionContext<unknown>) => {
    const midiStatus = UTILS.writeChannelStatusByte(MidiStatus.NOTE_ON, 1);
    t.is(0b10010000, midiStatus);
});

test('writeSystemStatusByte should be an identity function',  (t: ExecutionContext<unknown>) => {
    t.is(MidiStatus.SET_TEMPO, UTILS.writeSystemStatusByte(MidiStatus.SET_TEMPO));
});

test('isSystemMessage should return true for all bits in byte are set to 1',(t: ExecutionContext<unknown>) => {
    const view = UTILS.getDataView([0b11111111])
    t.true(UTILS.isSystemMessage(view, 0));
});

