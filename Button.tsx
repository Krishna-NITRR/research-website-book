import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary: 'bg-purple shadow-md active:bg-purple-dark',
  outline: 'bg-transparent border-[1.5px] border-purple',
  ghost: 'bg-transparent border-[1.5px] border-gray-200 dark:border-zinc-800',
};

const textVariants = {
  primary: 'text-white',
  outline: 'text-purple',
  ghost: 'text-gray-600 dark:text-zinc-400',
};

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  className?: string;
}

export const Button = ({ onPress, title, variant = 'primary', loading, className }: ButtonProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} className={cn('flex-row items-center justify-center py-3 px-6 rounded-md transition-all active:scale-[0.98]', variants[variant], className)}>
      {loading ? <ActivityIndicator color={variant === 'primary' ? 'white' : '#6C4CF1'} /> : 
      <Text className={cn('font-montserrat font-bold text-[14px] tracking-wide', textVariants[variant])}>{title}</Text>}
    </Pressable>
  );
};