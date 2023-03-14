<template>
	<form class="px-0" style="width: 320px" @submit.prevent="submitForm" novalidate>
		<div v-if="$slots['before-form']" class="d-grid gap-2 mb-3">
			<slot name="before-form"></slot>
		</div>

		<div v-for="field in fields" :key="field.name" class="input-group flex-wrap mb-2">
			<div class="form-floating w-100">
				<input
					@input="field.inputAction"
					class="form-control rounded-2 pt-4 py-3 bg-standart hover-highlight border-transparent ps-4 fw-bold"
					:class="field.class"
					v-model="field.model.value"
					style="min-height: 4.5rem !important"
					:id="field.name"
					:type="typeof field.type === 'string' ? field.type : field.type.value"
					:name="field.name"
					:disabled="field.disabled.value"
					:placeholder="field.placeholder || field.label"
					:aria-describedby="`${field.name}_description`"
				/>
				<label class="d-flex align-items-center ps-4" :for="field.name">{{ field.label }}</label>
			</div>
			<div
				:id="`${field.name}_description`"
				class="form-text w-100 text-end pe-2 ps-4 position-absolute"
				style="bottom: 0.25rem"
			>
				<p
					class="mb-0 small fst-italic me-1"
					style="pointer-events: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
				></p>
			</div>
		</div>

		<div v-if="$slots['additional-area']" class="d-grid gap-2 mt-3">
			<!-- additional area -->
			<slot name="additional-area"></slot>
		</div>

		<div class="d-grid gap-2 mt-3" :class="submitButton.isHidden ? 'd-none' : ''">
			<button-constructor
				@click="submitForm"
				:isDisabled="submitButton.disabled.value"
				:buttonType="'submit'"
				:mainColor="'primary'"
				:mainClass="'btn fw-semibold rounded-2 btn-submit'"
				:mainStyle="'padding-top: 0.75rem; padding-bottom: 0.75rem; height: 50px'"
				:textClass="`${submitButton.labelClass} ls-1`"
			>
				{{ submitButton.label }}
			</button-constructor>

			<!-- old button before constructor -->
			<!-- <button
				:disabled="submitButton.disabled.value"
				type="submit"
				:class="submitButton.labelClass"
				class="btn fw-semibold btn-primary rounded-2 btn-submit"
				style="padding-top: 0.75rem; padding-bottom: 0.75rem; height: 50px"
			>
				<span class="ls-1">
					{{ submitButton.label }}
				</span>
			</button> -->
		</div>
	</form>
</template>

<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'

	const props = defineProps({
		fields: {
			type: Array,
			required: true,
		},
		submitButton: {
			type: Object,
			required: true,
		},
	})

	const emit = defineEmits(['submit'])

	const submitForm = () => {
		emit('submit')
	}
</script>
