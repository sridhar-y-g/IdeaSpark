import { MainLayout } from "@/components/layout/MainLayout";
import { IdeaForm } from "@/components/ideas/IdeaForm";

export default function SubmitIdeaPage() {
  return (
    <MainLayout>
      <div className="py-8">
        <IdeaForm />
      </div>
    </MainLayout>
  );
}
