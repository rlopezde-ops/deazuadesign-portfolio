'use client'

import {
  Button,
  Checkbox,
  createTheme,
  Drawer,
  Menu,
  Paper,
  PinInput,
  Radio,
  rem,
  SegmentedControl,
  Tooltip,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core'

const asurionPurple: MantineColorsTuple = [
  '#F7EDFF',
  '#F0E0FF',
  '#D0AAF1',
  '#B87FE8',
  '#A053E0',
  '#933ADC',
  '#8223d2',
  '#7820C3',
  '#6618A8',
  '#4d109b',
]

const asurionDark: MantineColorsTuple = [
  '#E8E6ED',
  '#D7D5DB',
  '#A7A4AE',
  '#716E78',
  '#3A3642',
  '#2A2630',
  '#221F28',
  '#1C1A21',
  '#16141B',
  '#0F0D12',
]

export const theme = createTheme({
  primaryColor: 'asurion',
  primaryShade: 5,
  colors: {
    asurion: asurionPurple,
    dark: asurionDark,
  },
  fontFamily: 'var(--font-apercu), sans-serif',
  headings: {
    fontFamily: 'var(--font-apercu), sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(40), lineHeight: '48px', fontWeight: '700' },
      h2: { fontSize: rem(32), lineHeight: '40px', fontWeight: '700' },
      h3: { fontSize: rem(24), lineHeight: '32px', fontWeight: '700' },
      h4: { fontSize: rem(20), lineHeight: '28px', fontWeight: '700' },
      h5: { fontSize: rem(16), lineHeight: '24px', fontWeight: '700' },
      h6: { fontSize: rem(14), lineHeight: '20px', fontWeight: '700' },
    },
  },
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
  },
  // AUI radius ramp. Panel chrome stays on --ew-radius-panel (16px) separately.
  defaultRadius: 'sm',
  radius: {
    xs: rem(2),
    sm: rem(8),
    md: rem(8),
    lg: rem(32),
    xl: rem(32),
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 9999,
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          backgroundColor: 'var(--aui-elevated-dynamic-card)',
          borderColor: 'var(--aui-outline)',
        },
      },
    }),
    Radio: Radio.extend({
      styles: {
        radio: {
          borderColor: 'var(--aui-outline)',
        },
      },
    }),
    PinInput: PinInput.extend({
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          borderColor: 'var(--aui-outline)',
          backgroundColor: 'var(--aui-elevated-level-01)',
          color: 'var(--aui-on-surface)',
          fontWeight: 500,
        },
      },
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        radius: 'lg',
        overlayProps: { backgroundOpacity: 0.45, blur: 2 },
      },
      styles: {
        content: {
          backgroundColor: 'var(--aui-surface)',
        },
        header: {
          backgroundColor: 'var(--aui-surface)',
        },
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        radius: 'sm',
      },
    }),
    SegmentedControl: SegmentedControl.extend({
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          backgroundColor: 'var(--aui-elevated-level-01)',
        },
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        radius: 'sm',
        withArrow: true,
      },
    }),
    Checkbox: Checkbox.extend({
      styles: {
        input: {
          borderColor: 'var(--aui-outline)',
        },
      },
    }),
  },
})

/** Map Mantine dark CSS variables onto the AUI dark token layer. */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    '--mantine-color-body': 'var(--aui-surface-page)',
    '--mantine-color-text': 'var(--aui-on-surface)',
    '--mantine-color-default-border': 'var(--aui-outline)',
    '--mantine-radius-default': 'var(--aui-border-radius-100)',
  },
  light: {},
  dark: {
    '--mantine-color-body': 'var(--aui-surface-page)',
    '--mantine-color-text': 'var(--aui-on-surface)',
    '--mantine-color-dimmed': 'var(--aui-on-surface-soft)',
    '--mantine-color-default': 'var(--aui-elevated-level-01)',
    '--mantine-color-default-hover': 'var(--aui-state-layer-hover)',
    '--mantine-color-default-border': 'var(--aui-outline)',
    '--mantine-color-default-color': 'var(--aui-on-surface)',
    '--mantine-color-placeholder': 'var(--aui-on-surface-faint)',
  },
})
