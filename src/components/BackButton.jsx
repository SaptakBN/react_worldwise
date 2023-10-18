import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClickFun={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
      type="back"
    >
      {" "}
      Back
    </Button>
  );
}
