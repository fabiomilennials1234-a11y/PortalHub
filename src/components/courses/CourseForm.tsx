"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCourse, updateCourse } from "@/actions/courses"
import { slugify } from "@/lib/utils"
import { Save, Loader2 } from "lucide-react"
import type { CourseWithAuthor } from "@/types/domain"

interface CourseFormProps {
  orgId: string
  orgSlug: string
  course?: CourseWithAuthor
}

export function CourseForm({ orgId, orgSlug, course }: CourseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(course?.title ?? "")
  const [slug, setSlug] = useState(course?.slug ?? "")
  const [description, setDescription] = useState(course?.description ?? "")
  const [autoSlug, setAutoSlug] = useState(!course)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (autoSlug) setSlug(slugify(e.target.value))
  }

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData()
      if (course) {
        formData.set("course_id", course.id)
        formData.set("title", title)
        formData.set("slug", slug)
        formData.set("description", description)
        const result = await updateCourse(formData)
        if (result.data) router.push(`/${orgSlug}/courses/${slug}`)
      } else {
        formData.set("org_id", orgId)
        formData.set("title", title)
        formData.set("slug", slug)
        formData.set("description", description)
        const result = await createCourse(formData)
        if (result.data) router.push(`/${orgSlug}/courses/${result.data.slug}`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="course-title">Título</Label>
        <Input
          id="course-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Nome do curso..."
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course-slug">Slug (URL)</Label>
        <Input
          id="course-slug"
          value={slug}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSlug(e.target.value)
            setAutoSlug(false)
          }}
          placeholder="url-do-curso"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course-description">Descrição</Label>
        <Textarea
          id="course-description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="Descreva o curso..."
          rows={4}
        />
      </div>
      <Button onClick={handleSubmit} disabled={isPending || !title.trim()}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        {course ? "Salvar alterações" : "Criar curso"}
      </Button>
    </div>
  )
}
