import type {
  Metadata,
} from "next";
import { notFound } from "next/navigation";

import {
  informationPages,
} from "@/data/information-pages";

interface InformationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return Object.keys(
    informationPages,
  ).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: InformationPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const page =
    informationPages[slug];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description:
      page.introduction,
  };
}

export default async function InformationPage({
  params,
}: InformationPageProps) {
  const { slug } =
    await params;

  const page =
    informationPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="container py-16 md:py-20">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-pink-100 pb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-500">
            {page.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-[#3F312B] md:text-5xl">
            {page.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {page.introduction}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {page.sections.map(
            (section) => (
              <section
                key={
                  section.heading
                }
              >
                <h2 className="text-2xl font-semibold text-[#3F312B]">
                  {
                    section.heading
                  }
                </h2>

                {section.paragraphs && (
                  <div className="mt-4 space-y-4 text-gray-600">
                    {section.paragraphs.map(
                      (paragraph) => (
                        <p
                          key={
                            paragraph
                          }
                          className="leading-7"
                        >
                          {paragraph}
                        </p>
                      ),
                    )}
                  </div>
                )}

                {section.items && (
                  <ul className="mt-4 space-y-3">
                    {section.items.map(
                      (item) => (
                        <li
                          key={item}
                          className="flex gap-3 leading-7 text-gray-600"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"
                          />

                          <span>
                            {item}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </section>
            ),
          )}
        </div>
      </article>
    </main>
  );
}
