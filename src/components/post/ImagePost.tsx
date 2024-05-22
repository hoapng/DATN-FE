"use client";
import { Carousel } from "antd";

const ImagePost = (props: any) => {
  const { files } = props;
  return (
    <>
      {files?.length > 1 ? (
        <Carousel arrows>
          {files.map((file: string, index: number) => (
            // <Image
            //   key={index}
            //   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${file}`}
            //   alt=""
            // />
            <img
              key={index}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${file}`}
              alt=""
              className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-contain"
            />
          ))}
        </Carousel>
      ) : (
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${files}`}
          alt=""
          className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-contain"
        />
      )}
    </>
  );
};

export default ImagePost;
