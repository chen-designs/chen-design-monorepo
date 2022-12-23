import { defaults, camelCase, trim, isFunction, noop } from 'lodash-es'
import { Layout, ForceDirectedLayout, LayeredDigraphLayout, TreeLayout, GridLayout, CircularLayout, Size } from 'gojs'
import { Data } from '../../../utils/types'
import { LayoutType } from './types'
import { $, set } from './methods'

export function createForceLayout(options: Data) {
	return $(
		ForceDirectedLayout,
		defaults(options || {}, {
			setsPortSpots: false,
			defaultSpringLength: 10,
			defaultElectricalCharge: 100
		})
	)
}

export function createLayeredLayout(options: Data) {
	return $(
		LayeredDigraphLayout,
		defaults(options || {}, {
			direction: 90,
			layerSpacing: 50,
			columnSpacing: 50,
			setsPortSpots: false,
			packOption: LayeredDigraphLayout.PackExpand,
			aggressiveOption: LayeredDigraphLayout.AggressiveNone,
			layeringOption: LayeredDigraphLayout.LayerLongestPathSource
		})
	)
}

export function createTreeLayout(options: Data) {
	return $(
		TreeLayout,
		defaults(options || {}, {
			angle: 90,
			nodeSpacing: 15,
			layerSpacing: 50,
			setsPortSpot: false,
			setsChildPortSpot: false,
			compaction: TreeLayout.CompactionNone,
			alignment: TreeLayout.AlignmentCenterChildren
		})
	)
}

export function createGridLayout(options: Data) {
	return $(
		GridLayout,
		defaults(options || {}, {
			spacing: new Size(50, 50),
			cellSize: new Size(250, 250)
		})
	)
}

export function createCircularLayout(options: Data) {
	return $(CircularLayout, defaults(options || {}, { spacing: 100 }))
}

export function createLayout(name: LayoutType = 'default', generateLayout?: (options?: Data) => Layout, options?: Data) {
	// 布局生成函数映射
	const mappers: { [k in LayoutType]: (init: any) => any } = {
		default: createForceLayout,
		forceLayout: createForceLayout,
		layeredLayout: createLayeredLayout,
		treeLayout: createTreeLayout,
		gridLayout: createGridLayout,
		circularLayout: createCircularLayout
	}
	// 布局名称
	const clsname = camelCase(trim(name || 'default')) as LayoutType
	// 获取布局生成器
	const makeLayout = (isFunction(generateLayout) ? generateLayout : mappers[clsname]) || noop
	// 创建布局
	const layout = makeLayout(options || {})
	// 判断 layout 是否继承自 go.Layout
	if (!(layout instanceof Layout)) return
	// 设置布局名称
	if (layout instanceof Layout) set(layout, 'clsname', clsname)
	// 返回布局
	return layout
}
