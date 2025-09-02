import {useMemo, useState} from "react";

const WEIGHTS = [2, 4, 8, 5, 10, 9, 7, 3, 6];

function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y: number, m: number){
  return [31, isLeapYear(y) ? 29: 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

function decodeDate(egn: string) {
  const yy = Number(egn.slice(0, 2));
  let mm = Number(egn.slice(2, 4));
  const dd = Number(egn.slice(4, 6));

  let base = 1900;

  if(mm >= 1 && mm <= 12) base = 1900;
  else if (mm >= 21 && mm <= 32) {base = 1800; mm -= 20; }
  else if (mm >= 41 && mm <= 52) { base = 2000; mm -= 40; }
  else return null;

  const year = base + yy;
  const month = mm;
  const dim = daysInMonth(year, month);

  if(month < 1 || month > 12 || dd < 1 || dd > dim) return null;
  return { year, month, day: dd} as const;
}

function calcCheckSum (egn9: string) {
  const sum = egn9.split("").reduce((acc, ch, i) => acc + Number(ch) * WEIGHTS[i], 0);
  const mod = sum % 11;
  return mod === 10 ? 0 : mod;
}

export type Validation = {
  isValid: boolean;
  issues: string[];
  sex?: 'male' | 'female';
  birthDate?: { year: number; month: number; day: number } | null;
};

function validateEGN(raw: string): Validation {
  const egn = (raw || "").trim();
  const out: Validation = { isValid: false, issues: [] };

  if(!/^\d{10}$/.test(egn)){
    out.issues.push("ЕГН трябва да съдържа точно 10 цифри.");
    return out;
  }

  const date= decodeDate(egn);
  if(!date) out.issues.push("Невалидна дата в ЕГН (ГГММДД).");

  const expected = calcCheckSum(egn.slice(0,9));
  const actual = Number(egn[9]);
  if(expected !== actual) out.issues.push(`Невалидна контролна цифра (очаквана ${expected}), получена ${actual}).`);

  const sexDigit = Number(egn[8]);
  const sex = sexDigit % 2 === 0 ? "male" : "female";

  out.isValid = out.issues.length === 0;
  out.sex = sex;
  out.birthDate = date || undefined;
  return out;
}

function pad2(n: number) { return n.toString().padStart(2, "0"); }

export default function App() {
  const [egn, setEgn] = useState("");
  const v = useMemo(() => validateEGN(egn), [egn]);

  return(
      <div className="min-h-screen w-full bg-slate-50 p-6">
        <div className="mx-auto max-w-2xl grid gap-6">
          <header>
            <h1 className="text-2xl font-bold">ЕГН асистент</h1>
            <p className="text-slate-600 text-sm mt-1">валидатор с React + TypeScript</p>
          </header>


          <div className="bg-white rounded-2xl shadow p-5">
            <label className="text-sm text-slate-600">Въведете ЕГН</label>
            <div className="flex gap-3 mt-2 items-center">
              <input
                value={egn}
                onChange={(e) => setEgn(e.target.value)}
                placeholder="напр. 7523169263"
                className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring"
                maxLength={10}
                inputMode="numeric"
              />
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${v.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {v.isValid ? "Валидно" : "Невалидно"}
              </span>
            </div>


            {/* Details */}
            <div className="mt-3 text-sm">
              {!v.isValid && v.issues.length > 0 && (
                <ul className="list-disc ml-5 space-y-1 text-red-700">
                  {v.issues.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              )}
              {v.isValid && (
                <div className="grid gap-1 text-slate-700">
                  <div><span className="font-medium">Пол:</span> {v.sex === "male" ? "Мъж" : "Жена"}</div>
                  {v.birthDate && (
                    <div>
                      <span className="font-medium">Дата на раждане:</span>{" "}
                      {`${pad2(v.birthDate.day)}.${pad2(v.birthDate.month)}.${v.birthDate.year}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


          <footer className="text-xs text-slate-500">
            <p>Демо за учебни цели. Не въвеждайте реални ЕГН.</p>
          </footer>
        </div>
      </div>
  );
}