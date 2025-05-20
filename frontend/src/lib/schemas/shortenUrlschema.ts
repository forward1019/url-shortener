import * as yup from "yup";

export const shortenUrlSchema = yup.object({
    originalUrl:
    yup.string()
    .trim()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .required("Please enter a URL"),

    shortSlug: yup
    .string()
    .trim()
    .notRequired()
    .nullable()
    .test(
        "slug-format",
        "Slug must be 4-15 characters, only lowercase letters, numbers, -",
        (value) => {
        if (!value) return true;
        return /^[a-z0-9-]{4,15}$/.test(value);
        })

});


export const editSlugSchema = yup.object({
  shortSlug: yup
    .string()
    .trim()
    .required("Slug is required")
    .test(
      "slug-format",
      "Slug must be 4-15 characters, only lowercase letters, numbers, -",
      (value) => !!value && /^[a-z0-9-]{4,15}$/.test(value)
    ),
});
