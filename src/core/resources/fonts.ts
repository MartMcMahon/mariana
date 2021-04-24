export function waitForFontsLoaded(fonts: readonly FontFace[]) {
  return Promise.all(
    fonts.map(async (font) => {
      const loadedFont = await font.load();
      document.fonts.add(loadedFont);
    })
  );
}
