"use client";
import { Row, Col, Rate, Divider, Button, message } from "antd";
import "./book.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import BookLoader from "./BookLoader";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const ViewDetail = (props) => {
  const { dataBook } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refGallery = useRef(null);

  const images = dataBook?.items ?? [];

  const handleOnClickImage = () => {
    //get current index onClick
    // alert(refGallery?.current?.getCurrentIndex());
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    // refGallery?.current?.fullScreen()
  };

  const onChange = (value) => {
    console.log("changed", value);
  };

  const handleDeleteProduct = async (_id) => {
    const res = await sendRequest({
      url: `http://localhost:8000/api/v1/products/${_id}`,
      method: "DELETE",
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res && res.data) {
      message.success("Thành công");
      router.push("/Market");
    } else {
      message.error({ message: "Lỗi", description: res.message });
    }
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {dataBook && dataBook._id ? (
            <>
              <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    slideOnThumbnailOver={true} //onHover => auto scroll images
                    onClick={() => handleOnClickImage()}
                  />
                </Col>
                <Col md={14} sm={24}>
                  <Col md={0} sm={24} xs={24}>
                    <ImageGallery
                      ref={refGallery}
                      items={images}
                      showPlayButton={false} //hide play button
                      showFullscreenButton={false} //hide fullscreen button
                      renderLeftNav={() => <></>} //left arrow === <> </>
                      renderRightNav={() => <></>} //right arrow === <> </>
                      showThumbnails={false}
                    />
                  </Col>
                  <Col span={24}>
                    <div className="flex items-center gap-6">
                      <div className="createdBy">
                        Người bán: <a href="#">{dataBook?.createdBy?.name}</a>{" "}
                      </div>
                      {dataBook.createdBy._id === session?.user._id ? (
                        <Button
                          onClick={() => handleDeleteProduct(dataBook._id)}
                        >
                          Xóa sản phẩm
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <h1 className="name text-3xl md:text-5xl text-slate-800">
                      {dataBook?.name}
                    </h1>
                    <br />
                    <div className="price">
                      <span className="currency">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dataBook?.price ?? 0)}
                      </span>
                    </div>
                    <div className="delivery">
                      <div>
                        <span className="left-side">Địa chỉ: </span>
                        <span className="right-side">{dataBook?.address}</span>
                      </div>
                    </div>
                  </Col>
                </Col>
              </Row>
              <Divider />
              <Row>
                <div className="w-1/2">
                  <div>
                    <h2 className="text-3xl text-slate-800">Mô tả: </h2>
                    <br />
                    {dataBook?.description ? (
                      <span
                        className="description"
                        dangerouslySetInnerHTML={{
                          __html: dataBook?.description,
                          // __html: badWords(post?.content, {
                          //   replacement: "*",
                          //   blackList: (defaultList) => [...badWordList],
                          // }),
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Row>
            </>
          ) : (
            <BookLoader />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
