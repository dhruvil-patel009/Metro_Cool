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

    /* ── Helper: enrich a report with booking + profile data ── */
    async function enrichReport(report: any) {
      if (!report || !report.job_id) return report;

      // Fetch booking
      const { data: booking } = await supabase
        .from("bookings")
        .select("id, booking_date, job_status, full_name, phone, user_id, technician_id, issues, instructions, address")
        .eq("id", report.job_id)
        .single();

      if (!booking) {
        return { ...report, bookings: null };
      }

      // Fetch technician profile
      let techName = "Technician";
      let techPhone = "";
      let techEmail = "";
      if (booking.technician_id) {
        const { data: tech } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone, email")
          .eq("id", booking.technician_id)
          .single();
        if (tech) {
          techName = `${tech.first_name || ""} ${tech.last_name || ""}`.trim() || "Technician";
          techPhone = tech.phone || "";
          techEmail = tech.email || "";
        }
      }

      // Fetch customer profile email
      let customerEmail = "";
      if (booking.user_id) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", booking.user_id)
          .single();
        customerEmail = userProfile?.email || "";
      }

      return {
        ...report,
        bookings: {
          id: booking.id,
          booking_date: booking.booking_date,
          job_status: booking.job_status,
          issues: booking.issues,
          instructions: booking.instructions,
          address: booking.address,
          user: {
            full_name: booking.full_name || "Customer",
            phone: booking.phone || "",
            email: customerEmail,
          },
          technician: {
            full_name: techName,
            phone: techPhone,
            email: techEmail,
          },
        },
      };
    }

    /* ── GET ALL SERVICE REPORTS (Admin) ── */
    export const getAllServiceReports = async (req: Request, res: Response) => {
      try {
        const { data: reports, error } = await supabase
          .from("service_reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Enrich each report with booking + profile data
        const enriched = await Promise.all(
          (reports || []).map((report) => enrichReport(report))
        );

        return res.json({ success: true, reports: enriched });
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
          .select("*")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Enrich each report
        const enriched = await Promise.all(
          (reports || []).map((report) => enrichReport(report))
        );

        return res.json({ success: true, reports: enriched });
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
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        const enriched = await enrichReport(report);

        return res.json({ success: true, report: enriched });
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
          .select("*")
          .eq("job_id", jobId)
          .single();

        if (error) throw error;

        const enriched = await enrichReport(report);

        return res.json({ success: true, report: enriched });
      } catch (err: any) {
        console.error("Get Service Report By Job ID Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    };
