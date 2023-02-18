import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'~': path.resolve(__dirname, 'node_modules/'),
		},
	},
	css: {
		postcss: {
			plugins: [
				autoprefixer({}), // options can be added here
			],
		},
	},
})
