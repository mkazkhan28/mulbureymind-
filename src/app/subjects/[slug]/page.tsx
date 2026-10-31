"use client";

import React from "react";
import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { BDS_SUBJECTS } from "@/lib/bds-content";
import { getSubjectStructure } from "@/lib/subject-structure";
import SubjectOverview from "@/components/SubjectOverview";
import { EmptyState } from "@/components/ui";

/** One layout for every subject (chapters, direct resource links, study materials). */
export default function SubjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const subject = BDS_SUBJECTS.find((s) => s.slug === slug);

  if (!subject) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState icon={BookOpen} title="Subject not found" text="We couldn't find that subject. Pick one from your subject list." href="/subjects" action="Back to My Subjects" />
      </div>
    );
  }

  return <SubjectOverview subject={subject} structure={getSubjectStructure(subject.slug)} />;
}
