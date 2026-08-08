// Ratified Plan: CISEM-IP-20260808-SALES-AGENT
// Architectural Reasoning: Client side conversational widget with live mutation status badges, utilizing pure inline icons for zero-dependency builds.
// Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Enforcement)

'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolLogs?: string[]
}

export function AgentChatWidget({ tenantId = 'cisem-local' }: { tenantId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'שלום! אני הארכיטקט הדיגיטלי שלך. כיצד אוכל לעזור לך לתכנן ולהתאים את פלטפורמת ה-SaaS שלך היום?',
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("[AgentChatWidget] Mounted");
    return () => console.log("[AgentChatWidget] Unmounted");
  }, []);

  useEffect(() => {
    console.log("[AgentChatWidget] isOpen changed:", isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (res.ok && data.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.content,
            toolLogs: data.toolLogs,
          },
        ])
      } else {
        throw new Error(data.error || 'Failed to fetch response')
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: 'מצטער, נתקלתי בבעיית חיבור. אנא נסה שנית.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans" dir="rtl">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all transform hover:scale-105"
        >
          <span className="text-lg">🤖</span>
          <span className="text-xs font-bold tracking-wider">שוחח עם סוכן מכירות AI</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="text-right">
                <h3 className="font-bold text-xs text-slate-100">סוכן מכירות ואפיון מותג</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  אינטגרציית Twenty CRM פעילה
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 text-sm">
                    🤖
                  </div>
                )}
                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`p-3 rounded-xl leading-relaxed text-right ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Tool Execution Badge (e.g. Syncing to Twenty CRM) */}
                  {msg.toolLogs && msg.toolLogs.length > 0 && (
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg">
                      <span>✔️</span>
                      <span>פרטי הליד נשמרו וסונכרנו אוטומטית ל-Twenty CRM</span>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 text-sm">
                    👤
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 text-slate-400 text-xs items-center justify-start">
                <span className="animate-spin text-blue-400 text-sm">✨</span>
                <span>סוכן AI מנתח נתונים ומעדכן CRM...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-800/50 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="שאל שאלה או שתף פרטי פרויקט..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 placeholder-slate-500 text-right"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all"
            >
              <span>➡️</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
