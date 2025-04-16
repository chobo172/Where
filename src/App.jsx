import React, { useEffect, useState } from "react";
import "./index.css";
import { database } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const names = ["KWON", "加藤", "佐藤", "Tiago", "野久", "熊内", "筒井", "西川", "吉田"];
const locations = ["在室", "授業", "出張", "学内", "MTG", "IRES²", "NCR/VBL", "C2-602", "総研棟", "第5修研室", "第7修研室", "帰省", "帰宅"];

function App() {
  const [selected, setSelected] = useState({});

  // ✅ 실시간 데이터 불러오기
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

  // ✅ 클릭 시 Firebase에 저장
  const handleClick = (name, location) => {
    const updated = { ...selected, [name]: location };
    set(ref(database, "positions"), updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-left">✅現在位置表示</h1>
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
            {names.map((name) => (
              <tr key={name}>
                <td className="border border-black px-4 py-2 font-semibold bg-white sticky left-0 z-10">
                  {name}
                </td>
                {locations.map((loc) => (
                  <td
                    key={loc}
                    className={`border border-black px-4 py-2 text-center cursor-pointer transition-all duration-200 ${
                      selected[name] === loc
                        ? "bg-black text-white font-bold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => handleClick(name, loc)}
                  >
                    {selected[name] === loc ? "●" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;