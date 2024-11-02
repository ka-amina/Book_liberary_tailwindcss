import {
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";
import Add from "./pages/add";
import Books from "./pages/Books";
import Update from "./pages/Update";
import View from "./pages/View";
import DeleteBooks from "./pages/DeletedBooks";


function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
       <Route path="/" element = {<Books/ >} />
       <Route path="/Add" element = {<Add/ >} />
       <Route path="/Update/:id" element = {<Update/ >} />
       <Route path="/View/:id" element = {<View/ >} />
       <Route path="/DeletedBooks" element = {<DeleteBooks/ >} />

      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
