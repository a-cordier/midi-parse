export const RunningStatus = (() => {
	let status = null
	return {
		reset() {
			status = null
		},
		get status() {
			return status
		},
		set status(value) {
			status = value
		}
	}
})()
