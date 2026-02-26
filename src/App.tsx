
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/pizza-redesign/Navbar';
import Footer from './components/pizza-redesign/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import TradingHours from './pages/TradingHours';
import ContactUs from './pages/ContactUs';

export default function App() {
  return (
    <Router>
      <div className="font-opensans bg-white min-h-screen text-gray-800 antialiased overflow-x-hidden selection:bg-brand-red selection:text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/trading-hours" element={<TradingHours />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
