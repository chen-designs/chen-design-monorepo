import { InjectionKey } from 'vue'
import { Size } from '../../utils/constant'

export interface ConfigProvider {
	size?: Size
}

export const ICONFIG_PROVIDER_KEY: InjectionKey<ConfigProvider> = Symbol('INJECTION_CONFIG_PROVIDER_KEY')
