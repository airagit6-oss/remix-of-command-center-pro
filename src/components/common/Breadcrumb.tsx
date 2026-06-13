import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb component for page navigation
 * Auto-generates breadcrumbs from URL path if items not provided
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || generateBreadcrumbsFromPath(location.pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn('flex items-center gap-1 text-sm text-gray-600', className)}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-cyan-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />

          {item.href && !item.isActive ? (
            <Link
              to={item.href}
              className="hover:text-cyan-600 transition-colors hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.isActive ? 'text-gray-900 font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

/**
 * Generate breadcrumb items from URL pathname
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const pathnames = pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return [];
  }

  let path = '';
  const breadcrumbs: BreadcrumbItem[] = [];

  pathnames.forEach((name, index) => {
    path += `/${name}`;
    const isLast = index === pathnames.length - 1;

    // Format label: convert-kebab-case to Title Case
    const label = formatBreadcrumbLabel(name);

    breadcrumbs.push({
      label,
      href: !isLast ? path : undefined,
      isActive: isLast,
    });
  });

  return breadcrumbs;
}

/**
 * Format breadcrumb label from URL segment
 */
function formatBreadcrumbLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
