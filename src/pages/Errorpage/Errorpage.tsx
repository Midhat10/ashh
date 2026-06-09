import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

function Errorpage() {
  const navigate = useNavigate();
  const goHome = () => navigate("/vacancies", { replace: true });
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>

        <h2 style={{ textAlign: "center" }}>{error.statusText}</h2>
        <h3 style={{ textAlign: "center" }}>{error.data}</h3>
        <button style={{ position: "relative", left: "50%" }} onClick={goHome}>
          Go Home
        </button>
      </div>
    );
  }
  throw error;
}

export default Errorpage;
