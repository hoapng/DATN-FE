"use client";
// import ReactQuill from "react-quill";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as nsfwjs from "nsfwjs";

export default function Editor(props: any) {
  const { value, onChange } = props;
  const modules = {
    toolbar: {
      container: [
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
      handlers: {
        image: imageHandler,
      },
    },
  };

  async function imageHandler() {
    let fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.click();

    fileInput.onchange = async () => {
      let file = fileInput.files[0];
      let reader = new FileReader();

      reader.onload = async (e) => {
        let img = new Image();
        img.src = e.target.result;

        img.onload = async function () {
          const model = await nsfwjs.load();
          const predictions = await model.classify(img);
          let isSafe = predictions.every(
            (pred) => pred.className !== "Porn" && pred.className !== "Sexy"
          );

          if (isSafe) {
            let quill = reactQuillRef.getEditor();
            let range = quill.getSelection();
            quill.insertEmbed(range.index, "image", e.target.result);
          } else {
            alert("Hình ảnh không phù hợp!");
          }
        };
      };

      reader.readAsDataURL(file);
    };
  }

  return (
    <div className="content">
      <ReactQuill
        ref={(el) => {
          reactQuillRef = el;
        }}
        value={value}
        theme={"snow"}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}
