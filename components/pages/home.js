import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/public/Logistics-rafiki.svg";
import worker from "@/public/Accountant-pana.svg";
import cash from "@/public/Banknote-rafiki.svg";
import paper from "@/public/Research paper-amico.svg";
import expenses from "@/public/Data report-amico.svg";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* Top Banner - Kept as requested */}
      <div className="w-full h-[20rem] relative flex items-center justify-center">
        <Image src={logo} alt="Background" fill className="object-cover" />
      </div>

      {/* Bento Grid Layout - 2x2 for Mobile */}
      <div className="grid grid-cols-2 gap-4 p-4 w-full max-w-md">
        {/* Top Left */}
        <Link href="/statement">
          <Card className="flex flex-col items-center p-3 shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer h-64">
            <p className="text-[1.4rem] font-semibold text-center text-black">
              Statements
            </p>
            <p className="text-[0.9rem] text-center text-gray-700">
              Track daily financial records
            </p>
            <Image
              src={paper}
              alt="Statements"
              width={150}
              height={150}
              className="rounded-md mt-auto"
            />
          </Card>
        </Link>

        {/* Top Right */}
        <Link href="/workers">
          <Card className="flex flex-col items-center p-3 shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer h-64">
            <p className="text-[1.4rem] font-semibold text-center text-black">
              Workers
            </p>
            <p className="text-[0.9rem] text-center text-gray-700 ">
              Monitor employee details
            </p>
            <Image
              src={worker}
              alt="Workers"
              width={150}
              height={150}
              className="rounded-md mt-auto"
            />
          </Card>
        </Link>

        {/* Bottom Left */}
        <Link href="/wages">
          <Card className="flex flex-col items-center p-3 shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer h-64">
            <p className="text-[1.4rem] font-semibold text-center text-black">
              Wages
            </p>
            <p className="text-[0.9rem] text-center text-gray-700">
              Manage employee payments
            </p>
            <Image
              src={cash}
              alt="Wages"
              width={150}
              height={150}
              className="rounded-md mt-auto"
            />
          </Card>
        </Link>

        {/* Bottom Right */}
        <Link href="/whole-reports">
          <Card className="flex flex-col items-center p-3 shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer h-64">
            <p className="text-[1.2rem] font-semibold text-center text-black">
              Whole Data
            </p>
            <p className="text-[0.9rem] text-center text-gray-700">
              Track company Applications
            </p>
            <Image
              src={expenses}
              alt="Expenses"
              width={150}
              height={150}
              className="rounded-md mt-auto"
            />
          </Card>
        </Link>
      </div>
    </div>
  );
}