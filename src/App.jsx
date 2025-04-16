import React, { useEffect, useState } from "react";
import "./index.css";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";

const names = ["KWON", "加藤", "佐藤", "Tiago", "野久", "熊内", "筒井", "西川", "吉田"];
const locations = [
  "在室", "授業", "出張", "学内", "MTG", "IRES²", "NCR/VBL",
  "C2-602", "総研棟", "第5修研室", "第7修研室", "帰省", "帰宅"
];

export default function App() {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const stateRef = ref(database, "positions");
    onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelected(data);
      }
    });
  }, []);

  const handleClick = (name, location) => {
    const updated = {
      ...selected,
      [name]: location,
    };
    set(ref(database, "positions"), updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">📍 현재 위치 표시 테이블</h1>
      <div className="w-full overflow-x-auto">
        <table className="min-w-max table-auto border border-black shadow-xl">
          <thead>
            <tr>
              <th className="border border-black bg-gray-200 px-3 py-2 sticky left-0 bg-white z-10">
                이름
              </th>
              {locations.map((loc) => (
                <th
                  key={loc}
                  className="border border-black bg-gray-100 px-3 py-2 whitespace-nowrap text-sm text-center"
                >
                  {loc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((name) => (
              <tr key={name}>
                <td className="border border-black px-3 py-2 bg-white font-semibold sticky left-0 bg-opacity-90 backdrop-blur z-10">
                  {name}
                </td>
                {locations.map((loc) => (
                  <td
                    key={loc}
                    className={`border border-black px-3 py-2 text-center cursor-pointer transition-all duration-200 ${
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