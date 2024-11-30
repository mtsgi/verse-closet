export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      neutral: 'zinc',
    },
    inputMenu: {
      slots: {
        content: 'z-50',
      },
    },
    select: {
      slots: {
        content: 'z-150',
      },
    },
    skeleton: {
      base: 'animate-pulse rounded-[calc(var(--ui-radius)*1.5)] bg-[var(--color-white)]',
    },
  },
})
