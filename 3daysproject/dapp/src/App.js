import{BrowserRouter, Routes, Route} from "react-router-dom"
import Mainpage from "./components/pages/Mainpage";
import Mypage from "./components/pages/Mypage";

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
