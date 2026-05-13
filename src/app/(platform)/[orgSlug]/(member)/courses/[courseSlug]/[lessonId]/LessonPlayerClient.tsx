"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LessonContent } from "@/components/courses/LessonContent"
import { LessonNotes } from "@/components/courses/LessonNotes"
import { VideoEmbed } from "@/components/courses/VideoEmbed"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { CourseSidebar } from "@/components/courses/CourseSidebar"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { useEnrollment } from "@/hooks/useEnrollment"
import { useAuth } from "@/hooks/useAuth"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  Loader2,
  ArrowLeft,
  File,
  Link as LinkIcon,
  Download,
} from "lucide-react"
import type {
  CourseWithAuthor,
  LessonFull,
  ModuleWithLessons,
  ModuleWithProgress,
  LessonSummary,
  LessonWithProgress,
} from "@/types/domain"

interface LessonPlayerClientProps {
  course: CourseWithAuthor
  lesson: LessonFull
  modules: ModuleWithLessons[]
  orgSlug: string
  lessonId: string
  prevLessonId: string | null
  nextLessonId: string | null
}

export function LessonPlayerClient({
  course,
  lesson,
  modules,
  orgSlug,
  lessonId,
  prevLessonId,
  nextLessonId,
}: LessonPlayerClientProps) {
  const {
    completedIds,
    progressPercent,
    markComplete,
    markIncomplete,
    isMarking,
  } = useLessonProgress(course.id)
  const { isEnrolled } = useEnrollment(course.id)
  const { data: auth } = useAuth()
  const userId = auth?.user?.id ?? null

  const isCompleted = completedIds.has(lessonId)
  const basePath = `/${orgSlug}/courses/${course.slug}`

  // Locate module + position for breadcrumb (M? · L?)
  let moduleIndex = 0
  let lessonIndex = 0
  modules.forEach((mod, mi) => {
    const li = mod.lessons.findIndex((l) => l.id === lessonId)
    if (li >= 0) {
      moduleIndex = mi + 1
      lessonIndex = li + 1
    }
  })

  const modulesWithProgress: ModuleWithProgress[] = modules.map((mod) => {
    const lessonsWithProgress: LessonWithProgress[] = (
      mod.lessons as LessonSummary[]
    ).map((l) => ({
      ...l,
      completed: completedIds.has(l.id),
    }))
    return {
      ...mod,
      lessons: lessonsWithProgress,
      completed_count: lessonsWithProgress.filter((l) => l.completed).length,
      total_count: lessonsWithProgress.length,
    }
  })

  const isPreviewWithoutEnrollment = !isEnrolled && lesson.is_free_preview

  // Decide if main media is a video (we render VideoEmbed directly)
  // or other content type (delegated to LessonContent inside the "Sobre" tab).
  const isVideo =
    (lesson.content_type === "video" || lesson.content_type === "embed") &&
    !!lesson.video_url

  // Reusable trigger className per design spec
  const triggerCn =
    "relative rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-2 text-[13px] font-medium text-ink-mid data-active:border-ink data-active:bg-transparent data-active:text-foreground data-active:shadow-none after:hidden hover:text-foreground"

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] -m-6">
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl space-y-6 p-8">
          {/* Breadcrumb back */}
          <Link
            href={basePath}
            className="wf-mono inline-flex items-center gap-1.5 transition-colors hover:!text-foreground"
          >
            <ArrowLeft className="size-3" />
            VOLTAR AO CURSO
          </Link>

          {isPreviewWithoutEnrollment && (
            <div className="wf-box bg-gold-bg px-4 py-3">
              <span className="text-[13px] leading-[1.55] text-gold-dk">
                Você está vendo uma aula gratuita. Inscreva-se no curso para
                acessar todas as aulas e marcar progresso.
              </span>
            </div>
          )}

          {/* Lesson header */}
          <div className="space-y-2">
            <span className="wf-mono">
              MÓDULO {moduleIndex} · LIÇÃO {lessonIndex}
            </span>
            <h1 className="wf-hand text-[34px]">{lesson.title}</h1>
          </div>

          {/* Media */}
          {isVideo ? (
            <VideoEmbed url={lesson.video_url!} title={lesson.title} />
          ) : (
            <LessonContent lesson={lesson} />
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
            <div className="flex items-center gap-2">
              {prevLessonId ? (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`${basePath}/${prevLessonId}`} />}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
              )}
              {nextLessonId && (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`${basePath}/${nextLessonId}`} />}
                >
                  Próxima
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>

            {isEnrolled && (
              <div className="flex items-center gap-3">
                <Button
                  variant={isCompleted ? "secondary" : "default"}
                  size="sm"
                  disabled={isMarking}
                  onClick={() =>
                    isCompleted
                      ? markIncomplete(lessonId)
                      : markComplete(lessonId)
                  }
                >
                  {isMarking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isCompleted ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <Circle className="size-4" />
                  )}
                  {isCompleted
                    ? "Concluída"
                    : "Marcar como concluída · +12 créditos"}
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sobre" className="pt-2">
            <TabsList
              variant="line"
              className="h-auto w-full justify-start gap-0 rounded-none border-b border-line bg-transparent p-0"
            >
              <TabsTrigger value="sobre" className={triggerCn}>
                Sobre
              </TabsTrigger>
              <TabsTrigger value="notas" className={triggerCn}>
                Notas
              </TabsTrigger>
              <TabsTrigger value="recursos" className={triggerCn}>
                Recursos
              </TabsTrigger>
              <TabsTrigger value="discussao" className={triggerCn}>
                Discussão
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="pt-5">
              {lesson.description ? (
                <p className="max-w-2xl text-[14.5px] leading-[1.65] text-ink-soft">
                  {lesson.description}
                </p>
              ) : null}
              {lesson.content_type === "text" && lesson.text_content ? (
                <div className="wf-box mt-4 bg-paper p-6">
                  <RichTextRenderer content={lesson.text_content} />
                </div>
              ) : null}
              {!lesson.description &&
              !(lesson.content_type === "text" && lesson.text_content) ? (
                <p className="font-serif text-[14.5px] italic leading-[1.65] text-ink-low">
                  Sem descrição para esta lição.
                </p>
              ) : null}
            </TabsContent>

            <TabsContent value="notas" className="pt-5">
              {userId ? (
                <LessonNotes lessonId={lesson.id} userId={userId} />
              ) : (
                <div className="wf-box flex flex-col items-start gap-3 bg-paper p-6">
                  <p className="font-serif text-[14.5px] italic leading-[1.65] text-ink-low">
                    Faça login para criar anotações nesta lição.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recursos" className="pt-5">
              <div className="flex flex-col gap-2">
                {[
                  { icon: File, label: "PDF: Resumo da lição", meta: "PDF" },
                  { icon: Download, label: "Slides", meta: "DOWNLOAD" },
                  { icon: LinkIcon, label: "Link externo", meta: "LINK" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="wf-box flex items-center gap-3 bg-paper px-4 py-3"
                  >
                    <r.icon className="size-4 text-ink-mid" />
                    <span className="text-[13.5px] text-foreground">
                      {r.label}
                    </span>
                    <div className="flex-1" />
                    <span className="wf-mono !text-ink-low">{r.meta}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discussao" className="pt-5">
              <div className="wf-box bg-paper p-6">
                <p className="font-serif text-[14.5px] italic leading-[1.65] text-ink-low">
                  Em breve · discussões por lição.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar — hidden on mobile */}
      <div className="hidden w-80 shrink-0 lg:block xl:w-96">
        <CourseSidebar
          course={course}
          modules={modulesWithProgress}
          currentLessonId={lessonId}
          orgSlug={orgSlug}
          progressPercent={progressPercent}
        />
      </div>
    </div>
  )
}
