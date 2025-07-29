import './App.css'
import ClockHeading from "./components/ClockHeading";
import CurrentTime from "./components/CurrentTime";
import ClockSlogan from"./components/ClockSlogan";
import "bootstrap/dist/css/bootstrap.min.css";
function App(){
  return (<center>
    <ClockHeading></ClockHeading>
    <ClockSlogan></ClockSlogan>
    <CurrentTime></CurrentTime></center>
  );
}
export default App;