import { InjectionKey, Ref } from 'vue'
import { Size } from '../../utils/types'

export interface ISkeletonContext {
	size: Ref<Size | undefined>
}

export const ISKELETON_KEY: InjectionKey<ISkeletonContext> = Symbol('SKELETON_INJECTION_KEY')

export const Types = ['title', 'text', 'shape', 'circle', 'button', 'input', 'image'] as const
