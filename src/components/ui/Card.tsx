/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all hover:shadow-md',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
