export const colors = {
  ink: '#2B2A28',
  inkSoft: '#7A756C',
  paper: '#FAF8F4',
  paperWarm: '#F3EFE4',
  white: '#FFFFFF',
  border: 'rgba(43,42,40,0.1)',
  borderLight: 'rgba(43,42,40,0.08)',
  borderMedium: 'rgba(43,42,40,0.12)',
  borderStrong: 'rgba(43,42,40,0.2)',
  tabBarBg: 'rgba(255,255,255,0.92)',
  unreadDot: '#D4502A',
  urgentBg: '#C24520',
  watchedRose: '#A03030',
  watchedRoseBg: '#F5E8E5',
  watchedRoseBorder: '#D9B8B0',
  officialGreen: '#2E7A50',
  officialGreenBg: '#E5F2EB',
  officialGreenBorder: '#B0D4BF',
  medalGold: '#B89A30',
  medalSilver: '#8888A0',
  medalBronze: '#A07040',
  rankBadgeBg: '#F5F0D8',
  rankBadgeBorder: '#D8CC98',
  rankBadgeText: '#7A6820',
} as const;

export const categoryColors = {
  event: { bg: '#F5DCD8', fg: '#A03828', line: '#D4A098', label: 'イベント' },
  media: { bg: '#F0D8F0', fg: '#7828A0', line: '#C098D4', label: 'メディア' },
  sns: { bg: '#D8ECF5', fg: '#2868A0', line: '#98C4D4', label: 'SNS' },
  news: { bg: '#E8E8E8', fg: '#585858', line: '#B0B0B0', label: 'ニュース' },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenPadding: 16,
  cardGap: 8,
  sectionGap: 18,
  tabBarHeight: 78,
  tabBarPadding: 100,
} as const;

export const radii = {
  card: 12,
  cardLarge: 14,
  badge: 3,
  pill: 999,
  avatar: 999,
  button: 12,
  widget: 14,
  infoBox: 10,
} as const;

export const typography = {
  heading: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  title: {
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 20,
    color: colors.ink,
  },
  body: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.ink,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: colors.inkSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: colors.inkSoft,
  },
  meta: {
    fontSize: 10,
    fontWeight: '400' as const,
    color: colors.inkSoft,
  },
} as const;
