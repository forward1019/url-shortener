import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editSlugSchema } from "@/lib/schemas/shortenUrlschema";
import { Button } from "@/components/ui/button"

interface EditLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (slug: string) => Promise<void> | void;
  defaultValue?: string;
}

export default function EditLinkModal ({ open, onOpenChange, onConfirm, defaultValue}: EditLinkModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(editSlugSchema),
        defaultValues: { shortSlug: defaultValue || "" },
    });

    useEffect(() => {
        reset({ shortSlug: defaultValue || "" });
    }, [defaultValue, reset]);

    const onSubmit = async (data: { shortSlug: string }) => {
        await onConfirm(data.shortSlug);
    };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
      className="z-[9999] rounded-xl shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Short Slug</DialogTitle>
          <DialogDescription>Enter the new short slug for your link.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("shortSlug")}
            className="w-full border rounded px-3 py-2 my-4"
            autoFocus
            placeholder="Enter short slug"
          />
          {errors.shortSlug && (
            <div className="text-red-500 text-sm mb-2">{errors.shortSlug.message}</div>
          )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
