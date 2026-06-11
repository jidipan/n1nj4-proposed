import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import CityZeroPage from "./pages/CityZeroPage";
import NFTDetailPage from "./pages/NFTDetailPage";
import CityZeroStadiumPage from "./pages/CityZeroStadiumPage";
import MetaloftDetailPage from "./pages/CityZeroTaskDetails/MetaloftDetailPage";
import InjectivePassDetailPage from "./pages/CityZeroTaskDetails/InjectivePassDetailPage";
import N1NJ4DetailPage from "./pages/CityZeroTaskDetails/N1NJ4DetailPage";
import AiProjectDetailPage from "./pages/AiProjectDetails/AiProjectDetailPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardIdentityPage from "./pages/DashboardIdentityPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city-zero" element={<CityZeroPage />} />
            <Route path="/city-zero/stadium" element={<CityZeroStadiumPage />} />
            <Route path="/city-zero/metaloft" element={<MetaloftDetailPage />} />
            <Route path="/city-zero/injective-pass" element={<InjectivePassDetailPage />} />
            <Route path="/city-zero/n1nj4" element={<N1NJ4DetailPage />} />
            <Route path="/ai-project/:owner/:repo" element={<AiProjectDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/identity" element={<DashboardIdentityPage />} />
            <Route path="/citizen/:id" element={<DashboardIdentityPage publicView />} />
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/nft/:id" element={<NFTDetailPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
