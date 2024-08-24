import Loading from "@components/commons/loading/Loading";

import { useGetPerformanceDetail } from "@apis/domains/performances/queries";
import NotFound from "@pages/notFound/NotFound";

const Main = () => {
  const { data, isLoading } = useGetPerformanceDetail(116);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <NotFound />;
  }

  return <div>{data?.posterImage}</div>;
};

export default Main;
