import { Panel, Shape, Spot, Binding, Picture } from 'gojs'
import { createNode, createText } from '../utils/makes'
import type { NodeOptions } from '../utils/types'
import { $ } from '../utils/methods'

// 创建默认节点模板
export function defaultNodeTemplate(options: NodeOptions) {
	return createNode(
		'Vertical',
		options,
		// 创建节点图片
		$(
			Panel,
			'Spot',
			{ name: 'NODE', defaultAlignment: Spot.Center, isPanelMain: true },
			$(
				Shape,
				options.shape,
				{ stroke: options.border, strokeWidth: 4, fill: 'transparent', width: options.size + 8, height: options.size + 8 },
				new Binding('figure', 'main', value => (value ? options.shapeIsMain : options.shape)),
				new Binding('stroke', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
				new Binding('stroke', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject()
			),
			// 节点图片
			$(
				Panel,
				'Spot',
				{ defaultAlignment: Spot.Center, isClipping: true },
				$(Shape, 'Circle', { width: options.size, height: options.size }, new Binding('figure', 'main', value => (value ? 'RoundedRectangle' : 'Circle'))),
				$(Shape, { figure: 'Circle', strokeWidth: 0, fill: options.background }, new Binding('figure', 'main', value => (value ? 'RoundedRectangle' : 'Circle'))),
				$(Picture, { width: options.size, height: options.size }, new Binding('source', 'image'))
			)
		),
		// 创建节点文本
		$(
			Panel,
			'Auto',
			{ defaultAlignment: Spot.Center, margin: 2 },
			$(Shape, 'RoundedRectangle', { strokeWidth: 1, stroke: 'transparent', fill: options.background }),
			// 文案内容
			createText(
				{ stroke: options.color, font: options.font },
				new Binding('text', 'text'),
				new Binding('stroke', 'isSelected', value => (value ? options.active : options.color)).ofObject()
			)
		)
	)
}
