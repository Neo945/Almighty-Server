import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Login,
  Register,
  RegistrationForm,
  UpdatePassword,
} from "./components";

function App(props) {
  const history = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login history={history} />} />
        <Route path="/done" element={<div>Check your mail</div>} />
        <Route path="/register" element={<Register history={history} />} />
        <Route
          path="/update/pass"
          element={<UpdatePassword history={history} />}
        />
        <Route
          path="/register/form"
          element={<RegistrationForm history={history} />}
        />
      </Routes>
    </div>
  );
}

export default App;
