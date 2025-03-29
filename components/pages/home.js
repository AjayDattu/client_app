import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/public/Logistics-rafiki.svg";
import worker from "@/public/Accountant-pana.svg";
import cash from "@/public/Banknote-rafiki.svg";
import paper from "@/public/Research paper-amico.svg";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-[100vh] bg-gray-100">
      {/* Top Banner */}
      <div className="w-full h-[25rem] relative flex items-center justify-center">
        <Image src={logo} alt="Background" fill className="object-cover" />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 gap-3 p-4 w-full max-w-md">
        {/* Large Left Item (Spans 2 Rows) */}
        <Link href="/statement" className="row-span-2">
          <Card className="flex flex-col items-left justify-center p-4 shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="flex flex-col items-left gap-3">
              <p className="text-[1.3rem] font-semibold text-left text-black">
                Daily Statements
              </p>
              <p className="text-xs text-left text-gray-700">
                Track and manage daily financial records efficiently.
              </p>
              <Image
                src={paper}
                alt="Feature 1"
                width={160}
                height={160}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </Link>

        {/* Small Top Right */}
        <Link href="/workers">
          <Card className="flex flex-col items-left shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="flex flex-col items-left">
              <p className="text-[1.3rem] font-medium text-left text-black">
                Workers
              </p>
              <p className="text-xs text-left text-gray-700 w-full mt-2">
                Monitor employee details and performance.
              </p>
              <Image
                src={worker}
                alt="Feature 2"
                width={100}
                height={100}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </Link>

        {/* Small Bottom Right */}
        <Link href="/wages">
          <Card className="flex flex-col items-left shadow-lg bg-white/10 border border-purple-300/50 rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="flex flex-col items-left">
              <p className="text-[1.3rem] font-medium text-left text-black">
                Wages
              </p>
              <p className="text-xs text-left text-gray-700 w-full mt-2">
                Manage and track wages of your employees.
              </p>
              <Image
                src={cash}
                alt="Feature 3"
                width={100}
                height={100}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
