import { DiagramInstance } from '../context'
import { defaultNodeTemplate } from './node-templates'
import { defaultLinkTemplate } from './link-templates'

export default function createTemplates(instance: DiagramInstance) {
	console.info('createTemplates : ', instance)
	// 创建节点模版
	instance.nodemap(null, defaultNodeTemplate)
	// 创建关系模版
	instance.linkmap(null, defaultLinkTemplate)
}
