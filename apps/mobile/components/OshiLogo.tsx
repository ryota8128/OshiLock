import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

// logo.svg のアイコン部分のみ（テキストなし）
const logoIconSvg = `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="28" r="26" stroke="#2b2a28" stroke-width="2" fill="none"/>
  <path d="M25 28H42" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M38 28v4" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M34 28v5" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
  <g transform="translate(19,28)">
    <circle cx="0" cy="0" r="4" stroke="#d4502a" stroke-width="1.8" fill="none"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(30)"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(60)"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(90)"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(120)"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(150)"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(180)"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(210)"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(240)"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(270)"/>
    <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(300)"/>
    <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(330)"/>
  </g>
</svg>`;

// logo.svg 全体（アイコン + テキスト横並び）
const logoFullSvg = `<svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(16,32)">
    <circle cx="28" cy="28" r="26" stroke="#2b2a28" stroke-width="2" fill="none"/>
    <path d="M25 28H42" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M38 28v4" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M34 28v5" stroke="#2b2a28" stroke-width="2.2" stroke-linecap="round"/>
    <g transform="translate(19,28)">
      <circle cx="0" cy="0" r="4" stroke="#d4502a" stroke-width="1.8" fill="none"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(30)"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(60)"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(90)"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(120)"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(150)"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(180)"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(210)"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(240)"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(270)"/>
      <line x1="0" y1="-6" x2="0" y2="-9.5" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(300)"/>
      <line x1="0" y1="-6" x2="0" y2="-7.8" stroke="#d4502a" stroke-width="1.4" stroke-linecap="round" transform="rotate(330)"/>
    </g>
  </g>
  <text x="96" y="76" font-family="system-ui, sans-serif" font-size="44px" font-weight="300" letter-spacing="1.6" fill="#2b2a28">OshiLock</text>
</svg>`;

type Props = {
  width?: number;
  variant?: 'full' | 'icon';
};

export function OshiLogo({ width = 240, variant = 'full' }: Props) {
  if (variant === 'icon') {
    return <SvgXml xml={logoIconSvg} width={width} height={width} />;
  }
  const height = width * (120 / 320);
  return <SvgXml xml={logoFullSvg} width={width} height={height} />;
}
