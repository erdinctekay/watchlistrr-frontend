<template>
	<div class="dropdown dropdown-start d-flex justify-content-start">
		<button-constructor
			:mainColor="'standart'"
			:mainClass="'rounded-pill px-3 border-transparent border-2 hover-highlight-icon'"
			:textClass="'uppercase-first-letter ms-0 small'"
			:hasMainIcon="true"
			:mainIcon="`sort-${selectedSortOrderIcon}`"
			:mainIconClass="'me-n1 icon-opacity-100'"
			:mainIconSize="'1.15rem'"
			:mainIconStyle="'transform:translateY(1px);'"
			:hasAfterIcon="true"
			:afterIcon="`caret-down-fill`"
			:afterIconClass="'text-body filled-icon'"
			:afterIconSize="'1rem'"
			:afterIconStyle="'transform:translateY(1px);'"
			:dataBsToggle="'dropdown'"
			:ariaExpanded="false"
		>
		</button-constructor>
		<dropdown-constructor :dropdownObject="selectedDropdownObject.value" :colorScheme="colorScheme" />
	</div>
</template>
<script setup>
	import { storeToRefs } from 'pinia'
	import { ref, reactive, watch, onMounted, computed } from 'vue'

	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'
	import DropdownConstructor from '@/components/constructors/DropdownConstructor.vue'

	import { useRouteStore } from '@/stores/RouteStore'
	import { useSortStore } from '@/stores/SortStore'

	const { currentPage } = storeToRefs(useRouteStore())
	const { activeSortOptions } = storeToRefs(useSortStore())
	const { changeSortOptions } = useSortStore()

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
	})

	const selectedDropdownObject = reactive({
		value: {},
	})

	const selectedFilterType = ref(null)
	const selectedSortOrderIcon = ref(null)

	// prettier-ignore
	const selectDropdown = () => {

		switch (true) {
			case currentPage.value.name === 'home':
				selectedDropdownObject.value = listDropdownObject
				selectedFilterType.value = sortFilterListItems.find((item) => item.name === activeSortOptions.value.sortFilterList.split(' ')[0])?.label
				selectedSortOrderIcon.value = sortOrderItems.find((item) => item.name === activeSortOptions.value.sortFilterList.split(' ')[1])?.mainIcon.split('arrow-')[1]

				sortOrderAction = (item) => changeSortOptions('sortFilterList', activeSortOptions.value.sortFilterList.split(' ')[0] + ' ' + item.name)
				findActiveSortOrder = (item) => {
					return activeSortOptions.value.sortFilterList.split(' ')[1] === item.name ? 'active' : ''
				}
				break

			case currentPage.value.name === 'watchlist.show':
				selectedDropdownObject.value = moviesDropdownObject
				selectedFilterType.value = sortFilterMovieItems.find((item) => item.name === activeSortOptions.value.sortFilterMovie.split(' ')[0])?.label
				selectedSortOrderIcon.value = sortOrderItems.find((item) => item.name === activeSortOptions.value.sortFilterMovie.split(' ')[1])?.mainIcon.split('arrow-')[1]

				sortOrderAction = (item) => changeSortOptions('sortFilterMovie', activeSortOptions.value.sortFilterMovie.split(' ')[0] + ' ' + item.name)
				findActiveSortOrder = (item) => {
					return activeSortOptions.value.sortFilterMovie.split(' ')[1] === item.name ? 'active' : ''
				}
				break

			default:
				break
		}
	}

	// for detecting and filling inital values
	onMounted(() => {
		selectDropdown()
	})

	// trigger for updating selectedFilterType.value on sort option change
	watch(activeSortOptions.value, (newValue) => {
		selectDropdown()
	})

	// trigger for updating selectedDropdownObject.value on page change
	watch(currentPage, (newValue) => {
		selectDropdown()
	})

	const sortFilterMovieItems = [
		{
			label: 'Name',
			name: 'name',
		},
		{
			label: 'Year',
			name: 'year',
		},
		{
			label: 'Runtime',
			name: 'runtime',
		},
		// {
		// 	label: 'Season',
		// 	name: 'season',
		// },
	]
	const sortFilterListItems = [
		// {
		// 	label: 'Name',
		// 	name: 'name',
		// },
		{
			label: 'Likes',
			name: 'likes',
		},
		{
			label: 'Followers',
			name: 'followers',
		},
		// {
		// 	label: 'Total Movies',
		// 	name: 'totalMovies',
		// },
		{
			label: 'Date Created',
			name: 'createdAt',
		},
		{
			label: 'Date Updated',
			name: 'updatedAt',
		},
	]
	const sortOrderItems = [
		{
			label: 'Ascending',
			name: 'ascending',
			mainIcon: 'arrow-up',
			// rest of the settings setted on defaults
		},
		{
			label: 'Descending',
			name: 'descending',
			mainIcon: 'arrow-down',
		},
	]

	const sortFilterMovie = {
		defaults: {
			groupName: `Sort Filter:`,
			showGroupName: true,
			mainClass: 'w-100 hover-highlight bg-opacity-50 text-body py-2',
			textClass: 'uppercase-first-letter',
			hasAfterIcon: true,
			afterIcon: 'circle-fill',
			afterIconClass: 'text-body m-2',
			afterIconStyle: 'font-size: 0.5rem;',
			afterIconOffset: '140px',
			afterIconWrapperClass: 'custom-radio-bg rounded-circle',
			// textStyle: '/*min-width:31px;*/',
		},
		items: sortFilterMovieItems.map((item) => ({
			...item,
			action: () =>
				changeSortOptions('sortFilterMovie', item.name + ' ' + activeSortOptions.value.sortFilterMovie.split(' ')[1]),
			mainClassExtra: computed(() => {
				return activeSortOptions.value.sortFilterMovie.split(' ')[0] === item.name ? 'active' : ''
			}),
		})),
	}
	const sortFilterList = {
		defaults: {
			groupName: `Sort Filter:`,
			showGroupName: true,
			mainClass: 'w-100 hover-highlight bg-opacity-50 text-body py-2',
			textClass: 'uppercase-first-letter',
			hasAfterIcon: true,
			afterIcon: 'circle-fill',
			afterIconClass: 'text-body m-2',
			afterIconStyle: 'font-size: 0.5rem;',
			afterIconOffset: '140px',
			afterIconWrapperClass: 'custom-radio-bg rounded-circle',
			// textStyle: '/*min-width:31px;*/',
		},
		items: sortFilterListItems.map((item) => ({
			...item,
			action: () =>
				changeSortOptions('sortFilterList', item.name + ' ' + activeSortOptions.value.sortFilterList.split(' ')[1]),
			mainClassExtra: computed(() => {
				return activeSortOptions.value.sortFilterList.split(' ')[0] === item.name ? 'active' : ''
			}),
		})),
	}

	// just because using same sortOrder object for multiple instance
	// they will assigned and controlled with extra functions below
	let sortOrderAction
	let findActiveSortOrder

	const sortOrder = {
		defaults: {
			groupName: `Sort Order:`,
			showGroupName: true,
			mainClass: 'w-100 hover-highlight bg-opacity-50 text-body py-2',
			textClass: 'uppercase-first-letter',
			hasAfterIcon: true,
			afterIcon: 'circle-fill',
			afterIconClass: 'text-body m-2',
			afterIconStyle: 'font-size: 0.5rem;',
			afterIconOffset: '140px',
			afterIconWrapperClass: 'custom-radio-bg rounded-circle',

			//

			hasMainIcon: true,
			mainIconSize: '.9rem',
			mainIconClass: 'ps-1',
			mainIconStyle: 'transform: translateY(1px);',
			// textStyle: '/*min-width:31px;*/',
		},
		items: sortOrderItems.map((item) => ({
			...item,
			action: () => sortOrderAction(item),
			mainClassExtra: computed(() => {
				watch(currentPage.value, () => {
					return findActiveSortOrder(item)
				})
				return findActiveSortOrder(item)
			}),
		})),
	}

	const moviesDropdownObject = {
		'Sort Filter Movies': sortFilterMovie,
		'Sort Order': sortOrder,
	}
	const listDropdownObject = {
		'Sort Filter Lists': sortFilterList,
		'Sort Order': sortOrder,
	}
</script>
