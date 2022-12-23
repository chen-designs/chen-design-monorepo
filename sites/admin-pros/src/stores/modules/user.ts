import { IUser } from './types'
import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
	state: (): IUser => ({})
})

export default userStore
