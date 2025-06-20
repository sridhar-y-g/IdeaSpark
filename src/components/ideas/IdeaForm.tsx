
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "./TagInput";
import { IdeaCategory, type Idea } from "@/lib/types";
import type { User } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from 'react-dom';
import { submitIdeaAction, type SubmitIdeaState } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

const ideaFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100, "Title cannot exceed 100 characters."),
  description: z.string().min(20, "Description must be at least 20 characters long.").max(5000, "Description cannot exceed 5000 characters."),
  tags: z.array(z.string().min(1).max(30, "Tag cannot exceed 30 characters."))
    .min(1, "Please add at least one tag.")
    .max(10, "You can add a maximum of 10 tags."),
  category: z.nativeEnum(IdeaCategory, {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
});

type IdeaFormValues = z.infer<typeof ideaFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto text-lg py-3 px-8">
      {pending ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-5 w-5" />}
      Spark Idea!
    </Button>
  );
}

export function IdeaForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [descriptionForAISuggestions, setDescriptionForAISuggestions] = useState('');

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      category: undefined,
    },
  });
  
  const [formState, formAction] = useActionState<SubmitIdeaState, FormData>(submitIdeaAction, { success: false });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?message=Please log in to submit an idea.");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (formState.success && formState.submittedIdea) {
      toast({
        title: "Success!",
        description: formState.message || "Your idea has been submitted.",
      });

      // Save to localStorage
      try {
        const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
        let ideasFromStorage: Idea[] = [];
        if (storedIdeasRaw) {
          ideasFromStorage = JSON.parse(storedIdeasRaw);
        }
        const updatedIdeas = [formState.submittedIdea, ...ideasFromStorage];
        localStorage.setItem('ideaSparkIdeas', JSON.stringify(updatedIdeas));
      } catch (e) {
        console.error("Failed to save new idea to localStorage", e);
        toast({
          title: "Storage Error",
          description: "Could not save your idea locally. It might not appear in the feed immediately.",
          variant: "destructive",
        });
      }

      form.reset();
      router.push('/'); 
    } else if (!formState.success && formState.message) {
       const generalError = formState.errors?.general?.[0];
       toast({
        title: "Submission Failed",
        description: generalError || formState.message,
        variant: "destructive",
      });
    }
  }, [formState, toast, form, router]);


  if (authLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size={48} /></div>;
  }

  if (!user) {
    return <p>Please log in to submit an idea.</p>;
  }
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue('description', e.target.value, { shouldValidate: true });
    setDescriptionForAISuggestions(e.target.value);
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <Lightbulb className="mx-auto h-16 w-16 text-primary mb-4" />
        <CardTitle className="font-headline text-4xl">Share Your Brilliant Idea</CardTitle>
        <CardDescription>Fill out the details below and let the world see your vision.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="userName" value={user.name || "Anonymous"} />
            {user.avatarUrl && <input type="hidden" name="userAvatarUrl" value={user.avatarUrl} />}
            <input type="hidden" name="tags" value={form.watch('tags').join(',')} />


            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Idea Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI-Powered Recipe Generator" {...field} className="text-base py-2" />
                  </FormControl>
                  <FormDescription>
                    A catchy and descriptive title for your idea.
                  </FormDescription>
                  <FormMessage>{formState.errors?.title?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
                      className="min-h-[150px] text-base py-2"
                      {...field}
                      onChange={handleDescriptionChange} 
                      value={form.watch('description')} 
                    />
                  </FormControl>
                  <FormDescription>
                    Explain your idea thoroughly. The more details, the better! (Min. 20 characters)
                  </FormDescription>
                  <FormMessage>{formState.errors?.description?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Tags</FormLabel>
                  <FormControl>
                    <TagInput 
                      value={field.value} 
                      onChange={field.onChange}
                      descriptionForAISuggestions={descriptionForAISuggestions}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help others discover your idea (e.g., AI, Healthcare, App). Max 10 tags.
                  </FormDescription>
                  <FormMessage>{formState.errors?.tags?.[0] || (form.formState.errors.tags?.message)}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger className="text-base py-2 h-auto">
                        <SelectValue placeholder="Select a category for your idea" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IdeaCategory).map(cat => (
                        <SelectItem key={cat} value={cat} className="text-base py-2">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your idea.
                  </FormDescription>
                   <FormMessage>{formState.errors?.category?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            
            {formState.message && !formState.success && !formState.errors?.general && (
                 <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                    {formState.message}
                 </div>
            )}
            {formState.errors?.general && (
                 <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                    {formState.errors.general[0]}
                 </div>
            )}


            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
