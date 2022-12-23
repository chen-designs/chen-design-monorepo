import { expose } from '../../utils/config'
import Empty from './empty.vue'

export default expose(Empty)

export { Empty }

export type EmptyInstance = InstanceType<typeof Empty>
