import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";

export function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <button
      className="grid h-12 w-12 place-items-center rounded-full duration-150 hover:bg-gray-200"
      onClick={() => {
        if (location.key === "default") {
          navigate("/");
          return;
        }
        navigate(-1);
      }}
      title="Back"
    >
      <ArrowLeftIcon className="h-6 w-6" />
    </button>
  );
}
