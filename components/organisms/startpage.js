import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AIUIComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      {/* Header with Sign In/Sign Up Buttons */}
      <header className="w-full flex justify-between items-center p-4 max-w-4xl">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <div className="flex gap-4">
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="border-white text-white">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-blue-500 hover:bg-blue-600">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <p className="text-sm">Welcome back!</p>
          </SignedIn>
        </div>
      </header>
      <div
        className="w-full max-w-3xl mt-8 shadow-lg rounded-xl overflow-hidden"
      >
        <iframe
          className="w-full h-[350px] sm:h-[450px] rounded-xl"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="AI Introduction Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
