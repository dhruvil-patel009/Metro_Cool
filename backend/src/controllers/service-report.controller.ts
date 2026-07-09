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
            // Sanitize filename: remove non-ASCII chars, replace spaces
            const sanitizedName = file.originalname
              .replace(/[^\x20-\x7E]/g, "")  // remove non-printable/non-ASCII
              .replace(/\s+/g, "_")            // replace spaces with underscore
              .replace(/[^a-zA-Z0-9_.\-]/g, "") // keep only safe chars
              || "photo.jpg"

            const fileName = `job-${job_id}/${uuidv4()}-${sanitizedName}`;

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

    /* ── GET ALL SERVICE REPORTS (Admin) ── */
    export const getAllServiceReports = async (req: Request, res: Response) => {
      try {
        const { data: reports, error } = await supabase
          .from("service_reports")
          .select(`
            *,
            bookings:job_id (
              id,
              booking_date,
              job_status,
              user:user_id ( full_name, phone, email ),
              technician:technician_id ( full_name, phone, email )
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return res.json({ success: true, reports: reports || [] });
      } catch (err: any) {
        console.error("Get All Service Reports Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    };

    /* ── GET SERVICE REPORTS BY TECHNICIAN (Technician's own) ── */
    export const getMyServiceReports = async (req: Request, res: Response) => {
      try {
        const technicianId = req.user.id;

        // First get all bookings for this technician
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("id")
          .eq("technician_id", technicianId);

        if (bookingsError) throw bookingsError;

        const jobIds = (bookings || []).map((b: any) => b.id);

        if (jobIds.length === 0) {
          return res.json({ success: true, reports: [] });
        }

        // Get reports for these bookings
        const { data: reports, error } = await supabase
          .from("service_reports")
          .select(`
            *,
            bookings:job_id (
              id,
              booking_date,
              job_status,
              user:user_id ( full_name, phone, email ),
              technician:technician_id ( full_name, phone, email )
            )
          `)
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return res.json({ success: true, reports: reports || [] });
      } catch (err: any) {
        console.error("Get My Service Reports Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    };

    /* ── GET SINGLE SERVICE REPORT BY ID ── */
    export const getServiceReportById = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const { data: report, error } = await supabase
          .from("service_reports")
          .select(`
            *,
            bookings:job_id (
              id,
              booking_date,
              job_status,
              issues,
              instructions,
              address,
              user:user_id ( full_name, phone, email ),
              technician:technician_id ( full_name, phone, email )
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;

        return res.json({ success: true, report });
      } catch (err: any) {
        console.error("Get Service Report By ID Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    };

    /* ── GET SERVICE REPORT BY JOB ID ── */
    export const getServiceReportByJobId = async (req: Request, res: Response) => {
      try {
        const { jobId } = req.params;

        const { data: report, error } = await supabase
          .from("service_reports")
          .select(`
            *,
            bookings:job_id (
              id,
              booking_date,
              job_status,
              issues,
              instructions,
              address,
              user:user_id ( full_name, phone, email ),
              technician:technician_id ( full_name, phone, email )
            )
          `)
          .eq("job_id", jobId)
          .single();

        if (error) throw error;

        return res.json({ success: true, report });
      } catch (err: any) {
        console.error("Get Service Report By Job ID Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    };
