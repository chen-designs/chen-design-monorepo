export const THUMB_MIN_SIZE = 12
export const TRACK_SIZE = 8

export interface ThumbData {
	ratio: number
	thumbSize: number
	max: number
}

export interface ThumbMap {
	size: 'width' | 'height'
	direction: 'left' | 'top'
	offset: 'offsetWidth' | 'offsetHeight'
	client: 'clientX' | 'clientY'
}

export interface ScrollbarProps {
	type: 'track' | 'embed'
	outerClass: any
	outerStyle: any
}
