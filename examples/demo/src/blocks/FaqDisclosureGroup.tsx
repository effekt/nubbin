"use client";

import type { InferProps } from "@nubbin/core";
import { useState } from "react";
import type { faqItemSchema } from "./faqItem.schema";

type FaqItem = InferProps<typeof faqItemSchema>;

/**
 * The one client component in this demo, and it is here to be one: a block is a server component
 * — invoking a client reference on the server yields no host element, so `invokeBlock` rejects it
 * — and the supported shape is a server block whose host root contains client children. This is
 * that child, so the shape is exercised by a served page rather than assumed to work.
 *
 * `<details>` stays native, so every answer is still reachable with no JavaScript: the elements
 * toggle themselves, and this only adds the one thing they cannot do alone, which is move
 * together.
 */
export function FaqDisclosureGroup({
  items,
  itemClassName,
}: {
  items: readonly FaqItem[];
  itemClassName: string;
}) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const allOpen = open.size === items.length && items.length > 0;

  const setOne = (question: string, isOpen: boolean) => {
    const next = new Set(open);
    if (isOpen) {
      next.add(question);
    } else {
      next.delete(question);
    }
    setOpen(next);
  };

  return (
    <div>
      <button
        type="button"
        data-nubbin-faq-control="expand-all"
        onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((item) => item.question)))}
        className="rounded-md border border-current px-3 py-1.5 text-sm font-semibold underline focus:outline-none focus-visible:ring-2"
      >
        {allOpen ? "Collapse all" : "Expand all"}
      </button>
      <div className="mt-6 divide-y">
        {items.map((item) => (
          <details
            key={item.question}
            open={open.has(item.question)}
            onToggle={(event) => setOne(item.question, event.currentTarget.open)}
            className={`${itemClassName} group py-5`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4 shrink-0 motion-safe:transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-sm opacity-75">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
