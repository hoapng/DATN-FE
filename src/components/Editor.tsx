"use client";
// import ReactQuill from "react-quill";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Editor(props: any) {
  const { value, onChange } = props;
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <div className="content">
      <ReactQuill
        value={value}
        theme={"snow"}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}
