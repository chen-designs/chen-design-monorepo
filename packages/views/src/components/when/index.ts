import { expose } from '../../utils/config'
import When from './when'

export default expose(When)

export { When }

export type WhenInstance = InstanceType<typeof When>
