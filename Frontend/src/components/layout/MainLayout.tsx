import { Outlet } from "react-router-dom";
import Header from "./Header";
import ClickSpark from "../ClickSpark";
import { Meteors } from "../ui/meteors";

function MainLayout() {
  return (
    <div className="relative min-h-full flex flex-col">
      <div className="fixed inset-0 w-screen h-full -z-10 pointer-events-none">
        <Meteors number={30} />
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
