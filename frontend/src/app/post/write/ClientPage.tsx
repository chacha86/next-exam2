"use client";

import client from "@/lib/backend/client";
import { useRouter } from "next/navigation";

export default function ClinetPage({}) {
  const router = useRouter();

  async function write(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const title = form._title.value;
    const content = form.content.value;
    const published = form.published.value;
    const listed = form.listed.value;

    if (title.length === 0) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (content.length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    const response = await client.POST("/api/v1/posts", {
      body: { title, content, published, listed },
      credentials: "include",
    });

    if (response.error) {
      alert(response.error.msg);
      return;
    }

    router.push(`/post/${response.data.data.id}`);
  }

  return (
    <>
      <div>글 작성</div>
      <form onSubmit={write} className="flex flex-col gap-2 w-1/4">
        <div className="flex gap-2">
          <label htmlFor="published">공개 여부 : </label>
          <input type="checkbox" name="published" value="true" />
        </div>
        <div className="flex gap-2">
          <label htmlFor="listed">검색 여부 : </label>
          <input type="checkbox" name="listed" value="true" />
        </div>
        <input
          type="text"
          name="_title"
          placeholder="제목"
          className="border"
        />
        <textarea
          name="content"
          placeholder="내용"
          rows={10}
          className="border"
        />
        <input type="submit" value="작성" />
      </form>
    </>
  );
}
