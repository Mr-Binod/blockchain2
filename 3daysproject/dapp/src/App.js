import { BrowserRouter, Routes, Route } from "react-router-dom"
import Mainpage from "./components/pages/Mainpage";
import Mypage from "./components/pages/Mypage";
import { Loginpage } from "./components/pages/Loginpage";
import { useSelector } from "react-redux";


function App() {
  const islogin = useSelector((state) => state.LoginReducer.State)
  return (
    <div className="App">
      <BrowserRouter>

        {!islogin ?
          <Routes>
            <Route path="/" element={<Loginpage />} />
          </Routes> :
          <Routes>
            <Route path="/main" element={<Mainpage />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>}
      </BrowserRouter>
    </div>
  );
}

export default App;
