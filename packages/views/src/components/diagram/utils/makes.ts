import { extend, omit } from 'lodash-es'
import { Diagram, Spot, ToolManager, ResizingTool, Part, Shape, Overview, Node, Link, PanelLayout, Binding, Group, TextBlock, Size, Margin } from 'gojs'
import { $ } from './methods'
import { createLayout } from './layouts'
import type { DiagramOptions, GroupOptions, LinkOptions, NodeOptions } from './types'

export function createDiagram(element: HTMLDivElement, { options, ...props }: DiagramOptions) {
	const defaults = {
		allowCopy: false,
		allowLink: false,
		allowSelect: true,
		allowDelete: false,
		allowRelink: false,
		allowResize: true,
		allowReshape: false,
		allowClipboard: false,
		allowZoom: props.allowZoom ?? true,
		initialAutoScale: Diagram.UniformToFill,
		initialViewportSpot: Spot.Center,
		initialContentAlignment: Spot.Center,
		contentAlignment: Spot.Center,
		allowHorizontalScroll: true,
		allowVerticalScroll: true,
		scrollMode: Diagram.InfiniteScroll,
		padding: props.edges || 100,
		scale: props.scale,
		minScale: Math.max(props.minScale || 0, 0.3),
		maxScale: Math.max(props.maxScale || 5, 5),
		defaultCursor: 'default',
		resizingTool: new ResizingTool(),
		['undoManager.isEnabled']: false,
		['toolManager.mouseWheelBehavior']: ToolManager.WheelZoom,
		['toolManager.hoverDelay']: 500,
		['toolManager.toolTipDuration']: 0,
		layout: createLayout(props.defaultLayout)
	}
	return $(Diagram, element, extend(defaults, omit(options, ['node', 'link', 'overview'])))
}

export function createOverview(element: HTMLDivElement, options: Overview) {
	const defaults = {
		contentAlignment: Spot.Center,
		drawsTemporaryLayers: false,
		box: $(Part, 'Auto', { selectionAdorned: false, cursor: 'pointer' }, $(Shape, 'Rectangle', { strokeWidth: 0, fill: 'rgba(0,0,0,0.3)' }))
	}
	return $(Overview, element, extend(defaults, options || {}))
}

export function createGroup({ zOrder }: GroupOptions, ...args: any[]) {
	return $(
		Group,
		new Binding('visible', 'visible', value => !!value),
		new Binding('opacity', 'opacity', value => value ?? 1),
		new Binding('zOrder', 'isSelected', value => (value ? Number.MAX_SAFE_INTEGER - 100 : zOrder)).ofObject(),
		new Binding('zOrder', 'isHighlighted', (value, { isSelected }) => (value || isSelected ? Number.MAX_SAFE_INTEGER - 100 : zOrder)).ofObject(),
		...args
	)
}

export function createNode(layout: PanelLayout | string, { zOrder }: NodeOptions, ...args: any[]) {
	return $(
		Node,
		layout || 'Vertical',
		{ zOrder, cursor: 'pointer', isLayoutPositioned: true, selectionAdorned: false, defaultAlignment: Spot.Center },
		new Binding('visible', 'visible', value => !!value),
		new Binding('opacity', 'opacity', value => value ?? 1),
		new Binding('movable', 'movable', value => !!value),
		new Binding('isLayoutPositioned', 'fixed', value => !!value),
		new Binding('zOrder', 'isSelected', value => (value ? Number.MAX_SAFE_INTEGER : zOrder)).ofObject(),
		new Binding('zOrder', 'isHighlighted', (value, { isSelected }) => (value || isSelected ? Number.MAX_SAFE_INTEGER : zOrder)).ofObject(),
		...args
	)
}

export function createLink({ zOrder }: LinkOptions, ...args: any[]) {
	return $(
		Link,
		{ routing: Link.Normal, curve: Link.None, corner: 0, fromShortLength: 8, toShortLength: 8, zOrder, cursor: 'pointer', selectionAdorned: false },
		new Binding('visible', 'visible', value => !!value),
		new Binding('opacity', 'opacity', value => value ?? 1),
		new Binding('zOrder', 'isSelected', value => (value ? Number.MAX_SAFE_INTEGER - 100 : zOrder)).ofObject(),
		new Binding('zOrder', 'isHighlighted', (value, { isSelected }) => (value || isSelected ? Number.MAX_SAFE_INTEGER - 100 : zOrder)).ofObject(),
		...args
	)
}

export function createText(...args: any[]) {
	return $(
		TextBlock,
		{
			isMultiline: true,
			wrap: TextBlock.WrapBreakAll,
			overflow: TextBlock.OverflowEllipsis,
			// font: DEFAULT_OPTIONS.font,
			verticalAlignment: Spot.Center,
			textAlign: 'center',
			editable: false,
			maxLines: 3,
			minSize: new Size(60, 22),
			maxSize: new Size(160, 3 * 22 + 6),
			margin: new Margin(1, 2, 1, 2),
			text: 'TextBlock'
		},
		...args
	)
}

export function make() {}
