import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";
import "./index.css";

const names = ["KWON", "加藤", "佐藤", "Tiago", "野久", "熊内", "筒井", "西川", "吉田"];
const locations = [
  "在室", "授業", "出張", "学内", "MTG", "IRES²", "NCR/VBL",
  "C2-602", "総研棟", "第5修研室", "第7修研室", "帰省", "帰宅"
];

function App() {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const stateRef = ref(database, "selected");
    onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelected(data);
      }
    });
  }, []);

  const handleClick = (name, location) => {
    const newState = {
      ...selected,
      [name]: location
    };
    set(ref(database, "selected"), newState);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        📍 현재 위치 표시 테이블 (실시간 공유)
      </h1>
      <div className="w-full max-w-full overflow-x-auto shadow-xl rounded-lg">
        <table className="min-w-[700px] table-auto border border-black text-sm sm:text-base">
          <thead>
            <tr>
              <th className="border border-black bg-gray-200 px-2 py-1 sticky left-0 bg-white z-10">
                이름
              </th>
              {locations.map((loc) => (
                <th
                  key={loc}
                  className="border border-black bg-gray-100 px-2 py-1 whitespace-nowrap text-center"
                >
                  {loc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((name) => (
              <tr key={name}>
                <td className="border border-black px-2 py-1 font-semibold bg-white sticky left-0 bg-opacity-90 backdrop-blur z-10">
                  {name}
                </td>
                {locations.map((loc) => (
                  <td
                    key={loc}
                    className={`border border-black px-2 py-1 text-center cursor-pointer transition-all duration-200 ${
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