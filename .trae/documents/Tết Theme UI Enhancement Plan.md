I will enhance the UI with a "Tết" theme focusing on typography and color.

## Typography
- **Headings**: Use **'Dancing Script'** (already in use, but will be standardized) for main titles to give a calligraphy/festive feel.
- **Subheadings**: Introduce **'Playfair Display'** for an elegant, traditional look.
- **Body**: Use **'Montserrat'** for clean, readable text that complements the decorative fonts.
- **Action**: 
  - Add Google Fonts imports to `src/global.css`.
  - Update `src/components/lucky-draw/Header.tsx` to use these fonts via utility classes.

## Color Palette & Theme
- **Primary**: Deep Red (`#8B0000`) to Bright Red (`#D2042D`) - representing luck and joy.
- **Accent**: Gold (`#FFD700`) and Amber (`#FFBF00`) - representing wealth and prosperity.
- **Gradients**: Enhance the existing gold gradients to be more vibrant and metallic.
- **Action**:
  - Define semantic CSS variables in `src/global.css` (`--tet-red`, `--tet-gold`).
  - Refine `.text-gold-gradient` in `src/styles/lucky-draw.css`.

## Component Enhancements
1. **Header**: Clean up inline styles and use the new font system.
2. **Spin Button**: Style it to resemble a "Gold Coin" or "Red Envelope" with a glowing effect.
3. **Winners List**: Add a decorative border and semi-transparent background to improve readability while maintaining the festive vibe.
4. **Animations**: Ensure existing animations (fireworks, petals) blend well with the new color scheme.
