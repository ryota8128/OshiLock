import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

// userId のハッシュから背景色を決定
const AVATAR_COLORS = [
  '#E8A87C',
  '#D4A5A5',
  '#A5C4D4',
  '#C4D4A5',
  '#D4C4A5',
  '#A5A5D4',
  '#D4A5C4',
  '#A5D4C4',
  '#C4A5D4',
  '#D4D4A5',
  '#A5D4A5',
  '#D4A5A5',
];

function getColorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  avatarUrl?: string | null;
  displayName: string;
  userId: string;
  size?: 'sm' | 'md' | 'lg';
};

const SIZES = {
  sm: { container: 28, fontSize: 11 },
  md: { container: 36, fontSize: 14 },
  lg: { container: 72, fontSize: 28 },
};

export function Avatar({ avatarUrl, displayName, userId, size = 'md' }: Props) {
  const { container, fontSize } = SIZES[size];
  const borderRadius = container / 2;

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, { width: container, height: container, borderRadius }]}
      />
    );
  }

  const initial = displayName[0] || '?';
  const backgroundColor = getColorFromId(userId);

  return (
    <View
      style={[
        styles.container,
        { width: container, height: container, borderRadius, backgroundColor },
      ]}
    >
      <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  initial: {
    fontWeight: '600',
    color: colors.ink,
  },
  image: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
