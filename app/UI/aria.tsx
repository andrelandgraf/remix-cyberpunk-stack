const getFocusClasses = (smaller = false) =>
  `outline-none focus:ring-secondary ${
    smaller ? 'focus:ring-2' : 'focus:ring-4'
  } focus:ring-offset-2 focus:ring-offset-transparent`;

const getHoverClasses = (smaller = false) =>
  `outline-none hover:ring-secondary ${
    smaller ? 'hover:ring-2' : 'hover:ring-4'
  } hover:ring-offset-2 hover:ring-offset-transparent`;

const getAriaClasses = (smaller = false) => `${getFocusClasses(smaller)} ${getHoverClasses(smaller)}`;

export { getFocusClasses, getHoverClasses, getAriaClasses };
