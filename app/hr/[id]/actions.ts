"use server";

import { updateResumeStatus } from "@/lib/db/jobs";

export async function updateStatus(resumeId: number, status: "accepted" | "rejected"){
    await updateResumeStatus(resumeId, status);
}