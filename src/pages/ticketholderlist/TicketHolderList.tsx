import { useTicketPatch, useTicketRetrive, useTicketUpdate } from "@apis/domains/tickets/queries";
import { IconCheck } from "@assets/svgs";
import Button from "@components/commons/button/Button";
import Loading from "@components/commons/loading/Loading";
import MetaTag from "@components/commons/meta/MetaTag";
import Toast from "@components/commons/toast/Toast";
import { NAVIGATION_STATE } from "@constants/navigationState";
import { useHeader, useModal, useToast } from "@hooks";
import { PatchFormDataProps } from "@typings/deleteBookerFormatProps";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Banner from "./components/banner/Banner";
import ManagerCard from "./components/managercard/ManagerCard";
import NarrowDropDown from "./components/narrowDropDown/NarrowDropDown";
import eximg from "./constants/silkagel.png";
import { BookingListProps } from "./constants/ticketholderlist";
import * as S from "./TicketHolderList.styled";

const TicketHolderList = () => {
  const { performanceId } = useParams();
  const [reservedCount, setReservedCount] = useState(0);

  //판매 완료 여부에 따라 배너 렌더링 달라질 지 고민
  const [isOutdated, setIsOutdated] = useState(false);

  // 0, undefined 일 때는 전체 렌더링 (필터링을 위한 state들)
  const [schedule, setSchedule] = useState(0); //1,2,3 에 따라 필터링
  const [payment, setPayment] = useState<
    "CHECKING_PAYMENT" | "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | undefined
  >(undefined);

  const [isEditMode, setIsEditMode] = useState(false);

  const { data, isLoading, refetch } = useTicketRetrive({ performanceId: Number(performanceId) });
  const [paymentData, setPaymentData] = useState<BookingListProps[]>();
  const [alreadyPayments, setAlreadyPayments] = useState<Record<number, boolean>>({});
  const { showToast, isToastVisible } = useToast();

  useEffect(() => {
    console.log("data:", data);
    setPaymentData(data?.bookingList ?? []);

    if (data?.bookingList) {
      const immutableAlreadyPayments = data.bookingList.reduce(
        (acc, item) => {
          acc[item.bookingId] = item.bookingStatus === "BOOKING_CONFIRMED";
          return acc;
        },
        {} as Record<number, boolean>
      );

      setAlreadyPayments(immutableAlreadyPayments);
    }
  }, [data]);

  const { openConfirm, closeConfirm } = useModal();
  const { mutate, mutateAsync } = useTicketUpdate();
  const { mutate: patchMutate, mutateAsync: patchMutateAsync, isPending } = useTicketPatch();
  const handlePaymentFixAxiosFunc = () => {
    if (isPending) {
      return;
    }
    //PUT API 요청
    mutate({
      performanceId: Number(performanceId),
      performanceTitle: data?.performanceTitle,
      totalScheduleCount: data?.totalScheduleCount,
      bookingList: paymentData,
    });
    closeConfirm();
    showToast();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handlePaymentFixBtn = () => {
    openConfirm({
      title: "선택한 게스트를 입금 처리하겠습니까?",
      subTitle: "입금 완료로 변경된 예매자에게\n 입금 확인 완료 웹발신이 발송돼요.",
      okText: "저장할게요",
      noText: "아니요",
      okCallback: handlePaymentFixAxiosFunc,
      noCallback: closeConfirm,
    });
  };

  const [patchFormData, setPatchFormData] = useState<PatchFormDataProps>({
    performanceId: Number(performanceId),
    bookingList: [],
  });

  const handleBookerPatchAxiosFunc = async () => {
    await patchMutateAsync(patchFormData);

    console.log("패치요청 보냄");
    closeConfirm();

    //window.location.reload();
  };

  const handleDeleteBtn = () => {
    openConfirm({
      title: "선택한 게스트를 삭제하시겠어요?",
      subTitle: "삭제된 게스트는 복구되지 않아요.",
      okText: "삭제할게요",
      noText: "아니요",
      okCallback: handleBookerPatchAxiosFunc,
      noCallback: closeConfirm,
    });
  };

  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("/gig-manage");
  };

  const handleLeftButton = () => {
    openConfirm({
      title: "화면을 나갈까요?",
      subTitle: "'상태 저장' 없이 화면을 나갈 경우,\n 수정 내용이 저장되지 않아요.",
      okText: "계속할게요",
      noText: "나갈게요",
      okCallback: closeConfirm,
      noCallback: handleNavigateBack,
    });
  };

  const { setHeader } = useHeader();

  const handleCloseButton = () => {
    setIsEditMode(false);

    //원 상태도 되돌림 (입금 여부 수정, 삭제용 체크)
    setPaymentData(data?.bookingList);
    setPatchFormData({
      performanceId: Number(performanceId),
      bookingList: [],
    });

    refetch();
    setHeader({
      headerStyle: NAVIGATION_STATE.ICON_TITLE_SUB_TEXT,
      title: "예매자 관리",
      subText: "편집",
      leftOnClick: handleLeftButton,
      rightOnClick: handleEditButton,
    });
  };

  const handleEditButton = () => {
    setIsEditMode(true);
    setHeader({
      headerStyle: NAVIGATION_STATE.ICON_TITLE_SUB_TEXT,
      title: "예매자 편집",
      subText: "닫기",
      leftOnClick: handleLeftButton,
      rightOnClick: handleCloseButton,
    });
  };

  useEffect(() => {
    setHeader({
      headerStyle: NAVIGATION_STATE.ICON_TITLE_SUB_TEXT,
      title: "예매자 관리",
      subText: "편집",
      leftOnClick: handleLeftButton,
      rightOnClick: handleEditButton,
    });
  }, [setHeader]);

  const count = data?.totalScheduleCount; //api로 받아온 값 (동적 회차 수)

  //최대 10회차로 렌더링 될 수 있도록 변경 필요
  //schedule ===0 -> 전체 회차, payment === undefined -> 전체 입금 여부
  const filteredData = paymentData?.filter((obj) => {
    const isScheduleMatched =
      schedule === 0 ||
      (obj.scheduleNumber === "FIRST" && schedule === 1) ||
      (obj.scheduleNumber === "SECOND" && schedule === 2) ||
      (obj.scheduleNumber === "THIRD" && schedule === 3) ||
      (obj.scheduleNumber === "FOURTH" && schedule === 4) ||
      (obj.scheduleNumber === "FIFTH" && schedule === 5) ||
      (obj.scheduleNumber === "SIXTH" && schedule === 6) ||
      (obj.scheduleNumber === "SEVENTH" && schedule === 7) ||
      (obj.scheduleNumber === "EIGHTH" && schedule === 8) ||
      (obj.scheduleNumber === "NINTH" && schedule === 9) ||
      (obj.scheduleNumber === "TENTH" && schedule === 10);

    const isPaymentMatched =
      obj.bookingStatus !== "BOOKING_CANCELLED" &&
      (payment === undefined || payment === obj.bookingStatus);

    return isScheduleMatched && isPaymentMatched;
  });

  useEffect(() => {
    const totalCount = filteredData?.reduce(
      (totalSum, obj) => (obj.purchaseTicketCount as number) + totalSum,
      0
    ) as number;
    setReservedCount(totalCount);

    console.log(filteredData);
  }, [filteredData]);

  const handlePaymentToggle = (_isEditMode: boolean, bookingId?: number) => {
    //Edit(편집) 모드 일때만 바뀌도록
    if (_isEditMode) {
      setPaymentData((arr) =>
        arr?.map((item) =>
          item.bookingId === bookingId
            ? {
                ...item,
                //예매 확정(입금 완료) <-> 입금 확인 중(미입금) 변경되도록
                bookingStatus:
                  item.bookingStatus === "BOOKING_CONFIRMED"
                    ? "CHECKING_PAYMENT"
                    : "BOOKING_CONFIRMED",
              }
            : item
        )
      );
    }
  };
  return (
    <>
      <MetaTag title="예매자 확인 및 상태변경" />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isPending && <Loading />}
          <Banner
            title={data?.performanceTitle}
            image={eximg}
            reservedCount={reservedCount}
            isOutdated={isOutdated}
          />
          <S.BodyWrapper>
            <S.BodyLayout>
              <S.LayoutHeaderBox>
                <S.LayoutFilterBox>
                  {/*set 함수 직접 넘기는 거 안좋다고 했지만, 내부에서 감싸야 하므로 넘김 */}
                  <NarrowDropDown
                    schedule={schedule}
                    payment={payment}
                    totalScheduleCount={count}
                    setSchedule={setSchedule}
                  >
                    모든 회차
                  </NarrowDropDown>
                  <NarrowDropDown
                    schedule={schedule}
                    payment={payment}
                    totalScheduleCount={count}
                    setPayment={setPayment}
                  >
                    입금 상태
                  </NarrowDropDown>
                </S.LayoutFilterBox>
              </S.LayoutHeaderBox>
              {filteredData?.map((obj, index) => (
                <ManagerCard
                  key={`managerCard-${index}`}
                  patchFormData={patchFormData}
                  setPatchFormData={setPatchFormData}
                  isEditMode={isEditMode}
                  bookingId={obj.bookingId}
                  isPaid={obj.bookingStatus}
                  setPaid={() => handlePaymentToggle(isEditMode, obj.bookingId)}
                  bookername={obj.bookerName}
                  purchaseTicketeCount={obj.purchaseTicketCount}
                  scheduleNumber={obj.scheduleNumber}
                  bookerPhoneNumber={obj.bookerPhoneNumber}
                  createAt={obj.createdAt}
                  alreadyBookingConfirmed={alreadyPayments[obj.bookingId]}
                />
              ))}

              {isEditMode ? (
                <S.FooterButtonWrapper>
                  <S.FooterButtonText>저장 후, 입금 상태 재변경은 불가능합니다.</S.FooterButtonText>
                  <S.TwoButtonWrapper>
                    <Button size={"medium"} variant={"gray"} onClick={handleDeleteBtn}>
                      예매자 삭제하기
                    </Button>
                    <Button size={"medium"} onClick={handlePaymentFixBtn}>
                      입금 처리하기
                    </Button>
                  </S.TwoButtonWrapper>
                </S.FooterButtonWrapper>
              ) : (
                <>
                  <S.FooterButtonWrapper>
                    <S.FooterButtonText>
                      예매자 정보를 CSV 파일로 저장할 수 있어요.
                    </S.FooterButtonText>
                    <S.MarginBottom $value="2.4rem">
                      <Button onClick={() => console.log("csv 추출 로직 구현 예정")}>
                        예매자 목록 다운받기
                      </Button>
                    </S.MarginBottom>
                  </S.FooterButtonWrapper>
                  <Toast icon={<IconCheck />} isVisible={isToastVisible} toastBottom={37}>
                    예매 확정 WEB 발신 문자가 전송되었습니다.
                  </Toast>
                </>
              )}
            </S.BodyLayout>
          </S.BodyWrapper>
        </>
      )}
    </>
  );
};

export default TicketHolderList;
