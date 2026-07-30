import { notFound } from "next/navigation";
import { getPostById } from "@/lib/store/blog";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  return (
    <>
      {saved ? (
        <div className="a-card a-card-pad mb-5 max-w-3xl border-[#b9c6b3] bg-[#f2f6f0]">
          <p className="text-sm font-semibold text-[#3c5236]">✓ Публикация сохранена</p>
        </div>
      ) : null}
      <PostForm post={post} />
    </>
  );
}
