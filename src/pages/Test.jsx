import Spline from '@splinetool/react-spline';
// import Card from "../components/ModuleCard"
import ProdukCard from "../components/ProdukCard"

export default function Home() {
  return (
    <main className="bg-dark">
      <Spline
        scene="https://prod.spline.design/vXCLAC8yW6xqZurs/scene.splinecode"
      />
      {/* < Card /> */}
      <ProdukCard/>
    </main>
  );
}
