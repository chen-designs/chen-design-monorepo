import { IconOptions } from '../../utils/options'
import { expose } from '../../utils/config'
import Icon from './icon'
import IconSwitcher from './icon-switcher'

export default expose<IconOptions>(Icon, IconSwitcher)

export { Icon, IconSwitcher }

export type IconInstance = InstanceType<typeof Icon>
export type IconSwitcherInstance = InstanceType<typeof IconSwitcher>
