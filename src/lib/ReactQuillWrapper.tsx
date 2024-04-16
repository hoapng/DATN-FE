import React from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

type Props = ReactQuillProps & {
  reactQuillRef?: React.Ref;
};

const ReactQuillWrapper = (props: Props) => {
  const { reactQuillRef, ...args } = props;
  const quill = ReactQuill.Quill;
  const font = quill.import("formats/font");
  const size = quill.import("attributors/style/size");

  quill.register(font, true);
  quill.register(size, true);
  return <ReactQuill ref={reactQuillRef} {...args} />;
};
export default ReactQuillWrapper;
