import { expose } from '../../utils/config'
import Resizer from './resizer'

export default expose(Resizer)

export { Resizer }

export type ResizerInstance = InstanceType<typeof Resizer>
