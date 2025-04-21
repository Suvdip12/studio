
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-semibold">Gemini Chat Spark</h1>
      </header>
      <ChatInterface />
    </div>
  );
}

