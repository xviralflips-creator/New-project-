"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb } from "./client";
import type { Project, ProjectFile, ProjectVersion } from "../types";
import { uid } from "../utils";

function toMillis(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  return Date.now();
}

function projectFromDoc(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    ownerId: String(data.ownerId ?? ""),
    name: String(data.name ?? "Untitled"),
    description: String(data.description ?? ""),
    prompt: String(data.prompt ?? ""),
    framework: (data.framework as Project["framework"]) ?? "next",
    visibility: (data.visibility as Project["visibility"]) ?? "private",
    collaborators: (data.collaborators as string[]) ?? [],
    files: (data.files as ProjectFile[]) ?? [],
    thumbnail: data.thumbnail as string | undefined,
    tags: (data.tags as string[]) ?? [],
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    versionCount: Number(data.versionCount ?? 0),
    status: (data.status as Project["status"]) ?? "draft",
    deployUrl: data.deployUrl as string | undefined,
  };
}

export async function createProject(input: {
  ownerId: string;
  name: string;
  description?: string;
  prompt: string;
  framework?: Project["framework"];
  files?: ProjectFile[];
  tags?: string[];
}): Promise<Project> {
  const db = getDb();
  const ref = doc(collection(db, "projects"));
  const data = {
    ownerId: input.ownerId,
    name: input.name,
    description: input.description ?? "",
    prompt: input.prompt,
    framework: input.framework ?? "next",
    visibility: "private" as const,
    collaborators: [] as string[],
    files: input.files ?? [],
    tags: input.tags ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    versionCount: 0,
    status: "draft" as const,
  };
  await setDoc(ref, data);
  return projectFromDoc(ref.id, { ...data, createdAt: Date.now(), updatedAt: Date.now() });
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, "id" | "createdAt">>
) {
  const db = getDb();
  await updateDoc(doc(db, "projects", id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(getDb(), "projects", id));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(getDb(), "projects", id));
  if (!snap.exists()) return null;
  return projectFromDoc(snap.id, snap.data());
}

export function watchUserProjects(
  ownerId: string,
  cb: (p: Project[]) => void,
  max = 50
) {
  const q = query(
    collection(getDb(), "projects"),
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc"),
    limit(max)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => projectFromDoc(d.id, d.data())));
  });
}

export async function listUserProjects(ownerId: string, max = 50): Promise<Project[]> {
  const q = query(
    collection(getDb(), "projects"),
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => projectFromDoc(d.id, d.data()));
}

export async function saveProjectVersion(
  projectId: string,
  files: ProjectFile[],
  createdBy: string,
  prompt?: string,
  label?: string
): Promise<ProjectVersion> {
  const db = getDb();
  const versionsRef = collection(db, "projects", projectId, "versions");
  const ref = await addDoc(versionsRef, {
    label: label ?? `v-${new Date().toISOString().slice(0, 19)}`,
    files,
    createdBy,
    prompt: prompt ?? null,
    createdAt: serverTimestamp(),
  });
  // bump count
  const projRef = doc(db, "projects", projectId);
  const projSnap = await getDoc(projRef);
  const cur = (projSnap.data()?.versionCount as number) ?? 0;
  await updateDoc(projRef, {
    versionCount: cur + 1,
    updatedAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    projectId,
    label: label ?? `v-${new Date().toISOString().slice(0, 19)}`,
    files,
    createdAt: Date.now(),
    createdBy,
    prompt,
  };
}

export function newLocalProjectId() {
  return uid("proj");
}
