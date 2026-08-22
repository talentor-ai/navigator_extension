import { cva } from 'class-variance-authority';

export const editableTextVariants = cva(
  'rounded-sm border border-transparent px-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70',
  {
    variants: {
      purpose: {
        display: 'text-display tracking-tight',
        role: 'text-role',
        section: 'text-section uppercase tracking-[0.14em]',
        title: 'text-title',
        subtitle: 'text-subtitle',
        body: 'text-body',
        meta: 'text-meta',
        label: 'text-label',
      },
      weight: {
        regular: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      tone: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-accent',
        destructive: 'text-destructive',
        success: 'text-success',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      purpose: 'body',
      weight: 'regular',
      tone: 'default',
      align: 'left',
    },
  },
);
