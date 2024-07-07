import * as S from "./ViewBottomSheet.styled";

import BottomSheet from "../BottomSheet";
import ContextBox from "@components/commons/contextBox/ContextBox";
import { ReactNode } from "react";

interface ViewBottomSheetProps {
  title?: string;
  boxTitle?: string;
  children?: ReactNode;
}

const ViewBottomSheet = ({ title, boxTitle, children, ...rest }: ViewBottomSheetProps) => {
  return (
    <S.ViewBottomSheetWrapper>
      <BottomSheet title={title}>
        <ContextBox customPadding="1.6rem 1.6rem" {...rest}>
          <S.BoxTitle customColor="pink_200">{boxTitle}</S.BoxTitle>
          <S.BoxDivider />
          {children}
        </ContextBox>
      </BottomSheet>
    </S.ViewBottomSheetWrapper>
  );
};

export default ViewBottomSheet;
