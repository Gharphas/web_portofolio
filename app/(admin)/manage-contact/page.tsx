"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { contactMessagesData } from "@/lib/mock-data";
import { Mail, Star, Trash2, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
}

export default function ManageContactPage() {
  const [messages, setMessages] = useState<MessageItem[]>(contactMessagesData);

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const deleteMessage = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          PESAN & KONTAK
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Lihat dan tanggapi pesan masuk dari formulir kontak portofolio Anda.
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <GlassCard
            key={msg.id}
            className={`p-6 border-border/45 hover:border-primary/25 transition-all duration-300 ${
              !msg.isRead ? "glow-crimson-sm border-primary/30" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="space-y-3 flex-grow">
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-heading text-sm font-bold text-foreground">
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({msg.email})
                  </span>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                    {!msg.isRead && (
                      <span className="text-[8px] font-heading font-extrabold text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(msg.createdAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Subject & content message */}
                <div className="space-y-1">
                  <h4 className="text-xs font-heading font-semibold text-primary uppercase">
                    SUbjek: {msg.subject}
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed whitespace-pre-wrap bg-secondary/10 p-4 rounded-xl border border-border/10">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Action operations */}
              <div className="flex items-center md:flex-col gap-2 self-end md:self-start w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-border/10">
                <button
                  onClick={() => toggleStar(msg.id)}
                  className={`p-2 rounded-lg border cursor-pointer ${
                    msg.isStarred
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                      : "border-border hover:border-amber-500/40 text-muted-foreground hover:text-amber-500"
                  }`}
                  aria-label="Star message"
                >
                  <Star className={`h-4 w-4 ${msg.isStarred ? "fill-amber-500" : ""}`} />
                </button>

                {!msg.isRead && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer select-none transition-colors"
                    title="Tandai Sudah Dibaca"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="p-2 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white cursor-pointer select-none transition-colors"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20">
            <Mail className="h-10 w-10 text-muted-foreground/35 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-sans">
              Tidak ada pesan masuk saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
