import { expose } from '../../utils/config'
import Diagram from './diagram.vue'
import DiagramViewport from './diagram-viewport.vue'
import DiagramCtxmenu from './diagram-ctxmenu'

export default expose(Diagram, DiagramViewport, DiagramCtxmenu)

export { Diagram, DiagramViewport, DiagramCtxmenu }
