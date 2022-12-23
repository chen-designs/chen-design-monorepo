import { Binding, Link, Point, Shape, Size } from 'gojs'
import { createLink, createText } from '../utils/makes'
import type { LinkOptions } from '../utils/types'
import { $ } from '../utils/methods'

// 创建默认关系模板
export function defaultLinkTemplate(options: LinkOptions) {
	return createLink(
		options,
		// 连线样式
		$(
			Shape,
			'RoundedRectangle',
			{ strokeWidth: 2, stroke: options.border, fill: 'transparent' },
			new Binding('stroke', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
			new Binding('stroke', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject()
		),
		$(
			Shape,
			{ visible: false, fromArrow: 'Backward', strokeWidth: 2, stroke: options.border, fill: 'transparent' },
			new Binding('fromArrow', 'fromArrow'),
			new Binding('visible', 'startArrow', value => !!value),
			new Binding('stroke', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
			new Binding('stroke', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject(),
			new Binding('fill', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
			new Binding('fill', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject()
		),
		$(
			Shape,
			{ visible: true, toArrow: 'Standard', strokeWidth: 2, stroke: options.border, fill: 'transparent' },
			new Binding('toArrow', 'toArrow'),
			new Binding('visible', 'endArrow', value => !!value),
			new Binding('stroke', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
			new Binding('stroke', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject(),
			new Binding('fill', 'isSelected', value => (value ? options.active : options.border)).ofObject(),
			new Binding('fill', 'isHighlighted', (value, { part }) => (value ? options.light : part.isSelected ? options.active : options.border)).ofObject()
		),
		// 文案内容
		createText(
			{ maxLines: 1, maxSize: new Size(200, 26), stroke: options.color, font: options.font, segmentOffset: new Point(0, -12), segmentOrientation: Link.OrientUpright },
			new Binding('text', 'text'),
			new Binding('stroke', 'isSelected', value => (value ? options.active : options.color)).ofObject(),
			new Binding('background', 'isSelected', value => (value ? options.background : 'transparent')).ofObject()
		)
	)
}
