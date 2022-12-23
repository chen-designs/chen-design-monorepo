class ViewError extends Error {
	constructor(m: string) {
		super(m)
		this.name = 'ElementPlusError'
	}
}

export function throwError(scope: string, m: string): never {
	throw new ViewError(`[${scope}] ${m}`)
}
