import { expose } from '../../utils/config'
import Scrollbar from './scrollbar'

export default expose(Scrollbar)

export { Scrollbar }

export type ScrollbarInstance = InstanceType<typeof Scrollbar>
