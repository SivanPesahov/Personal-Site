import { Outlet } from "react-router-dom";
import Header from "./Header";
import LiquidEther from "../LiquidEther";
import ClickSpark from "../ClickSpark";

function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="w-full z-50">
          <Header />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </ClickSpark>
    </div>
  );
}

export default MainLayout;
