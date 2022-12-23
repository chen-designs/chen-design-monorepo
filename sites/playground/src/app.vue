<template>
	<ch-layout border>
		<ch-header></ch-header>
		<ch-layout>
			<ch-aside title="系统菜单" collapsible resizeable>
				<template #default="{ collapsed }">
					<ch-menu :collapsed="collapsed"></ch-menu>
				</template>
			</ch-aside>
			<ch-main>
				<!-- <router-view></router-view> -->
				<ch-diagram ref="diagramRef" @ready="onReady" @node-click="onNodeClick">
					<ch-diagram-ctxmenu>
						<ch-drop-option icon="icon-select-allno" label="取消"></ch-drop-option>
						<ch-drop-option icon="icon-select-allno" label="取消"></ch-drop-option>
						<ch-drop-option icon="icon-select-allno" label="取消"></ch-drop-option>
						<ch-drop-option icon="icon-select-allno" label="取消"></ch-drop-option>
						<ch-drop-option icon="icon-select-allno" label="取消"></ch-drop-option>
					</ch-diagram-ctxmenu>
				</ch-diagram>
			</ch-main>
		</ch-layout>
		<ch-footer></ch-footer>
	</ch-layout>
</template>

<script lang="ts" setup>
const diagramRef = ref<any>()

const onReady = (diagram: any) => {
	console.info('diagram : ', diagram)

	diagram.addNodes(
		[
			{ key: 'Alpha', text: 'Alpha', main: true },
			{ key: 'Beta', text: 'Beta' },
			{ key: 'Gamma', text: 'Gamma' },
			{ key: 'Delta', text: 'Delta' }
		],
		{ name: 'ChenYuan' }
	)
	diagram.addLinks(
		[
			{ from: 'Alpha', to: 'Beta' },
			{ key: 'LINK-1', from: 'Alpha', to: 'Gamma' },
			{ from: 'Beta', to: 'Beta' },
			{ from: 'Gamma', to: 'Delta' },
			{ from: 'Delta', to: 'Alpha' }
		],
		{ name: 'ChenYuan' }
	)

	// nextTick(() => diagram.fit())
}

const onNodeClick = (...args: any[]) => {
	console.info('点击节点 : ', args)
}
</script>
