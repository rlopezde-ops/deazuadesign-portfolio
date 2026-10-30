/*
 * Catalog for the profile-photo avatar customizer.
 *
 * The sprite sheet the accessories came from was sliced into individual
 * transparent PNGs in `public/avatar-items/` (see the extraction notes in the
 * PR). Each accessory here maps to one of those files and carries a *default
 * placement* used when it's first dropped onto the photo — the user can then
 * drag / resize / rotate it.
 *
 * Placement is stored in NORMALIZED coordinates so a composition renders
 * identically at any size (36px header chip, 72px dropdown, large in the
 * dialog): `x`/`y` are the accessory *center* as a fraction of the photo box
 * (0–1), `scale` is its width as a fraction of the box width, and `rot` is
 * degrees clockwise. The defaults below were calibrated against the real
 * headshot — eyes ≈ y0.42, mouth ≈ y0.68, chin ≈ y0.82 — so hats land on the
 * crown, glasses over the eyes, beards on the jaw, necklaces at the collar.
 */

export type AccessoryCategory = 'hat' | 'glasses' | 'face' | 'ears' | 'necklace' | 'sticker'

/** Placement of an accessory relative to the photo box, all normalized 0–1 (rot in deg). */
export type Placement = { x: number; y: number; scale: number; rot: number }

export type AccessoryDef = {
  id: string
  label: string
  category: AccessoryCategory
  /** Public path to the transparent cutout. */
  src: string
  /** Default placement when the accessory is first added. */
  place: Placement
}

/** One accessory placed on the photo. `defId` points back into `ACCESSORIES`. */
export type PlacedAccessory = {
  /** Unique per-instance id (an accessory can be added more than once). */
  key: string
  defId: string
  x: number
  y: number
  scale: number
  rot: number
}

export const CATEGORY_ORDER: AccessoryCategory[] = [
  'hat',
  'glasses',
  'face',
  'ears',
  'necklace',
  'sticker',
]

export const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
  hat: 'Hats',
  glasses: 'Glasses',
  face: 'Facial hair',
  ears: 'Ears & head',
  necklace: 'Neckwear',
  sticker: 'Stickers',
}

const src = (id: string) => `/avatar-items/${id}.png`

// Helper to keep the catalog terse: (id, label, category, x, y, scale, rot?).
function def(
  id: string,
  label: string,
  category: AccessoryCategory,
  x: number,
  y: number,
  scale: number,
  rot = 0,
): AccessoryDef {
  return { id, label, category, src: src(id), place: { x, y, scale, rot } }
}

export const ACCESSORIES: AccessoryDef[] = [
  // Hats — sit on the crown of the head. Wide-brim hats fill more width; tall
  // hats (top hat, chef) ride higher so they don't cover the face.
  def('crown', 'Crown', 'hat', 0.5, 0.08, 0.6),
  def('cap', 'Ball cap', 'hat', 0.5, 0.22, 0.66),
  def('beanie', 'Beanie', 'hat', 0.5, 0.16, 0.66),
  def('fedora', 'Fedora', 'hat', 0.5, 0.14, 0.82),
  def('captain', 'Captain', 'hat', 0.5, 0.14, 0.8),
  def('cowboy', 'Cowboy', 'hat', 0.5, 0.16, 0.9),
  def('top-hat', 'Top hat', 'hat', 0.5, 0.06, 0.6),
  def('viking', 'Viking', 'hat', 0.5, 0.12, 0.82),
  def('propeller', 'Propeller', 'hat', 0.5, 0.12, 0.66),
  def('tiara', 'Tiara', 'hat', 0.5, 0.14, 0.6),
  def('sombrero', 'Sombrero', 'hat', 0.5, 0.14, 0.95),
  def('santa', 'Santa', 'hat', 0.5, 0.1, 0.72),
  def('leprechaun', 'Leprechaun', 'hat', 0.5, 0.08, 0.66),
  def('cowboy-pink', 'Pink cowboy', 'hat', 0.5, 0.16, 0.9),
  def('pirate', 'Pirate', 'hat', 0.5, 0.12, 0.9),
  def('chef', 'Chef', 'hat', 0.5, 0.06, 0.7),

  // Glasses — over the eyes. groucho carries a nose + brows so it rides lower.
  def('aviators', 'Aviators', 'glasses', 0.5, 0.42, 0.56),
  def('wayfarers', 'Wayfarers', 'glasses', 0.5, 0.42, 0.56),
  def('glasses', 'Glasses', 'glasses', 0.5, 0.42, 0.54),
  def('sunglasses', 'Sunglasses', 'glasses', 0.5, 0.42, 0.56),
  def('pixel-shades', 'Pixel shades', 'glasses', 0.5, 0.42, 0.6),
  def('heart-glasses', 'Heart glasses', 'glasses', 0.5, 0.42, 0.56),
  def('shutter-shades', 'Shutter shades', 'glasses', 0.5, 0.42, 0.58),
  def('groucho', 'Disguise', 'glasses', 0.5, 0.47, 0.54),

  // Facial hair — mustaches on the lip, beards over the jaw.
  def('mustache', 'Mustache', 'face', 0.5, 0.6, 0.3),
  def('mustache-black', 'Handlebar', 'face', 0.5, 0.6, 0.3),
  def('beard-black', 'Black beard', 'face', 0.5, 0.73, 0.5),
  def('beard-brown', 'Brown beard', 'face', 0.5, 0.73, 0.5),
  def('beard-gray', 'Gray beard', 'face', 0.5, 0.73, 0.52),

  // Ears & head — headbands and headphones that wrap the top of the head.
  def('headphones', 'Headphones', 'ears', 0.5, 0.3, 0.92),
  def('headphones-blue', 'Gaming headset', 'ears', 0.5, 0.3, 0.88),
  def('cat-ears', 'Cat ears', 'ears', 0.5, 0.12, 0.55),
  def('bunny-ears', 'Bunny ears', 'ears', 0.5, 0.06, 0.5),
  def('flower-crown', 'Flower crown', 'ears', 0.5, 0.14, 0.82),
  def('bandana-black', 'Bandana', 'ears', 0.5, 0.18, 0.66),

  // Neckwear — necklaces, ties, and scarves drape at the collar.
  def('gold-chain', 'Gold chain', 'necklace', 0.5, 0.92, 0.58),
  def('silver-chain', 'Silver chain', 'necklace', 0.5, 0.92, 0.58),
  def('pearls', 'Pearls', 'necklace', 0.5, 0.9, 0.5),
  def('pendant', 'Pendant', 'necklace', 0.5, 0.9, 0.5),
  def('emerald', 'Emerald', 'necklace', 0.5, 0.9, 0.38),
  def('dog-tag', 'Dog tag', 'necklace', 0.5, 0.9, 0.4),
  def('bowtie', 'Bow tie', 'necklace', 0.5, 0.9, 0.34),
  def('tie', 'Necktie', 'necklace', 0.5, 0.97, 0.22),
  def('bandana-red', 'Red bandana', 'necklace', 0.5, 0.9, 0.55),
  def('bandana-checkered', 'Checkered bandana', 'necklace', 0.5, 0.9, 0.55),

  // Stickers — decorative, land in the top-right by default; move anywhere.
  def('star', 'Star', 'sticker', 0.76, 0.24, 0.26),
  def('pixel-heart', 'Pixel heart', 'sticker', 0.76, 0.24, 0.26),
  def('lightning', 'Lightning', 'sticker', 0.76, 0.24, 0.24),
  def('fire', 'Fire', 'sticker', 0.76, 0.24, 0.24),
  def('pizza', 'Pizza', 'sticker', 0.76, 0.24, 0.28),
  def('taco', 'Taco', 'sticker', 0.76, 0.24, 0.28),
  def('mug', 'Good vibes', 'sticker', 0.76, 0.24, 0.28),
  def('alien', 'Alien', 'sticker', 0.76, 0.24, 0.24),
  def('rainbow-heart', 'Rainbow heart', 'sticker', 0.76, 0.24, 0.26),
  def('rocket', 'Rocket', 'sticker', 0.76, 0.24, 0.26),
  def('peace', 'Peace', 'sticker', 0.76, 0.24, 0.22),
  def('smiley', 'Smiley', 'sticker', 0.76, 0.24, 0.26),
  def('cool-smiley', 'Cool', 'sticker', 0.76, 0.24, 0.26),
  def('winky', 'Winky', 'sticker', 0.76, 0.24, 0.26),
  def('hundred', '100', 'sticker', 0.76, 0.24, 0.24),
  def('dino', 'Dino', 'sticker', 0.76, 0.24, 0.28),
  def('basketball', 'Basketball', 'sticker', 0.76, 0.24, 0.24),
  def('soccer', 'Soccer', 'sticker', 0.76, 0.24, 0.24),
  def('music-note', 'Music', 'sticker', 0.76, 0.24, 0.2),
  def('paw', 'Paw', 'sticker', 0.76, 0.24, 0.22),
]

export const ACCESSORY_BY_ID: Record<string, AccessoryDef> = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a]),
)

/** Accessories grouped by category, in `CATEGORY_ORDER`, for the picker tray. */
export const ACCESSORIES_BY_CATEGORY: { category: AccessoryCategory; items: AccessoryDef[] }[] =
  CATEGORY_ORDER.map((category) => ({
    category,
    items: ACCESSORIES.filter((a) => a.category === category),
  }))
