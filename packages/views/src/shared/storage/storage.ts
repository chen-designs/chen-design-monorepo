export interface StoreOptions {
	prefix?: string
	store?: Storage
}

export default class WebStore {
	private prefix = String('STORE')

	private store: Storage = localStorage

	constructor(options: StoreOptions) {}

	set(key: string, value: any, expire = 0) {}

	get(key: string, defValue: any) {}

	remove(key: string) {}

	clear() {}
}
