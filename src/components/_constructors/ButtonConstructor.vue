<template>
	<!-- prettier-ignore-attribute class -->
	<button
		@click.prevent.stop="buttonClick"
		:type="buttonType"
		class="btn d-flex flex-row align-items-center"
		:class="[mainClass, mainClassExtra, `btn-${mainColor}`].filter((c) => c).join(' ')"
		:style="mainStyle"
		:disabled="isDisabled"
		v-bind:data-bs-toggle="dataBsToggle"
	>
		<div class="d-inline-flex align-items-center flex-row flex-grow-1" :style="{ minWidth: afterIconOffset }">
			<i
				v-if="hasMainIcon"
				:class="`bi-${mainIcon} ${mainIconClass}`"
				class="bi d-flex"
				:style="'font-size: ' + mainIconSize + ';' + mainIconStyle"
			></i>

			<img
				v-if="hasBeforeImage"
				:class="beforeImageClass"
				:src="beforeImageSource"
				:height="beforeImageHeight"
				:style="beforeImageStyle"
			/>

			<span :class="textClass" class="mx-2 text-nowrap" :style="textStyle">
				<slot></slot>
			</span>
		</div>
		<div
			v-if="hasAfterIcon"
			class="icon-after"
			:class="afterIconWrapperClass"
			:style="`${afterIcon.startsWith('caret') ? 'transform: translateX(.25rem)' : ''}`"
		>
			<i
				:class="`bi-${afterIcon} ${afterIconClass}`"
				class="bi d-flex"
				:style="'font-size: ' + afterIconSize + ';' + afterIconStyle"
			></i>
		</div>

		<div class="d-inline-flex align-items-center flex-row" v-if="hasAfterImage">
			<!-- prettier-ignore -->
			<img
				:class="afterImageClass"
				:src="afterImageSource"
				:height="afterImageHeight"
				:style="afterImageStyle"
			/>
		</div>
	</button>
</template>
<script setup>
	const props = defineProps({
		mainClass: {
			type: String,
			required: true,
		},
		mainClassExtra: {
			type: String,
			default: '',
		},
		mainColor: {
			type: String,
			required: true,
		},
		mainStyle: {
			type: String,
			default: null,
		},
		isDisabled: {
			type: Boolean,
			default: null,
		},
		buttonType: {
			type: String,
			default: null,
		},
		hasMainIcon: {
			type: Boolean,
			default: false,
		},
		mainIcon: {
			type: String,
			default: '',
		},
		mainIconClass: {
			type: String,
			default: '',
		},
		mainIconSize: {
			type: String,
			default: '1.25rem',
		},
		mainIconStyle: {
			type: String,
			default: null,
		},
		hasBeforeImage: {
			type: Boolean,
			default: false,
		},
		beforeImageClass: {
			type: String,
			default: '',
		},
		beforeImageSource: {
			type: String,
			default: '',
		},
		beforeImageHeight: {
			type: String,
			default: '',
		},
		beforeImageStyle: {
			type: String,
			default: '',
		},
		textClass: {
			type: String,
			default: '',
		},
		textStyle: {
			type: String,
			default: null,
		},
		hasAfterIcon: {
			type: Boolean,
			default: false,
		},
		afterIcon: {
			type: String,
			default: '',
		},
		afterIconClass: {
			type: String,
			default: '',
		},
		afterIconSize: {
			type: String,
			default: '1.1rem',
		},
		afterIconStyle: {
			type: String,
			default: '',
		},
		afterIconOffset: {
			type: String,
			default: '',
		},
		afterIconWrapperClass: {
			type: String,
			default: '',
		},
		dataBsToggle: {
			type: String,
			default: null,
		},
		hasAfterImage: {
			type: Boolean,
			default: false,
		},
		afterImageClass: {
			type: String,
			default: '',
		},
		afterImageSource: {
			type: String,
			default: '',
		},
		afterImageHeight: {
			type: String,
			default: '',
		},
		afterImageStyle: {
			type: String,
			default: '',
		},
		onClick: {
			type: Function,
		},
	})

	const emit = defineEmits(['click'])

	const buttonClick = () => {
		emit('click')
		// console.log(props.onClick)
	}
</script>
