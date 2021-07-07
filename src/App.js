import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Login from './views/login/login.view';
import Home from './views/home/home.view';
import {
   BrowserRouter as Router,
   Switch,
   Route
} from "react-router-dom";


function App() {
   return (
      <div className="App">
         <Router>
               <Switch>
                  <Route exact path="/">
                     <Login />
                  </Route>
                  <Route exact path="/user/:username/:token">
                     <Home />
                  </Route>
               </Switch>
         </Router>
      </div>
   );
}

export default App;
