import bookComplete from "@assets/lottie/book-complete.json";
import Spacing from "@components/commons/spacing/Spacing";
import Lottie from "react-lottie-player";
import { useNavigate } from "react-router-dom";
import * as S from "./FreeBook.styled";

interface FreeBookProps {
  id: number;
  title: string;
}

const FreeBook = ({ id, title }: FreeBookProps) => {
  const navigate = useNavigate();

  const navigateGig = () => {
    navigate(`/gig/${id}`);
  };

  return (
    <S.Wrapper>
      <Lottie
        animationData={bookComplete}
        loop={false}
        play={true}
        style={{ width: "150px", height: "150px", margin: "120px auto 0" }}
      />
      <Spacing marginBottom="3.2" />

      <S.Title>{`${title} \n예매가 완료되었어요!`}</S.Title>
      <Spacing marginBottom="1" />

      <S.Description>입금자명은 예약자 이름과 동일하게 설정해주세요.</S.Description>

      <S.FloatingWrapper>
        <S.GigButtonBox onClick={navigateGig}>
          <S.GigText>예매내역 조회하기</S.GigText>
        </S.GigButtonBox>
      </S.FloatingWrapper>
    </S.Wrapper>
  );
};

export default FreeBook;
