import ViewDetail from "@/components/product/ViewDetail";
import { sendRequest } from "@/utils/api";
import { clean, cleanCustom } from "@/utils/filter";

const fetchBook = async (slug: any) => {
  const res = (await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}`,
    method: "GET",
    queryParams: {
      populate: "createdBy",
    },
    nextOption: {
      cache: "no-store",
    },
  })) as any;

  if (res && res.data) {
    let raw = res.data;
    //process data
    raw.items = getImages(raw);
    const [name, address, description] = await Promise.all([
      await clean(raw.name),
      await clean(raw.address),
      await cleanCustom(raw.description),
    ]);
    raw.name = name;
    raw.address = address;
    raw.description = description;
    return raw;
  }
};

const getImages = (raw: any) => {
  const images: any = [];
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
    raw.files?.map((item: any) => {
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

const BookPage = async ({ params }: any) => {
  const { slug } = params; // slug

  const dataBook = await fetchBook(slug);

  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};

export default BookPage;
