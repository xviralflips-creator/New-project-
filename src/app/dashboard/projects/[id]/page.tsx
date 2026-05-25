"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/skeleton";
import { IDEShell } from "@/components/ide/ide-shell";
import { getProject } from "@/lib/firebase/projects";
import { useAuthStore, useIDEStore } from "@/lib/store";

export default function ProjectIDEPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setProject = useIDEStore((s) => s.setProject);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !params.id) return;
    let cancelled = false;
    (async () => {
      try {
        const project = await getProject(params.id);
        if (cancelled) return;
        if (!project) {
          toast.error("Project not found");
          router.replace("/dashboard/projects");
          return;
        }
        if (project.ownerId !== user.uid && !project.collaborators.includes(user.uid)) {
          toast.error("You don't have access to this project.");
          router.replace("/dashboard/projects");
          return;
        }
        setProject(project);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      // clear IDE state on unmount
      setProject(null);
    };
  }, [params.id, user, setProject, router]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-fg-muted">
        <div className="flex items-center gap-2 text-sm">
          <Spinner /> Loading project…
        </div>
      </div>
    );
  }

  return <IDEShell />;
}
