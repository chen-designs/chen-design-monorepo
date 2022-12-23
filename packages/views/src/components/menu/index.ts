import { expose } from '../../utils/config'
import Menu from './menu'
import MenuItem from './menu-item'
import MenuGroup from './menu-group'
import MenuSubmenu from './menu-submenu'

export default expose(Menu, MenuItem, MenuGroup, MenuSubmenu)

export { Menu, MenuItem, MenuGroup, MenuSubmenu }

export type MenuInstance = InstanceType<typeof Menu>
export type MenuItemInstance = InstanceType<typeof MenuItem>
export type MenuGroupInstance = InstanceType<typeof MenuGroup>
export type MenuSubmenuInstance = InstanceType<typeof MenuSubmenu>
