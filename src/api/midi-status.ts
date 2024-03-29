export enum MidiStatus {
    // SYSTEM MESSAGES
    SEQUENCE_NUMBER = 0x00,
    TEXT_EVENT = 0x01,
    COPYRIGHT_NOTICE = 0x02,
    SEQUENCE_NAME = 0x03,
    INSTRUMENT_NAME = 0x04,
    LYRIC = 0x05,
    MARKER = 0x06,
    CUE_POINT = 0x07,
    MIDI_CHANNEL_PREFIX = 0x20,
    END_OF_TRACK = 0x2f,
    SET_TEMPO = 0x51,
    SMPTE_OFFSET = 0x54,
    TIME_SIGNATURE = 0x58,
    KEY_SIGNATURE = 0x59,
    SPECIFIC = 0x7f,
    SYSEX_MESSAGE = 0xf0,
    // CHANNEL MESSAGES
    NOTE_OFF = 0x08,
    NOTE_ON = 0x09,
    NOTE_AFTER_TOUCH = 0x0a,
    CONTROL_CHANGE = 0x0b,
    PROGRAM_CHANGE = 0x0c,
    CHANNEL_AFTER_TOUCH = 0x0d,
    PITCH_BEND = 0x0e,
}
