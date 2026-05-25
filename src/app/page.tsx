"use client";

import {
  Mic,
  MicOff,
  Send,
  Sun,
  Moon,
  User,
  Bot,
  Lightbulb,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import useHome from "./useHome";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Example prompts that users can click on
const EXAMPLE_PROMPTS = [
  { text: "Tell me a joke", icon: "😂" },
  { text: "What's the 200 + 320?", icon: "➗" },
  { text: "Write a short poem", icon: "📝" },
  { text: "Give me a fun fact", icon: "🧠" },
];

export default function Home() {
  const {
    isListening,
    input,
    messages,
    isLoading,
    handleSubmit,
    handleKeyDown,
    toggleListening,
    messagesEndRef,
    handleExamplePromptClick,
    handleInputChange,
    isDarkMode,
    handleDownloadChat,
  } = useHome();

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="p-6 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SpeechiFy
            </h1>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownloadChat}
                      disabled={messages.length === 0}
                      className="rounded-full h-10 w-10 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download chat history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        document.documentElement.classList.toggle("dark")
                      }
                      className="rounded-full h-10 w-10 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer"
                    >
                      {isDarkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ScrollArea className="h-[500px] mb-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/30 shadow-inner">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 dark:text-slate-400">
                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800/70 flex items-center justify-center">
                      <Bot className="h-8 w-8 text-blue-500 dark:text-blue-400/70" />
                    </div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-400">
                      Start a conversation
                    </p>
                    <p className="text-sm mt-2">
                      Select a suggestion below or type your own message
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXAMPLE_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleExamplePromptClick(prompt.text)}
                        className="p-4 text-left rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/70 transition-colors group flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{prompt.icon}</span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {prompt.text}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700/50">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <p className="text-sm text-slate-700 dark:text-slate-400">
                      You can also use the microphone button to speak your
                      message
                    </p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-9 w-9 rounded-full ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-900/10"
                        : "bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-md shadow-emerald-900/10"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>

                  <div
                    className={`relative px-4 py-3 rounded-2xl max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-white dark:bg-slate-800 shadow-md shadow-slate-200/50 dark:shadow-slate-900/10 text-slate-800 dark:text-slate-200"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-900/10"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span
                      className={`absolute top-[12px] ${
                        message.role === "assistant" ? "-left-1" : "-right-1"
                      } h-4 w-4 transform ${
                        message.role === "assistant"
                          ? "bg-white dark:bg-slate-800"
                          : "bg-cyan-600"
                      } rotate-45`}
                    ></span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message or click the mic to speak..."
                  className="pr-12 py-6 bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  disabled={isLoading}
                />

                <Button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md disabled:opacity-50"
                  title="Send message"
                  disabled={isLoading || !input.trim()}
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className={`h-11 w-11 rounded-full shadow-md ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600 border-red-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      title={isListening ? "Stop listening" : "Start listening"}
                    >
                      {isListening ? (
                        <MicOff className="h-5 w-5 text-white" />
                      ) : (
                        <Mic className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      )}

                      {isListening && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full">
                          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping"></span>
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isListening ? "Stop" : "Start"} voice input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isLoading && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8">
                <div className="flex space-x-2 items-center px-4 py-1 rounded-full bg-white/90 dark:bg-slate-800/80 text-sm text-slate-600 dark:text-slate-300 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                    <div
                      className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span>AI thinking</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
