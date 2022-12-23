import { expose } from '../../utils/config'
import Space from './space'

export default expose(Space)

export { Space }

export type SpaceInstance = InstanceType<typeof Space>
