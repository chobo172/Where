import React, { useEffect, useState } from "react";
import "./index.css";
import { database } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const names = ["KWON", "加藤", "佐藤", "Tiago", "野久", "熊内", "筒井", "西川", "吉田"];

const locations = [
  "在室",
  "授業",
  "出張",
  "学内",
  "MTG",
  "IRES²",
  "NCR/VBL",
  "C2-602",
  "総研棟",
  "第5修研室",
  "第7修研室",
  "帰省",
  "帰宅"
];

const passwords = {
  KWON: "2223",
  加藤: "1813",
  佐藤: "3237",
  Tiago: "3283",
  野久: "3251",
  熊内: "3226",
  筒井: "3246",
  西川: "3252",
  吉田: "3274"
};

function App() {
  const [selected, setSelected] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 유지
  useEffect(() => {
    const saved = localStorage.getItem("loggedInUser");
    if (saved) setLoggedInUser(saved);
  }, []);

  // 위치 데이터 불러오기
  useEffect(() => {
    const dbRef = ref(database, "positions");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSelected(data);
    });

    return () => unsubscribe();
  }, []);

  // 비고 데이터 불러오기
  useEffect(() => {
    const dbRef = ref(database, "remarks");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setRemarks(data);
    });

    return () => unsubscribe();
  }, []);

  // 로그인
  const handleLogin = () => {
    if (passwords[selectedName] === password) {
      setLoggedInUser(selectedName);
      localStorage.setItem("loggedInUser", selectedName);
      setPassword("");
    } else {
      alert("password is incorrect");
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setLoggedInUser(null);
    setSelectedName("");
    setPassword("");
    localStorage.removeItem("loggedInUser");
  };

  // 위치 선택
  const handleClick = (name, location) => {
    const updated = { ...selected, [name]: location };
    set(ref(database, "positions"), updated);
  };

  // 비고 입력
  const handleRemarkChange = (name, value) => {
    const updated = { ...remarks, [name]: value };
    setRemarks(updated);
    set(ref(database, "remarks"), updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-3 text-center">
        🔬第2修研室現在位置🚀
      </h1>

      {/* 아이콘형 외부 링크 */}
      <div className="flex gap-4 mb-6 justify-center text-lg font-semibold flex-wrap">
        <a
          href="https://int.ee.tut.ac.jp/bio/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-600 hover:scale-110 transition duration-200"
        >
          🧬 BIO
        </a>

        <span className="text-gray-400">|</span>

        <a
          href="https://www.eiiris.tut.ac.jp/evers/Web/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 hover:scale-110 transition duration-200"
        >
          🌐 EVERS
        </a>
      </div>

      {/* 로그인 */}
      {!loggedInUser ? (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex gap-2 items-center flex-wrap">
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
              className="border px-2 py-1 w-20"
              maxLength={4}
            />

            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center">
          <p className="mb-1">
            ✅ Logged in: <strong>{loggedInUser}</strong>
          </p>

          <button
            onClick={handleLogout}
            className="text-sm text-red-500 underline"
          >
            Logout
          </button>
        </div>
      )}

      {/* 표 */}
      <div className="w-full max-w-full overflow-x-auto shadow-xl rounded-lg bg-white">
        <table className="min-w-[1100px] table-auto border border-black">
          <thead>
            <tr>
              <th className="border border-black bg-gray-200 px-4 py-2 sticky left-0 bg-white z-10">
                名前
              </th>

              {locations.map((loc) => (
                <th
                  key={loc}
                  className="border border-black bg-gray-100 px-4 py-2 text-sm whitespace-nowrap"
                >
                  {loc}
                </th>
              ))}

              <th className="border border-black bg-gray-200 px-4 py-2 whitespace-nowrap">
                備考
              </th>
            </tr>
          </thead>

          <tbody>
            {names.map((name) => {
              const isMine = name === loggedInUser;

              return (
                <tr key={name}>
                  <td className="border border-black px-4 py-2 font-semibold sticky left-0 bg-white z-10">
                    {name}
                  </td>

                  {locations.map((loc) => (
                    <td
                      key={loc}
                      onClick={() => isMine && handleClick(name, loc)}
                      className={`border border-black px-4 py-2 text-center transition-all duration-200 ${
                        isMine
                          ? "cursor-pointer hover:bg-gray-200"
                          : "opacity-40 cursor-not-allowed"
                      } ${
                        selected[name] === loc
                          ? "bg-black text-white font-bold"
                          : ""
                      }`}
                    >
                      {selected[name] === loc ? "●" : ""}
                    </td>
                  ))}

                  {/* 비고 */}
                  <td className="border border-black px-2 py-2 text-center">
                    {isMine ? (
                      <input
                        type="text"
                        value={remarks[name] || ""}
                        onChange={(e) =>
                          handleRemarkChange(name, e.target.value)
                        }
                        className="border px-2 py-1 text-sm w-32"
                        placeholder="入力..."
                        maxLength={10}
                      />
                    ) : (
                      <span className="text-sm">
                        {remarks[name] || ""}
                      </span>
                    )}
                  </td>
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