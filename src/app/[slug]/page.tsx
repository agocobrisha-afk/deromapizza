import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getPageBySlug } from "@/lib/queries";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-8 sm:pt-10">
        <h1
          className="text-2xl font-extrabold text-ink sm:text-[32px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {page.title}
        </h1>
        <div
          className="prose prose-neutral mt-6 max-w-none whitespace-pre-wrap leading-loose text-ink-soft"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {page.content}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
