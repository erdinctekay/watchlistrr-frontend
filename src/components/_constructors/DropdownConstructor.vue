<template>
	<div
		:class="`${colorScheme === 'light' ? 'bg-light' : 'bg-gray-850'}`"
		class="dropdown-menu border-0 p-3 shadow"
		style="
			/* max-width: calc(100% + 2.5rem);
			transform: translateX(-1.25rem);
			min-width: calc(100% + 2.5rem); */
			border-radius: 1.5rem;
			margin: 0; /* fixes popper warn */
		"
	>
		<ul class="list-group" v-for="object in dropdownObject" style="list-style-type: none">
			<li v-if="object.defaults.showGroupName" class="mb-1" style="max-width: 180px">
				<span
					class="small fw-bold px-3 text-nowrap d-block"
					style="text-overflow: ellipsis; overflow: hidden; white-space: pre; max-width: inherit"
				>
					{{ object.defaults.groupName }}
				</span>
			</li>
			<li class="" v-for="item in object.items" :key="item.name">
				<!-- prettier-ignore -->
				<button-constructor
					@click="item.action"
					:mainColor="item.mainColor || object.defaults.mainColor || ''"
					:mainClass="(item.mainClass || object.defaults.mainClass) + ' px-2 py-1 rounded-pill ' + item.mainClassExtra"
					:mainStyle="item.mainStyle || object.defaults.mainStyle"
					:hasMainIcon="item.hasMainIcon || object.defaults.hasMainIcon"
					:mainIcon="item.mainIcon || object.defaults.mainIcon"
					:mainIconClass="item.mainIconClass || object.defaults.mainIconClass"
					:mainIconSize="item.mainIconSize || object.defaults.mainIconSize"
					:mainIconStyle="item.mainIconStyle || object.defaults.mainIconStyle"
					:hasBeforeImage="item.hasBeforeImage || object.defaults.hasBeforeImage"
					:beforeImageSource="item.beforeImageSource || object.defaults.beforeImageSource"
					:beforeImageHeight="item.beforeImageHeight || object.defaults.beforeImageHeight"
					:beforeImageClass="item.beforeImageClass || object.defaults.beforeImageClass"
					:beforeImageStyle="item.beforeImageStyle || object.defaults.beforeImageStyle"
					:hasAfterIcon="item.hasAfterIcon || object.defaults.hasAfterIcon"
					:afterIcon="item.afterIcon || object.defaults.afterIcon"
					:afterIconClass="item.afterIconClass || object.defaults.afterIconClass"
					:afterIconSize="item.afterIconSize || object.defaults.afterIconSize"
					:afterIconStyle="item.afterIconStyle || object.defaults.afterIconStyle"
					:afterIconOffset="item.afterIconOffset || object.defaults.afterIconOffset"
					:afterIconWrapperClass="item.afterIconWrapperClass || object.defaults.afterIconWrapperClass"
					:textClass="item.textClass || object.defaults.textClass"
					:textStyle="item.textStyle || object.defaults.textStyle"
					:dataBsToggle="item.dataBsToggle || object.defaults.dataBsToggle"
					:ariaExpanded="item.ariaExpanded || object.defaults.ariaExpanded"
				>
					{{ item.label || item.name }}
				</button-constructor>
			</li>
			<li>
				<divider-constructor :mainClass="'border-1 border-bottom mx-1 my-2'" />
			</li>
		</ul>
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import DividerConstructor from '@/components/_constructors/DividerConstructor.vue'

	const props = defineProps({
		dropdownObject: {
			type: Object,
			required: true,
		},
		colorScheme: {
			type: String,
			required: true,
		},
	})
</script>
<style scoped>
	.dropdown-menu ul:last-of-type li:last-child {
		display: none;
	}
</style>
