import { expose } from '../../utils/config'
import Dropdown from './dropdown'
import DropDivider from './drop-divider'
import DropGroup from './drop-group'
import DropOption from './drop-option'
import DropSubmenu from './drop-submenu'

export default expose(Dropdown, DropDivider, DropGroup, DropOption, DropSubmenu)

export { Dropdown, DropDivider, DropGroup, DropOption, DropSubmenu }

export type { IDropdownInstence } from './context'
