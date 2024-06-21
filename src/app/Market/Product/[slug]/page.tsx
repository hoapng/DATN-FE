"use client";
import ViewDetail from "@/components/product/ViewDetail";
import { sendRequest } from "@/utils/api";
import { useEffect, useState } from "react";

const BookPage = ({ params }) => {
  const [dataBook, setDataBook] = useState();

  const { slug } = params; // slug

  useEffect(() => {
    fetchBook(slug);
  }, [slug]);

  const fetchBook = async (slug) => {
    const res = await sendRequest({
      url: `http://localhost:8000/api/v1/products/${slug}`,
      method: "GET",
      queryParams: {
        populate: "createdBy",
      },
      nextOption: {
        cache: "no-store",
      },
    });

    if (res && res.data) {
      let raw = res.data;
      //process data
      raw.items = getImages(raw);

      setTimeout(() => {
        setDataBook(raw);
      }, 1000);
    }
  };

  const getImages = (raw) => {
    const images = [];
    // if (raw.thumbnail) {
    //   images.push({
    //     original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
    //       raw.thumbnail
    //     }`,
    //     thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
    //       raw.thumbnail
    //     }`,
    //     originalClass: "original-image",
    //     thumbnailClass: "thumbnail-image",
    //   });
    // }
    if (raw.files) {
      raw.files?.map((item) => {
        images.push({
          original: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${item}`,
          thumbnail: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }
    return images;
  };
  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};

export default BookPage;
