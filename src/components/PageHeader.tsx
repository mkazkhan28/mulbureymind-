import React from "react";

/**
 * Shared page heading: eyebrow → H1 → lead line → short intro → actions.
 * Keeps every page's title hierarchy and spacing identical.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  intro,
  actions,
  aside,
  className = "",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={`page-title ${eyebrow ? "mt-3" : ""}`}>{title}</h1>
        {lead && <p className="page-lead mt-3">{lead}</p>}
        {intro && <p className="page-intro mt-2">{intro}</p>}
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}

/** H2 section heading with optional one-line intro and right-side action */
export function SectionHeader({ title, intro, action, id }: { title: React.ReactNode; intro?: React.ReactNode; action?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 id={id} className="section-title">{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
