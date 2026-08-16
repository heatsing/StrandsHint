import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className="mb-8 text-sm text-stone-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link prefetch={false} href="/" className="hover:text-stone-900 hover:underline">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link prefetch={false} href={item.href} className="hover:text-stone-900 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-stone-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
