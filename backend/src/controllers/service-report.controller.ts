    import { Request, Response } from "express";
    import { v4 as uuidv4 } from "uuid";
    import { supabase } from "../utils/supabase.js";

    export const createServiceReport = async (req: Request, res: Response) => {
    try {
        const { job_id, issue_description, fix_applied, additional_notes } =
        req.body;

        const files = req.files as Express.Multer.File[];

        const uploadedPhotoUrls: string[] = [];

        // 1️⃣ Upload images to Supabase Storage
        if (files && files.length > 0) {
        for (const file of files) {
            const fileName = `job-${job_id}/${uuidv4()}-${file.originalname}`;

            const { error } = await supabase.storage
            .from("job-photos")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

            if (error) throw error;

            // get public url
            const { data } = supabase.storage
            .from("job-photos")
            .getPublicUrl(fileName);

            uploadedPhotoUrls.push(data.publicUrl);
        }
        }

        // 2️⃣ Save report in DB
        const { data: report, error: dbError } = await supabase
        .from("service_reports")
        .insert([
            {
            job_id,
            issue_description,
            fix_applied,
            additional_notes,
            photos: uploadedPhotoUrls,
            status: "submitted",
            },
        ])
        .select()
        .single();

        if (dbError) throw dbError;

        return res.status(201).json({
        success: true,
        message: "Service report submitted successfully",
        report,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
    };
