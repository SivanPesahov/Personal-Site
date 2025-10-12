import {
  useEffect,
  useRef,
  useReducer,
  useMemo,
  useCallback,
  useId,
  useInsertionEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.service";
import type { User } from "../types/userType";

type ActionType = "increment" | "decrement" | "double";

function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const ids = {
    increment: useId(),
    decrement: useId(),
    double: useId(),
  };

  // useRef - persists a value across renders without causing re-renders
  const renderCount = useRef(0);

  // useReducer - manages complex state logic through actions
  const [count, dispatch] = useReducer((state: number, action: ActionType) => {
    switch (action) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      case "double":
        return state * 2;
      default:
        return state;
    }
  }, 0);

  // useMemo - memoizes an expensive computation to avoid recalculating on every render
  const sortedUsers = useMemo(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => a.username.localeCompare(b.username));
  }, [users, searchTerm]);

  // useCallback - memoizes a function so it's not recreated on every render
  const handleClick = useCallback(() => {
    console.log("Clicked!");
  }, []);

  // useInsertionEffect - runs before DOM mutations, used mainly for styling libraries (React 18+)
  useInsertionEffect(() => {
    // Example: Add class for a CSS-in-JS library
  }, []);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const { data } = await api.get("/Auth/getAllUsers");
        setUsers(data);
      } catch (error: any) {
        console.log(error);
      }
    }
    getAllUsers();
  }, []);

  // debugging tool - used with vs code debugger or chrome devtools
  // debugger;

  return (
    <>
      <h1>Users</h1>
      <ul>
        {sortedUsers.map((user: User, index: number) => (
          <li key={index}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            setSearchParams({ search: value });
          } else {
            setSearchParams({});
          }
        }}
        placeholder="Search for user..."
      />

      <h2>Count: {count}</h2>
      <ul>
        {["increment", "decrement", "double"].map((action) => (
          <button
            key={ids[action as keyof typeof ids]}
            onClick={() => dispatch(action as ActionType)}
          >
            {action}
          </button>
        ))}
      </ul>

      <h2>Render Count: {renderCount.current++}</h2>

      <button onClick={handleClick}>Click me (useCallback)</button>
    </>
  );
}

export default HomePage;
