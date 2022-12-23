import { expose } from '../../utils/config'
import Tooltip from './tooltip'

export default expose(Tooltip)

export { Tooltip }

export type TooltipInstance = InstanceType<typeof Tooltip>
