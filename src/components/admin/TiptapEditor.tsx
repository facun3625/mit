"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback } from "react";
import {
  Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
  Link2, ImageIcon, Play, List, ListOrdered,
  Heading2, Heading3, Undo, Redo, X, Upload, Loader2
} from "lucide-react";
import { useUpload } from "@/lib/useUpload";

function ToolbarButton({
  onClick, active, title, children,
}: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? "bg-mit-teal/20 text-mit-teal" : "text-white/40 hover:text-white/80 hover:bg-white/[0.08]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-white/[0.1] mx-0.5" />;
}

// ── Link dialog ───────────────────────────────────────────────────────────────

function LinkDialog({ onConfirm, onCancel, initial }: {
  onConfirm: (url: string) => void;
  onCancel: () => void;
  initial: string;
}) {
  const [url, setUrl] = useState(initial);
  return (
    <div className="absolute top-full left-0 mt-1 z-10 bg-[#1a1a24] border border-white/[0.12] rounded-xl p-4 shadow-xl w-80">
      <p className="text-xs text-white/40 font-light mb-2 tracking-wide">URL del enlace</p>
      <input
        autoFocus
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onConfirm(url); } if (e.key === "Escape") onCancel(); }}
        placeholder="https://..."
        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-mit-teal/50 mb-3"
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => onConfirm(url)} className="flex-1 bg-mit-teal hover:bg-mit-teal-dark text-white text-xs font-medium py-1.5 rounded-lg transition-colors">Aplicar</button>
        <button type="button" onClick={onCancel} className="flex-1 border border-white/[0.1] text-white/40 text-xs py-1.5 rounded-lg hover:text-white/70 transition-colors">Cancelar</button>
      </div>
    </div>
  );
}

// ── Image dialog (upload + URL) ───────────────────────────────────────────────

function ImageDialog({ onConfirm, onCancel }: {
  onConfirm: (url: string) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const { upload, uploading } = useUpload();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) onConfirm(result);
  }

  return (
    <div className="absolute top-full left-0 mt-1 z-10 bg-[#1a1a24] border border-white/[0.12] rounded-xl p-4 shadow-xl w-80">
      <p className="text-xs text-white/40 font-light mb-3 tracking-wide">Insertar imagen</p>

      {/* Upload */}
      <label className={`flex items-center justify-center gap-2 w-full border border-dashed border-white/[0.15] rounded-lg py-3 mb-3 cursor-pointer hover:border-mit-teal/50 hover:bg-white/[0.03] transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
        {uploading
          ? <><Loader2 size={13} strokeWidth={1.5} className="animate-spin text-mit-teal" /><span className="text-xs text-white/40">Subiendo...</span></>
          : <><Upload size={13} strokeWidth={1.5} className="text-white/30" /><span className="text-xs text-white/40">Subir desde mi equipo</span></>
        }
      </label>

      <p className="text-[10px] text-white/25 text-center mb-3">— o pegar URL —</p>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onConfirm(url); } if (e.key === "Escape") onCancel(); }}
        placeholder="https://..."
        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-mit-teal/50 mb-3"
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => url && onConfirm(url)} disabled={!url} className="flex-1 bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-30 text-white text-xs font-medium py-1.5 rounded-lg transition-colors">Insertar</button>
        <button type="button" onClick={onCancel} className="flex-1 border border-white/[0.1] text-white/40 text-xs py-1.5 rounded-lg hover:text-white/70 transition-colors">Cancelar</button>
      </div>
    </div>
  );
}

// ── YouTube dialog ────────────────────────────────────────────────────────────

function YoutubeDialog({ onConfirm, onCancel }: {
  onConfirm: (url: string) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  return (
    <div className="absolute top-full left-0 mt-1 z-10 bg-[#1a1a24] border border-white/[0.12] rounded-xl p-4 shadow-xl w-80">
      <p className="text-xs text-white/40 font-light mb-2 tracking-wide">URL de YouTube</p>
      <input
        autoFocus
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onConfirm(url); } if (e.key === "Escape") onCancel(); }}
        placeholder="https://youtube.com/watch?v=..."
        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-mit-teal/50 mb-3"
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => onConfirm(url)} className="flex-1 bg-mit-teal hover:bg-mit-teal-dark text-white text-xs font-medium py-1.5 rounded-lg transition-colors">Insertar</button>
        <button type="button" onClick={onCancel} className="flex-1 border border-white/[0.1] text-white/40 text-xs py-1.5 rounded-lg hover:text-white/70 transition-colors">Cancelar</button>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function TiptapEditor({
  initialContent = "",
  onChange,
}: {
  initialContent?: string;
  onChange?: (html: string) => void;
}) {
  const [dialog, setDialog] = useState<null | "link" | "image" | "youtube">(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-mit-teal underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full my-4" } }),
      Youtube.configure({ width: "100%", HTMLAttributes: { class: "rounded-lg my-4 w-full aspect-video" } }),
      Placeholder.configure({ placeholder: "Escribí el contenido de la novedad..." }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm prose-invert max-w-none min-h-[280px] px-5 py-4 focus:outline-none",
      },
    },
  });

  const setLink = useCallback((url: string) => {
    setDialog(null);
    if (!url || !editor) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback((url: string) => {
    setDialog(null);
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const insertYoutube = useCallback((url: string) => {
    setDialog(null);
    if (!url || !editor) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="bg-white/[0.04] border border-white/[0.1] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="relative flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer"><Undo size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer"><Redo size={14} strokeWidth={1.5} /></ToolbarButton>
        <Divider />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título 2"><Heading2 size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Título 3"><Heading3 size={14} strokeWidth={1.5} /></ToolbarButton>
        <Divider />

        {/* Format */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrita"><Bold size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Cursiva"><Italic size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Subrayado"><UnderlineIcon size={14} strokeWidth={1.5} /></ToolbarButton>
        <Divider />

        {/* Align */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Izquierda"><AlignLeft size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centro"><AlignCenter size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Derecha"><AlignRight size={14} strokeWidth={1.5} /></ToolbarButton>
        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista"><List size={14} strokeWidth={1.5} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada"><ListOrdered size={14} strokeWidth={1.5} /></ToolbarButton>
        <Divider />

        {/* Media */}
        <div className="relative">
          <ToolbarButton onClick={() => setDialog(dialog === "link" ? null : "link")} active={editor.isActive("link") || dialog === "link"} title="Enlace"><Link2 size={14} strokeWidth={1.5} /></ToolbarButton>
          {dialog === "link" && (
            <LinkDialog
              initial={editor.getAttributes("link").href ?? ""}
              onConfirm={setLink}
              onCancel={() => setDialog(null)}
            />
          )}
        </div>
        <div className="relative">
          <ToolbarButton onClick={() => setDialog(dialog === "image" ? null : "image")} title="Imagen"><ImageIcon size={14} strokeWidth={1.5} /></ToolbarButton>
          {dialog === "image" && <ImageDialog onConfirm={insertImage} onCancel={() => setDialog(null)} />}
        </div>
        <div className="relative">
          <ToolbarButton onClick={() => setDialog(dialog === "youtube" ? null : "youtube")} title="Video YouTube"><Play size={14} strokeWidth={1.5} /></ToolbarButton>
          {dialog === "youtube" && <YoutubeDialog onConfirm={insertYoutube} onCancel={() => setDialog(null)} />}
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
