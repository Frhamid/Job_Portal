import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addNewCompany } from "@/API/apicompanies";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file?.[0] &&
        ["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(
          file[0].type
        ),
      { message: "Only PNG, JPEG,WEBP or SVG images are allowed" }
    )
    .refine((file) => file?.[0]?.size <= 2 * 1024 * 1024, {
      message: "File must be smaller than 2MB",
    }),
});

export default function AddCompaniesDrawer({ fetchCompanies }) {
  const {
    fn: fnAddNewCompany,
    error: errorAddNewCompany,
    data: dataNewCompany,
    loading: loadingAddNewCompany,
  } = useFetch(addNewCompany);

  useEffect(() => {
    if (dataNewCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddNewCompany]);
  const onsubmit = (data) => {
    fnAddNewCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Company Name" {...register("name")} />
          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />
          <Button
            type="button"
            onClick={handleSubmit(onsubmit)}
            variant="destructive"
            className="w-40 cursor-pointer"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorAddNewCompany && (
          <p className="text-red-500">{errorAddNewCompany}</p>
        )}
        {loadingAddNewCompany && (
          <BarLoader className="mb-4" width={"100%"} color="red" />
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="secondary"
              type="button"
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
