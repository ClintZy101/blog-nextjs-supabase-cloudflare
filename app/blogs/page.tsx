"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const pageSize = 1;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select();
        if (error) throw error;
        setBlogs(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [supabase]);

  const totalPages = Math.ceil((blogs?.length || 0) / pageSize);

  const getItemProps = (index: number) => ({
    variant: page === index ? "filled" : "text",
    color: page === index ? "blue" : "gray",
    onClick: () => setPage(index),
  });

  const next = () => {
    if (page === totalPages) return;
    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const paginatedBlogs = blogs?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="w-full text-center">
        <h1 className="font-bold text-2xl my-10">Blog Posts</h1>
      </div>

      <div>
        <Link href="/add-blog" className="bg-black hover:bg-white hover:border-4 hover:text-black border-4 border-black text-white px-4 py-2  transition-colors duration-300 font-semibold uppercase">
          Create a Blog
        </Link>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : paginatedBlogs?.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul >
          {paginatedBlogs?.map((post: any) => (
            <li className="my-10" key={post.id}>
              <h2 className="font-semibold text-xl">{post.title}</h2>
              <h3 className="my-5">Author: {post.author_email}</h3>
              <p>{post.content}</p>
              {/* <p>Author: {post.author}</p> */}
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between mt-4">
        <Button
          variant="text"
          color="blue"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={page === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <IconButton className="flex items-center justify-center" key={index + 1} {...getItemProps(index + 1)}>
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="text"
          color="blue"
          className="flex items-center gap-2"
          onClick={next}
          disabled={page === totalPages}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
