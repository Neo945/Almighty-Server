import OAuth from "../OAuth/OAuth";
// import io from "socket.io-client";
import isEmail from "validator/lib/isEmail";
import { useState } from "react";
import lookup from "../lookup/Lookup";
import { Button, CircularProgress, TextField } from "@mui/material";

function UserEmail(props) {
  // const [socket, setSocket] = useState(null);
  const [state, setState] = useState({ email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [verify, setVarify] = useState(false);
  // useEffect(() => {
  //   setSocket(io("http://localhost:5000"));
  //   // if (socket) {
  //   //   socket.on("connect", () => {
  //   //     console.log("connected");
  //   //   });
  //   // }
  // }, [setSocket]);
  return (
    <>
      <div className="email-form">
        {loading ? <CircularProgress style={{ position: "absolute" }} /> : null}
        <form
          method="POST"
          action="/"
          onSubmit={async (e) => {
            if (verify) {
              e.preventDefault();
              setLoading(true);
              const { email, otp } = state;
              const response = await lookup(
                "POST",
                "/auth/verify/email",
                "",
                JSON.stringify({ email, otp })
              );
              if (response.success) {
                props.history.push("/done");
              } else {
                alert(response.message);
              }
              setLoading(false);
            } else {
              e.preventDefault();
              if (!isEmail(state.email)) {
                alert("Not a valid email");
              } else {
                const data = await lookup(
                  "POST",
                  "/auth/send/email",
                  "",
                  JSON.stringify(state)
                );
                console.log(data);
                if (data.success) {
                  setVarify(true);
                  if (data.success) {
                    setLoading(true);
                  } else alert("Something went wrong");
                } else {
                  alert(JSON.stringify(data.message, 2, 4));
                }
              }
            }
          }}
        >
          <TextField
            autoComplete="email"
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            value={state.email}
            onChange={(e) => {
              setState({ ...state, email: e.target.value });
            }}
          />
          {verify ? (
            <TextField
              label="OTP"
              variant="outlined"
              name="otp"
              type="otp"
              value={state.otp}
              onChange={(e) => {
                setState({ ...state, otp: e.target.value });
              }}
            />
          ) : null}{" "}
          <Button type="submit" variant="contained" name="sumbit">
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}

function Register(props) {
  return (
    <>
      <div className="register">
        <OAuth />
        <UserEmail />
      </div>
    </>
  );
}

export default Register;
