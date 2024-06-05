import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import TabsHome from "@/components/home/TabsHome";
import { Carousel, Timeline } from "flowbite-react";
import {
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import { sendRequest } from "@/utils/api";
import Link from "next/link";

const getNews = async () => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 3,
      type: "News",
      sort: "-updatedAt",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  if (res.data) {
    return res.data;
  }
};

const getReview = async () => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 3,
      type: "Review",
      sort: "-updatedAt",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  if (res.data) {
    return res.data;
  }
};

const getTips = async () => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 3,
      type: "Tips",
      sort: "-updatedAt",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  if (res.data) {
    return res.data;
  }
};

const getQuestion = async () => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 3,
      type: "Question",
      sort: "-updatedAt",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  if (res.data) {
    return res.data;
  }
};

const App: React.FC = async () => {
  const session = await getServerSession(authOptions);

  const news = await getNews();

  const review = await getReview();

  const tips = await getTips();

  const question = await getQuestion();
  return (
    <div className="p-3 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col">
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
          <Carousel className="w-full" slide={false}>
            {news.result.map((x: any, index: number) => {
              return (
                <div key={index}>
                  {x.files.length > 0 ? (
                    <Link href={`/Post/${x._id}`} className="">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                        alt={x.title}
                      />
                    </Link>
                  ) : (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-56 sm:h-64 xl:h-80 2xl:h-96 place-content-center">
                      <p className="text-white text-4xl w-8/12 mx-auto text-center">
                        {x.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            {review.result.map((x: any, index: number) => {
              return (
                <div key={index}>
                  {x.files.length > 0 ? (
                    <Link href={`/Post/${x._id}`} className="">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                        alt={x.title}
                      />
                    </Link>
                  ) : (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-56 sm:h-64 xl:h-80 2xl:h-96 place-content-center">
                      <p className="text-white text-4xl w-8/12 mx-auto text-center">
                        {x.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            {tips.result.map((x: any, index: number) => {
              return (
                <div key={index}>
                  {x.files.length > 0 ? (
                    <Link href={`/Post/${x._id}`} className="">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                        alt={x.title}
                      />
                      {/* <p className="text-white text-4xl w-8/12 mx-auto text-center z-999">
                        {x.title}
                      </p> */}
                    </Link>
                  ) : (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-56 sm:h-64 xl:h-80 2xl:h-96 place-content-center">
                      <p className="text-white text-4xl w-8/12 mx-auto text-center">
                        {x.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </Carousel>
        </div>
        <br />
        <div className="flex w-full">
          <div className="w-4/12">
            <Timeline>
              {news.result.map((x: any, index: number) => {
                return (
                  <TimelineItem key={index}>
                    <TimelinePoint />
                    <TimelineContent className="w-11/12">
                      <TimelineTitle className="flex flex-col">
                        <Link href={`/Post/${x._id}`}>{x.title}</Link>
                        {/* {x.files.length > 0 ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                          alt=""
                        />
                      ) : (
                        <></>
                      )} */}
                      </TimelineTitle>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>
          <div className="w-4/12">
            <Timeline>
              {review.result.map((x: any, index: number) => {
                return (
                  <TimelineItem key={index}>
                    <TimelinePoint />
                    <TimelineContent className="w-11/12">
                      <TimelineTitle className="flex flex-col">
                        <Link href={`/Post/${x._id}`}>{x.title}</Link>
                        {/* {x.files.length > 0 ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                          alt=""
                        />
                      ) : (
                        <></>
                      )} */}
                      </TimelineTitle>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>
          <div className="w-4/12">
            <Timeline>
              {tips.result.map((x: any, index: number) => {
                return (
                  <TimelineItem key={index}>
                    <TimelinePoint />
                    <TimelineContent className="w-11/12">
                      <TimelineTitle className="flex flex-col">
                        <Link href={`/Post/${x._id}`}>{x.title}</Link>
                        {/* {x.files.length > 0 ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${x.files}`}
                          alt=""
                        />
                      ) : (
                        <></>
                      )} */}
                      </TimelineTitle>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>
        </div>
      </div>
      <TabsHome />
    </div>
  );
};

export default App;
