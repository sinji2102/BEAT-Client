import { IconCamera } from "@assets/svgs";
import TextField from "@components/commons/input/textField/TextField";
import Spacing from "@components/commons/spacing/Spacing";
import { nameFilter } from "@utils/useInputFilter";
import { ChangeEvent, useState } from "react";
import * as S from "../ModifyManage.styled";

interface Role {
  id: number;
  makerName: string;
  makerRole: string;
  makerPhoto: string;
}
interface RoleWrapperProps {
  id: number;
  role: Role;
  removeRole: (id: number) => void;
  onUpdateRole: (id: number, name: string, value: string) => void;
}

const RoleWrapper = ({ id, role, removeRole, onUpdateRole }: RoleWrapperProps) => {
  const { makerName, makerRole, makerPhoto } = role;
  const [postImg, setPostImg] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(makerPhoto || null);

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImg(file);

      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        const imageUrl = event.target?.result as string;
        setPreviewImg(imageUrl);
        onUpdateRole(id, "makerPhoto", imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateRole(id, name, value);
  };

  return (
    <S.RoleWrapper>
      <S.FileInputWrapper>
        {previewImg ? (
          <S.PreviewImageWrapper width={13.6} height={15.8}>
            <S.PreviewImage src={previewImg} alt="Preview" width={13.6} height={15.8} />
            {/*  <S.RemoveImageButton onClick={() => removeRole(id)} /> */}
          </S.PreviewImageWrapper>
        ) : (
          <>
            <S.HiddenFileInput
              type="file"
              id={`file-${id}`}
              onChange={uploadFile}
              disabled={true}
            />
            <S.CustomFileInput htmlFor={`file-${id}`} width={13.6} height={15.8}>
              <IconCamera width={"3.2rem"} />
            </S.CustomFileInput>
          </>
        )}
      </S.FileInputWrapper>
      <Spacing marginBottom="1.6" />
      <S.TextInputWrpper>
        <TextField
          type="input"
          name="makerName"
          value={makerName}
          onChange={handleInputChange}
          filter={nameFilter}
          narrow={true}
          placeholder="이름"
          disabled={true}
        />
        <TextField
          type="input"
          name="makerRole"
          value={makerRole}
          onChange={handleInputChange}
          narrow={true}
          placeholder="역할"
          disabled={true}
        />
      </S.TextInputWrpper>
    </S.RoleWrapper>
  );
};

export default RoleWrapper;
