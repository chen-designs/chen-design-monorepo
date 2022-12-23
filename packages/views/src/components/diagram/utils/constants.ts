export const VIEWPORT = Symbol('viewport')

export const OVERPORT = Symbol('overport')

export const EMITTER = Symbol('emitter')

export const EXISTS = Symbol('exists')

export const EVENTS = Object.freeze({
	UPDATE_AUTO_ZOOM: 'update:autoZoom',
	UPDATE_AUTO_RELAYOUT: 'update:autoRelayout',

	READY: 'ready',
	// 节点/关系事件
	NODE_ADD: 'add-nodes',
	LINK_ADD: 'add-links',
	REMOVES: 'removes',
	UPDATES: 'updates',
	// 选中相关
	SELECTION: 'selection',
	SELECTION_MOVED: 'selection-moved',
	// 清除事件
	CLEAR: 'clear',
	CLEAR_SELECTION: 'clear-selection',
	CLEAR_HIGHLIGHTE: 'clear-highlighte',
	// 数据模型事件
	MODEL_CHANGED: 'model-changed',
	// 其他事件
	RESIZE: 'resize',
	SHOW_PARTS: 'show-parts',
	HIDE_PARTS: 'hide-parts',
	UPDATE_LAYOUT: 'update-layout',
	FIXED_MOVABLE: 'fixed-movable',
	FIXED_LAYOUTED: 'fixed-layout',

	LAYOUT_CHANGE: 'layout-change',
	LAYOUT_COMPLETED: 'layout-completed',
	// 折叠展开
	TREE_EXPANDED: 'tree-expanded',
	TREE_COLLAPSED: 'tree-collapsed'
})
