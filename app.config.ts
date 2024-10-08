export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      gray: 'zinc',
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
    button: {
      slots: {
        base: ['justify-center'],
      },
    },
  },
})
