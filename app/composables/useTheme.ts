export function useTheme() {
  const isDark = useState<boolean>('theme-dark', () => false);

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value);

    const themeLink = document.getElementById('primevue-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = isDark.value
        ? '/themes/aura-dark/theme.css'
        : '/themes/aura-light/theme.css';
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    applyTheme();
    localStorage.setItem('theme-dark', String(isDark.value));
  }

  function initTheme() {
    const saved = localStorage.getItem('theme-dark');
    if (saved !== null) {
      isDark.value = saved === 'true';
    }
    applyTheme();
  }

  return { isDark, toggleTheme, initTheme };
}