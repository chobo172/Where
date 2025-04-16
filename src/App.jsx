import React, { useEffect, useState } from "react";
import "./index.css";
import { database } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const names = ["KWON", "加藤", "佐藤", "Tiago", "野久", "熊内", "筒井", "西川", "吉田"];
const locations = ["在室", "授業", "出張", "学内", "MTG", "IRES²", "NCR/VBL", "C2-602", "総研棟", "第5修研室", "第7修研室", "帰省", "帰宅"];

// 이름별 비밀번호 (자유롭게 수정 가능)
const passwords = {
  KWON: "1234",
  加藤: "5678",
  佐藤: "0000",
  Tiago: "1111",
  野久: "2222",
  熊内: "3333",
  筒井: "4444",
  西川: "5555",
  吉田: "6666"
};

function App() {
  const [selected, setSelected] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [password, setPassword] = useState("");

  // 🔁 로그인 유지: 새로고침 시 localStorage에서 복원
  useEffect(() => {
    const saved = localStorage.getItem("loggedInUser");
    if (saved) setLoggedInUser(saved);
  }, []);

  // 🔁 실시간 Firebase 데이터 불러오기
  useEffect(() => {
    const dbRef = ref(database, "positions");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelected(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ 로그인 처리
  const handleLogin = () => {
    if (passwords[selectedName] === password) {
      setLoggedInUser(selectedName);
      localStorage.setItem("loggedInUser", selectedName);
    } else {
      alert("password is incorrect");
    }
  };

  // ✅ 로그아웃
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  // ✅ 위치 선택
  const handleClick = (name, location) => {
    const updated = { ...selected, [name]: location };
    set(ref(database, "positions"), updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-left">✅現在位置表示</h1>

      {!loggedInUser ? (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex gap-2 mb-2 items-center">
            <label>Name</label>
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="border px-2 py-1"
            >
              <option value="">Select</option>
              {names.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-2 py-1"
              maxLength={4}
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="mb-1">✅ Logged in: <strong>{loggedInUser}</strong></p>
          <button onClick={handleLogout} className="text-sm text-red-500 underline">
            Logout
          </button>
        </div>
      )}

      <div className="w-full max-w-full overflow-x-auto shadow-xl rounded-lg">
        <table className="min-w-[900px] table-auto border border-black">
          <thead>
            <tr>
              <th className="border border-black bg-gray-200 px-4 py-2 sticky left-0 bg-white z-10">
                名前
              </th>
              {locations.map((loc) => (
                <th
                  key={loc}
                  className="border border-black bg-gray-100 px-4 py-2 text-sm text-center whitespace-nowrap"
                >
                  {loc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((name) => {
              const isMine = name === loggedInUser;
              return (
                <tr key={name}>
                  <td className="border border-black px-4 py-2 font-semibold bg-white sticky left-0 z-10">
                    {name}
                  </td>
                  {locations.map((loc) => (
                    <td
                      key={loc}
                      className={`border border-black px-4 py-2 text-center transition-all duration-200 ${
                        isMine
                          ? "cursor-pointer hover:bg-gray-200"
                          : "opacity-40 cursor-not-allowed"
                      } ${
                        selected[name] === loc ? "bg-black text-white font-bold" : ""
                      }`}
                      onClick={() => isMine && handleClick(name, loc)}
                    >
                      {selected[name] === loc ? "●" : ""}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;