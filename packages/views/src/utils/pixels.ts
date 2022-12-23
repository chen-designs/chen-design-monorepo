export function val2px(value: string | number | undefined, unit = 'px') {
	if (!/^\d+$/.test(`${value ?? ''}`)) return value

	const pixel = parseFloat(`${value ?? ''}`) || 0

	if (pixel >= 0 && pixel <= 1) return `${pixel * 100.0}%`

	return `${pixel}${unit}`
}
