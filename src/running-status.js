export const RunningStatus = (() => {
	let status = null;
	let channel = null;
	return {
		reset() {
			status = null;
		},
		get status() {
			return status;
		},
		set status(value) {
			status = value;
		},
		get channel() {
			return channel;
		},
		set channel(value) {
			channel = value;
		},
	};
})();
