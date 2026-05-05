import { ref } from 'vue'

const dark = ref(localStorage.getItem('gpc-dark') === 'true')

function applyTheme() {
  document.documentElement.classList.toggle('dark', dark.value)
}
applyTheme()

export function useTheme() {
  const toggleDark = () => {
    dark.value = !dark.value
    localStorage.setItem('gpc-dark', String(dark.value))
    applyTheme()
  }
  return { dark, toggleDark }
}
