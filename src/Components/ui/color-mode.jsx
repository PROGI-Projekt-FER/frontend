'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { forwardRef } from 'react';
import { LuSun } from 'react-icons/lu';

// This ColorModeProvider enforces the light theme
export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="light" {...props} />
  );
}

// Always return "light" color mode
export function useColorMode() {
  return {
    colorMode: 'light',
    setColorMode: () => {}, // No-op function, does nothing
    toggleColorMode: () => {}, // No-op function, does nothing
  };
}

// Always return the light theme value
export function useColorModeValue(light, dark) {
  return light;
}

// Icon is fixed to the light mode icon
export function ColorModeIcon() {
  return <LuSun />;
}

// Button does nothing but displays the sun icon
export const ColorModeButton = forwardRef(function ColorModeButton(props, ref) {
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        variant="ghost"
        aria-label="Light theme only"
        size="sm"
        ref={ref}
        {...props}
        icon={<ColorModeIcon />}
        isDisabled // Disable the button to prevent any action
      />
    </ClientOnly>
  );
});
