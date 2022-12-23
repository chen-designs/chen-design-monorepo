<template>
	<div ref="diagram" :class="clsprefix">
		<!-- 工具条 -->
		<div v-if="showToolbar || $slots.header || $slots.tools" :class="`${clsprefix}-toolbar`">
			<div v-if="$slots.header" :class="`${clsprefix}-toolbar-left`">
				<slot name="header"></slot>
			</div>
			<div v-if="showToolbar || $slots.tools" :class="`${clsprefix}-toolbar-right`">
				<ch-space split>
					<slot name="tools">
						<!-- 布局 -->
						<ch-dropdown :active="currentLayout" :options="layoutOptions" show-icon @click="(value: string) => layout(value as any)" @click-trigger="relayout()">
							<ch-icon name="icon-refresh" label="刷新布局"></ch-icon>
						</ch-dropdown>
						<!-- 全选 -->
						<ch-dropdown show-icon @click-trigger="select(true)">
							<ch-icon name="icon-select-all" label="全选"></ch-icon>
							<template #overlays>
								<ch-drop-option icon="icon-select-allno" label="取消" @click="clearSelection()"></ch-drop-option>
							</template>
						</ch-dropdown>
						<ch-icon name="icon-focus" label="聚焦" @click="focus()"></ch-icon>
						<!-- 导出 -->
						<ch-dropdown show-icon @click-trigger="makeImage()">
							<ch-icon name="icon-general-outline-apps" label="导出图片"></ch-icon>
							<template #overlays>
								<ch-drop-option icon="icon-general-outline-apps" label="导出数据"></ch-drop-option>
							</template>
						</ch-dropdown>
					</slot>
					<slot name="extra"></slot>
				</ch-space>
			</div>
		</div>
		<div :class="`${clsprefix}-container`">
			<!-- 可视图层 -->
			<div ref="viewport" :class="`${clsprefix}-viewport`"></div>
			<!-- 缩小图层 -->
			<div v-if="showOverview" :class="[`${clsprefix}-overview`, { collapsed: !showOvers }]">
				<div ref="overport" :class="`${clsprefix}-overport`"></div>
				<span :class="`${clsprefix}-trigger`" @click="showOvers = !showOvers">
					<ch-icon name="icon-resize-bottom-right"></ch-icon>
				</span>
			</div>
			<!-- 空内容提示 -->
			<ch-empty v-if="showEmpty" :description="emptyTips">
				<template #footer>
					<button @click="onTester">添加对象</button>
				</template>
			</ch-empty>
			<!-- 覆盖图层 -->
			<div :class="`${clsprefix}-coverlayers`">
				<slot name="default"></slot>
			</div>
		</div>
		<div v-if="$slots.footer" :class="`${clsprefix}-footer`">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { saveAs } from 'file-saver'
import Emitter from 'eventemitter3'
import {
	bind,
	camelCase,
	castArray,
	each,
	extend,
	filter,
	flatten,
	forOwn,
	isBoolean,
	isEmpty,
	isFunction,
	isPlainObject,
	isString,
	isUndefined,
	last,
	map,
	omit,
	partition,
	trim
} from 'lodash-es'
import { defineComponent, toRef, nextTick, PropType } from 'vue'
import {
	ChangedEvent,
	Key,
	Diagram,
	DiagramInitOptions,
	Overview,
	Model,
	GraphLinksModel,
	Node,
	Link,
	Part,
	Animation,
	List,
	Set,
	Rect,
	ObjectData,
	Layout,
	Size,
	Margin,
	Group
} from 'gojs'
import BaseMixin from '../../mixins/base-mixin'
import type { Func, Data, Nil } from '../../utils/types'
import { firstGroups } from '../../utils/object'
import { promiseify } from '../../utils/promise'
import { prefixName } from '../../utils/config'
import { useState } from '../../hooks'
import { genId } from '../../utils/id'
import type { DiagramOptions, GroupOptions, NodeOptions, LinkOptions, NodeData, LinkData, LayoutType, ImageOptions, FindMode, FindPathReult, TaskOptions } from './utils/types'
import { createDiagram, createOverview, createLayout, groupOptions, nodeOptions, linkOptions, findPaths } from './utils'
import { reduceIfexists, additionIfexists, removeIfexists } from './utils/helper'
import { VIEWPORT, OVERPORT, EMITTER, EVENTS } from './utils/constants'
import { defNode, defLink } from './utils/def-value'
import { exec, set, get } from './utils/methods'
import { EVENT_NAMES, bindEvents } from './utils/events'
import createTemplates from './templates'
import { IDRAGRAM_KEY, DiagramInstance } from './context'

import ChDropdown from '../dropdown'
import ChIcon from '../icon'
import ChSpace from '../space'
import ChEmpty from '../empty'

export default defineComponent({
	name: prefixName('Diagram'),
	components: { ChDropdown, ChIcon, ChSpace, ChEmpty },
	mixins: [BaseMixin],
	provide() {
		return {
			[IDRAGRAM_KEY as any]: this
		}
	},
	props: {
		/**
		 * 默认布局
		 */
		defaultLayout: { type: String, default: 'default' },
		/**
		 * 缩放
		 */
		scale: { type: Number, default: 1 },
		/**
		 * 最小缩放
		 */
		minScale: { type: Number, default: 0.01 },
		/**
		 * 最大缩放
		 */
		maxScale: { type: Number, default: 5 },
		/**
		 * 画布内边距
		 */
		edges: { type: Number, default: 100 },
		/**
		 * 鼠标缩放
		 */
		allowZoom: { type: Boolean, default: true },
		/**
		 * 是否自动缩放
		 */
		autoZoom: { type: Boolean, default: void 0 },
		defaultAutoZoom: { type: Boolean, default: false },
		/**
		 * 自动调整布局
		 */
		autoRelayout: { type: Boolean, default: void 0 },
		defaultAutoRelayout: { type: Boolean, default: true },
		/**
		 * 显示缩小图
		 */
		showOverview: { type: Boolean, default: true },
		/**
		 * 显示工具条
		 */
		showToolbar: { type: Boolean, default: true },
		/**
		 * 其他配置
		 */
		options: { type: Object as PropType<DiagramInitOptions>, default: () => ({}) },
		/**
		 * 空内容时的提示信息
		 */
		emptyTips: { type: String, default: '还没有内容哦, 快来加点吧...' },
		// 事件
		onReady: { type: Function, default: () => {} }
	},
	emits: [...EVENT_NAMES, ...Object.values(EVENTS)],
	setup: (props, { emit }) => {
		// 是否自动缩放
		const isAutoZoom = useState(toRef(props, 'autoZoom'), props.defaultAutoZoom, value => {
			emit(EVENTS.UPDATE_AUTO_ZOOM, value)
		})
		// 是否自动调整布局
		const isAutoRelayout = useState(toRef(props, 'autoRelayout'), props.defaultAutoRelayout, value => {
			emit(EVENTS.UPDATE_AUTO_RELAYOUT, value)
		})
		return { isAutoZoom, isAutoRelayout }
	},
	data() {
		return {
			// 是否已初始化
			initialize: false,
			// 当前布局
			currentLayout: this.defaultLayout,
			// 当前缩放
			currentScale: 1,
			// 是否显示缩略图
			showOvers: false,
			// 任务信息
			task: {},
			// 已存在节点/关系
			exists: {
				nids: new Map<Key, boolean>(),
				lids: new Map<Key, boolean>()
			},
			// 布局选项
			layoutOptions: [
				{ label: '默认布局', name: 'default', icon: 'icon-relation-force' },
				{ divider: true },
				{ label: '分层布局', name: 'layeredLayout', icon: 'icon-tree-binary' },
				{ label: '树形布局', name: 'treeLayout', icon: 'icon-tree' },
				{ label: '环形布局', name: 'circularLayout', icon: 'icon-relation' },
				{ label: '网格布局', name: 'gridLayout', icon: 'icon-grid' }
			]
		}
	},
	computed: {
		showEmpty() {
			return this.exists.nids.size == 0 && this.exists.lids.size === 0
		}
	},
	mounted() {
		// 初始化
		this.diagram(createDiagram(this.$refs.viewport as HTMLDivElement, this.$props as DiagramOptions))
			.overview(createOverview(this.$refs.overport as HTMLDivElement, { observed: get(this, VIEWPORT) } as Overview))
			.model(new GraphLinksModel())
			// 创建对象模版
			.use(createTemplates)
			// 绑定必要的事件
			.diagram((diagram: Diagram) => {
				bindEvents('DIAGRAM', diagram, this)
				diagram.addDiagramListener('LayoutCompleted', (...args: any[]) => this.fire(EVENTS.LAYOUT_COMPLETED, ...args))
				diagram.addDiagramListener('ChangedSelection', (...args: any[]) => this.fire(EVENTS.SELECTION, ...args))
				diagram.addDiagramListener('TreeExpanded', (...args: any[]) => this.fire(EVENTS.TREE_EXPANDED, ...args))
				diagram.addDiagramListener('TreeCollapsed', (...args: any[]) => this.fire(EVENTS.TREE_COLLAPSED, ...args))
				diagram.addDiagramListener('SelectionMoved', (...args: any[]) => {
					this.fire(EVENTS.SELECTION_MOVED, ...args)
					if (this.isAutoZoom) this.fit()
				})
				// 处理节点/关系删除
				diagram.addModelChangedListener((e: ChangedEvent) => {
					if (e.change === ChangedEvent.Property && /^(nodeDataArray|linkDataArray)$/.test(e.modelChange)) {
						// 先处理删除逻辑/后处理理新增逻辑
						removeIfexists(e.oldValue || [], this.exists, e.modelChange)
						additionIfexists(e.newValue || [], this.exists, e.modelChange)
					} else if (e.change === ChangedEvent.Insert && /^(nodeDataArray|linkDataArray)$/.test(e.modelChange)) {
						// 处理节点/关系新增
						additionIfexists(e.newValue || [], this.exists, e.modelChange)
					} else if (e.change === ChangedEvent.Remove && /^(nodeDataArray|linkDataArray)$/.test(e.modelChange)) {
						// 处理节点/关系删除
						removeIfexists(e.oldValue || [], this.exists, e.modelChange)
					} else if (e.change === ChangedEvent.Transaction && e.oldValue === 'clear') {
						// 清空数据
						this.exists.nids.clear()
						this.exists.lids.clear()
					}
				})
			})
			// 初始化
			.use((...args: any[]) => promiseify(this.onReady, ...args))
			.then(() => (this.initialize = true))
			.catch((err: any) => console.error(err))
			.finally(() => this.fit())
			.finally(() => console.info('初始化完成...'))
	},
	methods: {
		bridging(target: any) {
			const handler = (method: string, ...args: any[]) => {
				const result = get(this, method).apply(this, args)
				return result === this ? target : result
			}
			forOwn(this.$options.methods, (_, name) => {
				if (/^\$|^(bridging|fire)$/.test(name)) return
				extend(target || {}, { [`$${name}`]: bind(handler, null, name) })
			})
			return this
		},
		use(callback: (self: any, diagram: Diagram) => any) {
			return exec(this, callback, this, get(this, VIEWPORT))
		},
		diagram(handler?: Diagram | ((diagram: Diagram) => any)) {
			if (handler instanceof Diagram) return set(this, VIEWPORT, handler) as any
			return exec(this, handler, get(this, VIEWPORT))
		},
		overview(handler?: Overview | ((diagram: Overview) => any)) {
			if (handler instanceof Overview) return set(this, OVERPORT, handler)
			return exec(this, handler, get(this, OVERPORT))
		},
		model(model?: Model | ((model: Model) => any)) {
			return this.diagram(diagram => {
				if (isFunction(model)) return exec(this, model, diagram.model)
				// 设置数据模型
				else if (model instanceof Model) diagram.model = model
				else return diagram.model
			})
		},
		emitter(callback?: (emitter: Emitter) => any) {
			let emitter = get(this, EMITTER)
			if (!emitter) set(this, EMITTER, (emitter = new Emitter()))
			return exec(this, callback, get(this, EMITTER))
		},
		// 监听事件
		on(name: string, handler: Func) {
			return this.emitter(emitter => {
				emitter.on(name, handler)
			})
		},
		// 监听一次性事件
		once(name: string, handler: Func) {
			return this.emitter(emitter => {
				emitter.once(name, handler)
			})
		},
		// 注销事件监听
		off(name: string, handler: Func) {
			return this.emitter(emitter => {
				emitter.off(name, handler)
			})
		},
		// 发布事件
		fire(name: string, ...args: any[]) {
			return this.emitter(emitter => {
				this.$emit(name, ...args)
				emitter.emit(name, ...args)
			})
		},
		// 注册 Group 模版
		groupmap(name: string, template: Group | ((options: GroupOptions) => Group)) {
			return this.diagram(diagram => {
				const options = groupOptions(this.options as any)
				// 模板名称
				const tname = trim(name || '')
				// 判断 template 是否为函数
				if (isFunction(template)) template = template.call(this, options)
				// 判断 template 是否为 Node 对象
				if (template instanceof Group) {
					// 处理绑定事件
					bindEvents('GROUP', template, this)
					if (tname) diagram.groupTemplateMap.add(tname, template)
					else diagram.groupTemplate = template
				} else {
					return diagram.groupTemplateMap.get(tname) || diagram.groupTemplate
				}
			})
		},
		// 注册节点模板
		nodemap(name: string, template: Node | ((options: NodeOptions) => Node)) {
			return this.diagram(diagram => {
				const options = nodeOptions(this.options as any)
				// 模板名称
				const tname = trim(name || '')
				// 判断 template 是否为函数
				if (isFunction(template)) template = template.call(this, options)
				// 判断 template 是否为 Node 对象
				if (template instanceof Node) {
					// 处理绑定事件
					bindEvents('NODE', template, this)
					if (tname) diagram.nodeTemplateMap.add(tname, template)
					else diagram.nodeTemplate = template
				} else {
					return diagram.nodeTemplateMap.get(tname) || diagram.nodeTemplate
				}
			})
		},
		// 注册关系模板
		linkmap(name: string, template: Link | ((options: LinkOptions) => Link)) {
			return this.diagram(diagram => {
				const options = linkOptions(this.options as any)
				// 模板名称
				const tname = trim(name || '')
				// 判断 template 是否为函数
				if (isFunction(template)) template = template.call(this, options)
				// 判断 template 是否为 Node 对象
				if (template instanceof Link) {
					// 处理绑定事件
					bindEvents('LINK', template, this)
					if (name) diagram.linkTemplateMap.add(tname, template)
					else diagram.linkTemplate = template
				} else {
					return diagram.linkTemplateMap.get(tname) || diagram.linkTemplate
				}
			})
		},
		// 执行动画效果
		animate(callback?: (animation: Animation, diagram: Diagram) => any) {
			return this.diagram(diagram => {
				const animation = new Animation()
				animation.duration = diagram.animationManager.duration = 1000
				return exec(this, callback, animation, diagram)
			})
		},
		// 提交事务
		commit(name: string, callback: (diagram: Diagram, model: Model, txname: string) => any) {
			return this.diagram(diagram => {
				// 获取事务名称
				const txname = name || genId('TX')
				// 开启是否
				diagram.startTransaction(txname)
				// 定义返回值
				let result = null
				// 捕捉异常
				try {
					// 回调处理函数
					result = exec(this, callback, diagram, diagram.model, txname)
					// 提交事务
					diagram.commitTransaction(txname)
				} catch (e) {
					console.error(e)
					// 回滚事务
					diagram.rollbackTransaction()
				}
				return isUndefined(result) ? this : result
			})
		},
		// 判断节点/关系是否存在
		has(key: Key) {
			return this.hasNode(key) || this.hasLink(key)
		},
		// 判断节点是否存在
		hasNode(key: Key) {
			return this.exists.nids.has(key)
		},
		// 判断关系是存在
		hasLink(key: Key) {
			return this.exists.lids.has(key)
		},
		// 获取主节点
		mains(callback?: (nodes: Node[], diagram: Diagram) => any): Node[] {
			return this.diagram(diagram => {
				const mains = filter(new List(diagram.nodes).toArray(), ({ data }) => !!data.main)
				return exec(this, callback, mains, diagram)
			}) as Node[]
		},
		// 获取所有选中对象
		selection(callback?: (parts: Part[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				return exec(this, callback, diagram.selection.toArray(), diagram)
			}) as Part[]
		},
		// 获取最后选中的节点/关系
		current(onlynode: boolean | -1 = true, multiple?: boolean) {
			return this.selection(parts => {
				const selection = parts.filter(part => {
					if (onlynode === -1) {
						return part instanceof Node || part instanceof Link
					} else {
						return part instanceof (onlynode ? Node : Link)
					}
				})
				return (multiple ? selection : last(selection)) || null
			}) as any as Array<Node | Link> | Node | Link | null
		},
		// 获取节点
		nodes(predicate?: (node: Node) => boolean) {
			return this.diagram(diagram => {
				const list = new List(diagram.nodes)
				if (!isFunction(predicate)) return list.toArray()
				return list.filter(predicate).toArray()
			}) as Node[]
		},
		// 获取关系
		links(predicate?: (link: Link) => boolean) {
			return this.diagram(diagram => {
				const list = new List(diagram.links)
				if (!isFunction(predicate)) return list.toArray()
				return list.filter(predicate).toArray()
			}) as Link[]
		},
		// 添加节点
		addNodes(datas: NodeData[], extra?: Data) {
			return this.commit(EVENTS.NODE_ADD, diagram => {
				// 获取数据模型对象
				const model = diagram.model
				// 处理节点数据
				const { datas: nodes, repeats, ids } = reduceIfexists(datas, this.exists.nids, defNode, extra)
				// 添加到 Model 中
				if (!isEmpty(nodes)) model.addNodeDataCollection(nodes)
				// 发布事件
				this.fire(EVENTS.NODE_ADD, { datas, nodes, repeats, ids })
				// 判断是否需要自动调整布局
				if (this.isAutoRelayout) nextTick(() => this.fit())
			})
		},
		// 添加节点关系
		addLinks(datas: LinkData[], extra?: Data) {
			return this.commit(EVENTS.LINK_ADD, diagram => {
				const model = diagram.model as GraphLinksModel
				// 判断是否关系模型
				if (!model.addLinkDataCollection) return this
				// 处理节点数据
				const { datas: links, repeats, ids } = reduceIfexists(datas, this.exists.lids, defLink, extra)
				// 添加到 Model 中
				if (!isEmpty(links)) model.addLinkDataCollection(links)
				// 发布事件
				this.fire(EVENTS.LINK_ADD, { datas, links, repeats, ids })
			})
		},
		// 删除节点/关系
		removes(parts: Part[], callback?: (nodes: Node[], links: Link[]) => any) {
			return this.commit(EVENTS.REMOVES, diagram => {
				// 返回结果
				const { nodes, links } = { nodes: [] as Node[], links: [] as Link[] }
				// 获取当前选中集合
				const selection = diagram.selection.copy()
				// 获取非节点和关系
				const list = new List(castArray(parts)).filter(part => {
					if (!(part instanceof Node || part instanceof Link)) return false
					if (part instanceof Node) nodes.push(part)
					if (part instanceof Link) links.push(part)
					if (selection.has(part)) selection.remove(part)
					return true
				})
				// 删除元素
				diagram.removeParts(list, false)
				diagram.selectCollection(selection)
				// 发布事件
				this.fire(EVENTS.REMOVES, { nodes, links })
				// 回调
				return exec(this, callback, { nodes, links })
			}) as any as { nodes: Node[]; links: Link[] }
		},
		// 删除节点
		removeNodes<T extends string | ObjectData>(nodes: T | T[], callback?: (links: Node[]) => any) {
			// 获取需要删除的节点
			const parts = this.findNodes(nodes)
			// 获取节点关系
			const links = this.findNLinks(parts)
			// 删除节点和关系
			const result = this.removes([].concat(parts as any, links as any))
			// 返回结果
			return exec(this, callback, result) as { nodes: Node[]; links: Link[] }
		},
		// 删除节点关系
		removeLinks<T extends string | ObjectData>(links: T | T[], callback?: (links: Link[]) => any) {
			// 获取需要删除的关系
			const parts = this.findLinks(links)
			// 删除节点和关系
			const result = this.removes(parts)
			return exec(this, callback, result.links) as Link[]
		},
		// 清空面板
		clears(callback?: (options: { nodes: Node[]; links: Link[] }) => any) {
			if (this.showEmpty) return exec(this, callback, { nodes: [], links: [] })
			return this.commit(EVENTS.CLEAR, diagram => {
				// 获取节点和关系
				const result = { nodes: this.nodes(), links: this.links() }
				// 清空数据
				this.exists.nids.clear()
				this.exists.lids.clear()
				// 清空面板
				diagram.clear()
				diagram.clearSelection()
				diagram.clearHighlighteds()
				// 触发清空事件
				this.fire(EVENTS.CLEAR, result)

				console.info('清空面板 : ', result)
				// 返回值
				return exec(this, callback, result)
			})
		},
		// 清空选中对象
		clearSelection(predicate?: (part: Part, index: number, selection: Part[]) => boolean) {
			return this.commit(EVENTS.CLEAR_SELECTION, diagram => {
				const invoke = isFunction(predicate) ? predicate : () => true
				// 获取当前选中集合
				const selection = diagram.selection.toArray()
				// 过滤对象
				const [unselect, select] = partition(selection, (part: Part, index: number) => {
					return invoke(part, index, selection) || false
				})
				// 设置选择元素
				diagram.selectCollection(select as Part[])
				// 发布事件
				this.fire(EVENTS.CLEAR_SELECTION, unselect)
			})
		},
		// 清空高亮对象
		clearLighteds(predicate?: (part: Part, index: number, selection: Part[]) => boolean) {
			return this.commit(EVENTS.CLEAR_HIGHLIGHTE, diagram => {
				const invoke = isFunction(predicate) ? predicate : () => true
				// 获取当前选中集合
				const selection = diagram.selection.toArray()
				// 过滤对象
				const [unselect, select] = partition(selection, (part: Part, index: number) => {
					return invoke(part, index, selection) || false
				})
				// 设置高亮元素
				diagram.highlightCollection(select as Part[])
				// 发布事件
				this.fire(EVENTS.CLEAR_HIGHLIGHTE, unselect)
			})
		},
		// 重新调整大小
		resize(alwaysUpdate = false) {
			return this.diagram(diagram => {
				// 更新视图大小
				diagram.requestUpdate(alwaysUpdate)
				// 触发事件
				this.fire(EVENTS.RESIZE, diagram)
			})
		},
		// 设置缩放
		rescale(scale: number) {
			return this.diagram(diagram => {
				const value = scale || 1
				// 设置缩放
				diagram.commandHandler.resetZoom(Math.max(Math.min(value, diagram.maxScale), diagram.minScale))
			})
		},
		// 设置中心点位置
		center(center?: Rect, scale?: number) {
			return this.diagram(diagram => {
				this.rescale(scale || this.currentScale)
				diagram.centerRect(center instanceof Rect ? center : diagram.documentBounds)
			})
		},
		// 自动缩放
		fit() {
			return this.diagram(diagram => {
				diagram.zoomToFit()
			})
		},
		// 滚动到元素位置
		scrollToPart(part: Part) {
			return this.diagram(diagram => {
				diagram.commandHandler.scrollToPart(part)
			})
		},
		// 聚焦到指定对象
		focus(part?: Part, findMain = true) {
			return this.diagram(() => {
				let current = part || (this.current() as Part)
				if (!current && findMain) current = this.findNodes({ main: true })[0]
				if (!current) return void 0
				// 设置正常缩放
				this.rescale(1)
				// 滚动到指定位置
				this.scrollToPart(current)
				// 选中对象
				this.select([current], true)
			})
		},
		// 选中对象
		select(parts: Part[] | true, clearBefore = true) {
			return this.commit(EVENTS.SELECTION, diagram => {
				let items: Part[] = Array.isArray(parts) ? parts : []
				// 判断是否需要选中全部
				if (parts === true) items = items.concat(this.nodes(), this.links())
				// 获取需要选中的集合
				const selection = new Set<Part>(clearBefore ? [] : diagram.selection).addAll(items)
				// 不论是否隐藏显示出来
				this.showParts(selection.toArray())
				// 设置对象选中
				diagram.selectCollection(selection)
			})
		},
		// 选中节点
		selectNodes<T extends string | ObjectData>(examples: T | T[], clearBefore = true) {
			// 查找节点
			const nodes = this.findNodes(examples)
			// 选中节点
			return this.select(nodes, clearBefore)
		},
		// 选中关系
		selectLinks<T extends string | ObjectData>(examples: T | T[], clearBefore = true) {
			// 查找关系
			const links = this.findLinks(examples)
			// 选中关系
			return this.select(links, clearBefore)
		},
		// 折叠/展开节点
		collapse(nodes: Node[], collapsed?: boolean | Nil, callback?: (nodes: Node[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				const isAuto = isBoolean(collapsed)
				// 遍历节点
				each(nodes, node => {
					if (isAuto ? collapsed : node.isTreeExpanded) {
						diagram.commandHandler.collapseTree(node)
					} else {
						diagram.commandHandler.expandTree(node)
					}
				})
				return exec(this, callback, nodes, diagram)
			})
		},
		// 查找对象
		finds(onlynode: boolean | -1 = true, predicate?: (part: Node | Link) => boolean, callback?: (parts: Part[]) => any) {
			return this.diagram(diagram => {
				// 获取节点
				const nodes = this.nodes()
				// 获取关系
				const links = this.links()
				// 获取目标集合
				const parts = onlynode === -1 ? ([] as Part[]).concat(nodes, links) : onlynode ? nodes : links
				// 返回结果
				return exec(this, callback, isFunction(predicate) ? filter(parts) : parts, diagram)
			}) as Array<Node | Link>
		},
		// 查找节点
		findNodes<T extends string | ObjectData>(examples: T | T[], callback?: (nodes: Node[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				const items = map(castArray(examples), key => (isString(key) ? { key } : key))
				const [nodes, datas] = partition(items, item => item instanceof Node)
				// 查找节点
				const list = diagram.findNodesByExample(...datas)
				// 返回节点
				return exec(this, callback, new List(list).addAll(nodes as Node[]).toArray(), diagram)
			}) as Array<Node>
		},
		// 查找节点关系
		findNLinks(nodes: Node[], callback?: (nodes: Link[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				// 获取节点关系
				const links = map(nodes, node => new List(node.linksConnected).toArray())
				// 返回节点关系
				return exec(this, callback, new Set(flatten(links)).toArray(), diagram)
			}) as Array<Link>
		},
		// 查找子节点
		findChilds(nodes: Node[], includeSelf = false, callback?: (nodes: Node[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				const items = map(nodes, part => {
					const childran = new List(part.findTreeChildrenNodes()).toArray()
					return !includeSelf ? childran : [part].concat(childran)
				})
				return exec(this, callback, items, diagram)
			}) as Array<Node>
		},
		// 查找关系
		findLinks<T extends string | ObjectData>(examples: T | T[], callback?: (links: Link[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				const items = map(castArray(examples), key => (isString(key) ? { key } : key))
				const [links, datas] = partition(items, item => item instanceof Node)
				// 查找节点
				const list = diagram.findLinksByExample(...datas)
				// 返回节点
				return exec(this, callback, new List(list).addAll(links).toArray())
			}) as Array<Link>
		},
		// 查找两个节点之间的关系
		findLinksBetween(from: Node, to: Node, callback?: (links: Link[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				// 获取节点之间连线
				const links = new List(from.findLinksBetween(to)).toArray()
				return exec(this, callback, links, diagram)
			}) as Array<Link>
		},
		// 查找节点路径
		findPaths<T extends string | ObjectData>(
			mode: FindMode,
			from: T,
			to: T,
			limit = 5,
			callback?: (result: FindPathReult[], others: { from: Node; to: Node; limit: number }) => any
		) {
			// 获取起始/终点对象
			const [source, target] = this.findNodes([from, to])
			// 寻找两点之间的路径
			const paths = findPaths(mode, source, target, limit || Number.MAX_SAFE_INTEGER)
			// 返回结果
			return exec(this, callback, paths, { from: source, to: target, limit: limit || Number.MAX_SAFE_INTEGER })
		},
		// 显示元素(节点/关系)
		showParts<T extends Part | Part[]>(parts: T, callback?: (parts: T) => any) {
			return this.commit(EVENTS.HIDE_PARTS, (diagram, model) => {
				// 遍历元素
				each(castArray(parts), part => {
					// 设置属性值
					model.setDataProperty(part.data, 'visible', true)
					// 设置节点可选中
					part.selectable = true
				})
				// 返回结果
				return exec(this, callback, parts)
			})
		},
		// 隐藏元素(节点/关系)
		hideParts<T extends Part | Part[]>(parts: T, callback?: (parts: T) => any) {
			return this.commit(EVENTS.HIDE_PARTS, (diagram, model) => {
				// 获取当前选中集合
				const selection = diagram.selection.copy()
				// 遍历元素
				each(castArray(parts), part => {
					if (selection.has(part)) selection.remove(part)
					// 设置属性值
					model.setDataProperty(part.data, 'visible', false)
					// 设置节点不可选中
					part.selectable = false
				})
				// 设置选择元素
				diagram.selectCollection(selection)
				// 返回结果
				return exec(this, callback, parts)
			})
		},
		// 更新数据
		updates<T extends NodeData | LinkData>(datas: T | T[], callback?: any) {
			return this.commit(EVENTS.UPDATES, (diagram, model) => {
				// 获取节点
				const nodes = firstGroups(this.nodes(), ({ data }) => data.key)
				// 获取关系
				const links = firstGroups(this.links(), ({ data }) => data.key)
				// 更新结果
				const results: T[] = []
				// 更新数据
				each(castArray(datas), data => {
					// 获取元素
					const part = nodes[data.key as any] || links[data.key as any]
					if (!part) return
					// 复制对象
					const clone = Object.create(part.data || {})
					// 修改属性值
					each(omit(data, ['__gohashid', 'etype', 'key', 'from', 'to']), (value, prop) => {
						model.setDataProperty(part.data, prop, (clone[prop] = value))
					})
					results.push(clone)
				})
				return exec(this, callback, results, { nodes, links })
			})
		},
		// 固定节点布局和位置
		fixeds<T extends Node>(nodes: T[], fixed = true, callback?: (nodes: T[], diagram: Diagram) => any) {
			return this.diagram(diagram => {
				this.fixedPosition(nodes, fixed)
				this.fixedLayout(nodes, fixed)
				return exec(this, callback, nodes, diagram)
			})
		},
		// 固定节点位置
		fixedPosition<T extends Node>(nodes: T[], fixed = true, callback?: (nodes: T[], diagram: Diagram) => any) {
			return this.commit(EVENTS.FIXED_MOVABLE, (diagram, model) => {
				// 遍历节点, 设置属性值
				each(nodes, part => {
					model.setDataProperty(part.data, 'movable', !!fixed)
				})
				return exec(this, callback, nodes, diagram)
			})
		},
		// 固定节点布局
		fixedLayout<T extends Node>(nodes: T[], fixed = true, callback?: (nodes: T[], diagram: Diagram) => any) {
			return this.commit(EVENTS.FIXED_LAYOUTED, (diagram, model) => {
				// 遍历节点, 设置属性值
				each(nodes, part => {
					model.setDataProperty(part.data, 'fixed', !!fixed)
				})
				return exec(this, callback, nodes, diagram)
			})
		},
		// 更新布局
		layout(name: LayoutType, options?: Data | (() => Layout)) {
			return this.commit(EVENTS.LAYOUT_CHANGE, diagram => {
				if (!arguments.length) return diagram.layout
				// 布局名称
				const clsname = camelCase(trim(name || 'default')) as LayoutType
				// 判断是否更新 Layout 属性
				if (isPlainObject(options) && clsname === get(diagram.layout, 'clsname')) {
					extend(diagram.layout, options || {})
				} else {
					// 获取布局对象
					const layout = createLayout(clsname, options as any, options)
					// 判断 layout 是否存在
					if (layout instanceof Layout) diagram.layout = layout
				}
				// 记录当前当前布局
				this.currentLayout = get(diagram.layout, 'clsname')
				// 发布事件
				this.fire(EVENTS.LAYOUT_CHANGE, diagram.layout)
				// 调整布局
				this.relayout()
			})
		},
		// 重新调整布局
		relayout(parts?: Part[]) {
			return this.diagram(diagram => {
				diagram.layout.doLayout(parts ? new List(parts) : diagram)
				this.fit()
			})
		},
		// 生成图片
		makeImage(options?: ImageOptions, callback?: (err: boolean, result: ImageData | Blob | HTMLImageElement | string, filename: string) => void) {
			return this.diagram(diagram => {
				diagram.makeImageData({
					parts: options?.parts ? new List(options.parts || []) : void 0,
					scale: options?.scale || 1,
					padding: new Margin(options?.padding || 20, options?.padding || 20),
					maxSize: new Size(Infinity, Infinity),
					type: options?.type || 'image/png',
					details: options?.details || (1 as any),
					returnType: options?.returnType || 'blob',
					background: options?.background || 'white',
					callback: (result: any) => {
						const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[options?.type || 'image/png']
						const filename = options?.filename || `diagram-${+new Date()}.${ext || 'png'}`
						// 判断有回调
						if (isFunction(callback)) return callback(!result, result, filename)
						if (result && result instanceof Blob) {
							saveAs(result, filename) // 保存图片
						} else {
							console.warn(new Error(result ? '图片生成后为处理' : '图片生成失败!'))
						}
					}
				})
			})
		},
		// 从 JSON 导入
		fromJson<T extends { model: any; counts?: { nodes: number; links: number }; extra?: any; version?: string }>(datas: string | T, callback?: (err: Error, result: T) => any) {
			return this.model(model => {
				// 解析数据
				const result = isString(datas) ? JSON.parse(datas || '{}') : datas || {}
				// 导入数据
				if (result.model?.class === (model as any).type) {
					Model.fromJson(result.model || {}, model)
					return exec(this, callback, null, result)
				} else {
					return exec(this, callback, new Error('因数据模型不一致导致无法将数据导入.'), result)
				}
			})
		},
		// 导出 JSON
		toJson(extra?: Data, callback?: Func) {
			return this.model(model => {
				// 导出数据
				const datas = JSON.parse(model.toJson())
				// 组装结果
				const result = {
					version: Diagram.version,
					model: datas,
					counts: { nodes: datas.nodeDataArray.length, links: datas.linkDataArray.length },
					extra: extra || {}
				}
				// 返回数据
				return exec(this, callback, result)
			})
		},
		// 加载节点图片
		fetchPicture<T>(options: TaskOptions | string, runable: (instance: DiagramInstance, options: Readonly<TaskOptions>, ...args: any[]) => T | Promise<T>, ...args: any[]) {
			const opts = (isPlainObject(options) ? options : { name: options as string }) as TaskOptions
			return this.fetchTask({ ...opts, name: opts.name || '加载图片', priority: opts.priority || 0 }, runable, ...args)
		},
		// 加载数据
		fetchTask<T>(options: TaskOptions | string, runable: (instance: DiagramInstance, options: Readonly<TaskOptions>, ...args: any[]) => T | Promise<T>, ...args: any[]) {
			return new Promise<T>((resolve, reject) => {
				const opts = (isPlainObject(options) ? options : { name: options || '加载数据' }) as TaskOptions
				console.info('加载数据任务 : ', opts.name)
				// 任务处理函数
				const execute = isFunction(runable) ? runable : () => runable
				// 获取选项
				const params = Object.freeze(extend(opts, { key: opts.key || genId('TASK'), name: opts.name, priority: 1 } as TaskOptions))
				// 执行任务
				const result = execute.call(this, this, params, ...args)
				// 处理返回结果
				Promise.resolve(result)
					.then(resolve, reject)
					.finally(() => console.info(`任务结束 : ${opts.name}`))
			})
		},
		// 功能测试
		onTester() {
			console.info('功能测试 : ', arguments)

			// this.updates([
			// 	{ key: 'Alpha', text: '发顺丰' },
			// 	{ key: 'LINK-1', text: '啊啊啊' }
			// ] as any)

			// const res = this.toJson()
			const result = this.findPaths('bfs', { key: 'Beta' }, { key: 'Gamma' })
			console.info('最短路径 : ', result)
		}
	}
})
</script>
