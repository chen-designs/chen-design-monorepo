import { expose } from '../../utils/config'
import ClientTeleport from './client-teleport'

export default expose(ClientTeleport)

export { ClientTeleport }

export type ClientTeleportInstance = InstanceType<typeof ClientTeleport>
