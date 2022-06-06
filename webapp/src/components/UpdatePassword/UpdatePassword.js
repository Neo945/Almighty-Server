import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function UpdatePassword(props) {
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
  });
  return (
    <div>
      <h1>Update Password</h1>
      <form>
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          value={state.password}
          onChange={(e) => {
            setState({ ...state, password: e.target.value });
          }}
        />
        <TextField
          label="Rewrite Password"
          variant="outlined"
          name="password2"
          type="password2"
          value={state.confirmPassword}
          onChange={(e) => {
            setState({ ...state, confirmPassword: e.target.value });
          }}
        />
        <Button type="submit" variant="contained" name="sumbit">
          Submit
        </Button>
      </form>
    </div>
  );
}
