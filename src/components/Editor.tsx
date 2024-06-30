"use client";
// import ReactQuill from "react-quill";
import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const QuillComponent = ({ forwardedRef, ...props }: any) => {
      return <RQ ref={forwardedRef} {...props} />;
    };

    QuillComponent.displayName = "QuillComponent";

    return QuillComponent;
  },
  { ssr: false }
);
import * as nsfwjs from "nsfwjs";
import { message } from "antd";

export default function Editor(props: any) {
  const { value, onChange } = props;
  const reactQuillRef = useRef<any>();
  const insertImage = (e: any) => {
    let quillObj = reactQuillRef.current?.getEditor();
    const range = quillObj.getSelection();
    quillObj.editor.insertEmbed(range.index, "image", e.target.result);
  };
  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      var file: any = input && input.files ? input.files[0] : null;
      let reader = new FileReader();

      reader.onload = async (e: any) => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = async function () {
          const model = await nsfwjs.load();
          const predictions = await model.classify(img);
          let isSafe = predictions.every((pred) => {
            if (
              (pred.className === "Porn" ||
                pred.className === "Sexy" ||
                pred.className === "Hentai") &&
              pred.probability > 0.2
            )
              return false;
            return true;
          });

          if (isSafe) {
            insertImage(e);
          } else {
            message.error("Hình ảnh không phù hợp!");
          }
        };
      };

      reader.readAsDataURL(file);
    };
  }, []);

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

  // const handleImagePaste = (e) => {
  //   const items = e.clipboardData.items[0].getData(); // Lấy tệp ảnh từ clipboard;
  //   console.log(items);
  // };

  // async function imageHandler2() {
  //   const input = document.createElement("input");

  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();
  //   input.onchange = async () => {
  //     var file: any = input && input.files ? input.files[0] : null;
  //     let reader = new FileReader();

  //     reader.onload = async (e) => {
  //       let img = new Image();
  //       img.src = e.target.result;

  //       console.log("e", e);

  //       img.onload = async function () {
  //         const model = await nsfwjs.load();
  //         const predictions = await model.classify(img);
  //         console.log("predictions", predictions);
  //         // let isSafe = predictions.every((pred) => {
  //         //   if (
  //         //     (pred.className === "Porn" ||
  //         //       pred.className !== "Sexy" ||
  //         //       pred.className !== "Hentai") &&
  //         //     pred.probability < 0.01
  //         //   )
  //         //     return true;
  //         //   return true;
  //         // });

  //         // console.log("isSafe", isSafe);

  //         // if (isSafe) {
  //         let quillObj = reactQuillRef.current?.getEditor();
  //         console.log(quillObj);
  //         const range = quillObj.getSelection();
  //         quillObj.editor.insertEmbed(range.index, "image", e.target.result);
  //         // } else {
  //         //   alert("Hình ảnh không phù hợp!");
  //         // }
  //       };
  //     };

  //     reader.readAsDataURL(file);
  //   };
  // }

  return (
    <div className="content">
      <ReactQuill
        // ref={(el) => {
        //   reactQuillRef = el;
        // }}
        forwardedRef={reactQuillRef}
        value={value}
        theme={"snow"}
        onChange={onChange}
        // onPaste={handleImagePaste}
        modules={modules}
      />
    </div>
  );
}
