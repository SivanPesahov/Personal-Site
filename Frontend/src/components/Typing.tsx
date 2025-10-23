import { useDarkMode } from "../contexts/DarkmodeContext";
import TextType from "./TextType";

function Typing({ strArr }: { strArr: string[] }) {
  const { darkMode } = useDarkMode();

  return (
    <>
      {strArr.map((str, i) => (
        <TextType
          key={i}
          text={[str]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          textColors={[darkMode ? "white" : "black"]}
        />
      ))}
    </>
  );
}

export default Typing;
