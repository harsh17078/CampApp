import react from 'react'
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    breakpoints: {
      tablet: "992px",
      desktop: "1200px",
      wide: "1400px",
    },
  },
})

export default createSystem(defaultConfig, config)