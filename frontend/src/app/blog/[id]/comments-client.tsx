"use client";

import { useState } from "react";

import { apiFetch, Comment } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CommentsClient({ postId, productId, initial }: { postId?: number; productId?: number; initial: Comment[] }) {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initial);
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const add = async () => {
    setErr(null);
    if (!token) {
      setErr("Login required to comment.");
      return;
    }
    const body = postId ? { post_id: postId, content } : { product_id: productId, content };
    const created = await apiFetch<Comment>("/api/comments", {
      method: "POST",
      token,
      body: JSON.stringify(body)
    });
    setComments([created, ...comments]);
    setContent("");
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="text-sm font-medium">Comments</div>
      <div className="mt-3 flex gap-2">
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="rounded-md bg-black px-4 py-2 text-sm text-white" onClick={add}>
          Post
        </button>
      </div>
      {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}

      <div className="mt-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border p-3">
            <div className="text-xs text-zinc-600">User {c.user_id ?? "?"}</div>
            <div className="mt-1 text-sm">{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

