import styled from "styled-components";

import Button from "@components/commons/button/Button";

import { requestKakaoLogin } from "@utils/kakaoLogin";

// 실제 사용할 때는 원하는 페이지에 button onClick에 requestKakaoLogin만 주면 됨

const KakaoLoginTest = () => {
  return (
    <Test>
      <Button onClick={requestKakaoLogin}>카카오 로그인 테스트~~</Button>
    </Test>
  );
};

export default KakaoLoginTest;

const Test = styled.div`
  width: 37.5rem;
  height: 66.7rem;

  background-color: white;
`;
