<template>
	<div
		:class="`${currentPage.meta.requiresSorting ? 'mb-2' : ''}`"
		class="d-flex flex-row align-items-center"
		style="min-height: 40px"
	>
		<div class="col">
			<div class="row w-100 g-0 d-flex justify-content-center">
				<h3 class="logo m-0">
					<a @click="returnPage('home')" class="logo text-decoration-none cursor-pointer">
						<img
							src="/watchlistrr-logo.svg"
							class="pe-2"
							style="height: 1.5rem"
							:style="`${
								colorScheme === 'dark'
									? 'filter: invert(1);'
									: 'filter: invert(23%) sepia(6%) saturate(853%) hue-rotate(169deg) brightness(94%) contrast(97%);'
							}`"
						/>
						<!-- <i> watch<b>listrr</b> </i> -->
					</a>
				</h3>
			</div>
		</div>
		<div class="col d-flex justify-content-end">
			<div class="d-flex flex-row align-items-center">
				<div v-if="!isAuthenticated" class="d-flex">
					<span class="align-self-center text-nowrap d-none d-md-block small me-2">
						<a @click="returnPage('register')" class="text-decoration-none h-100 cursor-pointer">Register</a>
						<span class="px-2">or</span>
					</span>
					<button-constructor
						@click="returnPage('login')"
						:mainColor="'secondary'"
						:mainClass="'rounded-pill py-1'"
						:textClass="'small uppercase-first-letter'"
					>
						Login
					</button-constructor>
				</div>
				<account-dropdown v-else :colorScheme="colorScheme" :userCredentials="userCredentials" />
			</div>
			<divider-constructor :mainClass="'border-1 border-start mx-3 my-1'" />
			<button-constructor
				@click="toggleColorScheme()"
				:mainColor="'standart'"
				:mainClass="'px-2 py-1 rounded-pill square square-none-md'"
				:hasMainIcon="true"
				:mainIcon="`${colorScheme === 'light' ? 'brightness-high' : 'moon-fill'}`"
				:mainIconClass="'mx-0 mx-md-1'"
				:mainIconSize="'.9rem'"
				:mainIconStyle="'padding: 0 0px;'"
				:textClass="'d-none d-md-block small uppercase-first-letter'"
				:textStyle="'min-width:2rem; max-width:2rem;'"
			>
				{{ colorScheme }}
			</button-constructor>
		</div>
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'
	import DividerConstructor from '@/components/constructors/DividerConstructor.vue'

	import AccountDropdown from '@/components/dropdowns/AccountDropdown.vue'

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		currentPage: {
			type: Object,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
		isAuthenticated: {
			type: Boolean,
			required: true,
		},
		toggleColorScheme: {
			type: Function,
			required: true,
		},
		returnPage: {
			type: Function,
			required: true,
		},
	})
</script>
