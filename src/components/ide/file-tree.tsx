"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File as FileIcon,
  FilePlus,
  FolderClosed,
  FolderOpen,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/lib/store";
import type { ProjectFile } from "@/lib/types";

type Node =
  | { kind: "file"; name: string; path: string; lang?: string }
  | { kind: "dir"; name: string; path: string; children: Node[] };

function buildTree(files: ProjectFile[]): Node {
  const root: Node = { kind: "dir", name: "/", path: "", children: [] };
  for (const f of files) {
    const parts = f.path.split("/").filter(Boolean);
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const isLast = i === parts.length - 1;
      const name = parts[i];
      const path = parts.slice(0, i + 1).join("/");
      if (isLast) {
        (cur as { children: Node[] }).children.push({
          kind: "file",
          name,
          path,
          lang: f.language,
        });
      } else {
        let next = (cur as { children: Node[] }).children.find(
          (n) => n.kind === "dir" && n.name === name
        ) as Node | undefined;
        if (!next) {
          next = { kind: "dir", name, path, children: [] };
          (cur as { children: Node[] }).children.push(next);
        }
        cur = next;
      }
    }
  }
  // sort: dirs first, then files, alpha
  const sort = (n: Node) => {
    if (n.kind === "dir") {
      n.children.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      n.children.forEach(sort);
    }
  };
  sort(root);
  return root;
}

export function FileTree() {
  const files = useIDEStore((s) => s.files);
  const activePath = useIDEStore((s) => s.activePath);
  const openFile = useIDEStore((s) => s.openFile);
  const deleteFile = useIDEStore((s) => s.deleteFile);
  const addFile = useIDEStore((s) => s.addFile);

  const tree = buildTree(files);

  function onAdd() {
    const name = window.prompt("New file path (e.g. src/components/Card.tsx)")?.trim();
    if (!name) return;
    if (files.some((f) => f.path === name)) {
      toast.error("That file already exists.");
      return;
    }
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const lang =
      ext === "ts" || ext === "tsx"
        ? "typescript"
        : ext === "js" || ext === "jsx"
        ? "javascript"
        : ext === "css"
        ? "css"
        : ext === "html" || ext === "htm"
        ? "html"
        : ext === "json"
        ? "json"
        : "plaintext";
    addFile({ path: name, content: "", language: lang });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border text-xs uppercase tracking-wider text-fg-subtle">
        <span>Explorer</span>
        <button
          onClick={onAdd}
          className="rounded p-1 hover:bg-bg-soft text-fg-muted hover:text-fg"
          aria-label="New file"
          title="New file"
        >
          <FilePlus size={13} />
        </button>
      </div>
      <ul className="flex-1 overflow-auto scroll-thin py-1.5">
        {tree.kind === "dir" &&
          tree.children.map((c) => (
            <NodeRow
              key={c.path}
              node={c}
              depth={0}
              activePath={activePath}
              onOpen={openFile}
              onDelete={(p) => {
                if (window.confirm(`Delete ${p}?`)) deleteFile(p);
              }}
            />
          ))}
      </ul>
    </div>
  );
}

function NodeRow({
  node,
  depth,
  activePath,
  onOpen,
  onDelete,
}: {
  node: Node;
  depth: number;
  activePath: string | null;
  onOpen: (p: string) => void;
  onDelete: (p: string) => void;
}) {
  const [open, setOpen] = useState(true);
  if (node.kind === "dir") {
    return (
      <li>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-1.5 px-2 py-1 text-sm text-fg-muted hover:bg-bg-soft hover:text-fg"
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {open ? <FolderOpen size={13} /> : <FolderClosed size={13} />}
          <span className="truncate">{node.name}</span>
        </button>
        {open && (
          <ul>
            {node.children.map((c) => (
              <NodeRow
                key={c.path}
                node={c}
                depth={depth + 1}
                activePath={activePath}
                onOpen={onOpen}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
  const active = activePath === node.path;
  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1.5 px-2 py-1 text-sm cursor-pointer",
          active
            ? "bg-bg-elev text-fg"
            : "text-fg-muted hover:bg-bg-soft hover:text-fg"
        )}
        style={{ paddingLeft: 8 + depth * 12 + 14 }}
        onClick={() => onOpen(node.path)}
      >
        <FileIcon size={12} className="shrink-0" />
        <span className="truncate flex-1">{node.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.path);
          }}
          className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-fg-muted hover:bg-bg-soft hover:text-red-400"
          aria-label="Delete file"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </li>
  );
}
