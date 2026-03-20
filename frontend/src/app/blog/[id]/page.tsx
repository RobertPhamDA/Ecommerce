import { apiFetch, Comment, Post } from "@/lib/api";

import CommentsClient from "./comments-client";

export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = await apiFetch<Post>(`/api/posts/${postId}`);
  const comments = await apiFetch<Comment[]>(`/api/comments?post_id=${postId}`);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white overflow-hidden">
        {post.cover_image_url && (
          <div className="w-full aspect-video bg-zinc-50 border-b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
          {post.excerpt ? <p className="mt-3 text-base text-zinc-600">{post.excerpt}</p> : null}
          <div className="prose prose-zinc mt-8 max-w-none">
            <pre className="whitespace-pre-wrap text-sm md:text-base font-sans leading-relaxed">{post.content}</pre>
          </div>
        </div>
      </div>

      <CommentsClient postId={postId} initial={comments} />
    </div>
  );
}

