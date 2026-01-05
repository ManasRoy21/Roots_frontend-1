import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  // CSS/SCSS Configuration
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"]
      }
    }
  },
  // 3D Asset Optimization Configuration
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.fbx', '**/*.obj'],
  build: {
    // Enable source maps for better 3D debugging
    sourcemap: true,
    rollupOptions: {
      output: {
        // Separate chunk for 3D libraries to improve loading
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['framer-motion']
        }
      }
    },
    // Optimize for 3D performance
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        // Keep function names for better 3D debugging
        keep_fnames: true,
        // Remove console logs in production but keep errors
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies for 3D libraries
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion'
    ]
  },
  // Development server configuration for 3D debugging
  server: {
    // Headers for 3D content
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
})