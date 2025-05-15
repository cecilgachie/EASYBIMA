// Keyboard shortcut definitions
export const SHORTCUTS = {
  TOGGLE_NOTIFICATIONS: { key: 'n', ctrl: true, description: 'Toggle notifications' },
  TOGGLE_PROFILE: { key: 'p', ctrl: true, description: 'Toggle profile' },
  LOGOUT: { key: 'l', ctrl: true, description: 'Logout' },
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, description: 'Toggle sidebar' },
  SEARCH: { key: 'k', ctrl: true, description: 'Search' },
  HELP: { key: '/', ctrl: false, description: 'Show keyboard shortcuts' },
  EXPORT: { key: 'e', ctrl: true, description: 'Export data' },
  REFRESH: { key: 'r', ctrl: true, description: 'Refresh data' }
};

// Initialize keyboard shortcuts
export const initializeShortcuts = (handlers) => {
  const handleKeyPress = (event) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    Object.entries(SHORTCUTS).forEach(([action, shortcut]) => {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        event.ctrlKey === shortcut.ctrl &&
        !event.shiftKey &&
        !event.altKey &&
        handlers[action]
      ) {
        event.preventDefault();
        handlers[action]();
      }
    });
  };

  document.addEventListener('keydown', handleKeyPress);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
};

// Show keyboard shortcuts help
export const showShortcutsHelp = () => {
  const helpContent = Object.entries(SHORTCUTS)
    .map(([action, shortcut]) => {
      const key = shortcut.ctrl ? `Ctrl + ${shortcut.key.toUpperCase()}` : shortcut.key;
      return `${key}: ${shortcut.description}`;
    })
    .join('\n');

  alert('Keyboard Shortcuts:\n\n' + helpContent);
};

// Get shortcut key combination string
export const getShortcutString = (shortcutName) => {
  const shortcut = SHORTCUTS[shortcutName];
  if (!shortcut) return '';
  
  return shortcut.ctrl 
    ? `Ctrl + ${shortcut.key.toUpperCase()}`
    : shortcut.key;
}; 