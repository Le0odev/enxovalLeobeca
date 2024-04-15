import './global.css'
import './App.css';
import { Header } from './Header/Header';
import Checkitem from './Insert/Checkitem';
import { Footer } from './footer/Footer';





function App() {
  return (
    <div className="Header">
      <Header />
      
      <Checkitem />
      <Footer />
    </div>
  );
}

export default App;
